<script setup lang="ts">
import CrudSidebar from '~/components/CrudSidebar.vue';
import { IColumnConfig, ISchema, TableNames } from '~/assets/js/app';

const props = defineProps<{
    schema: ISchema;
    tableName: TableNames;
    viewType: 'table' | 'card' | 'detail'
}>();

const rows = ref<any[]>([]);
const overlayOpen = ref(false);

const deleteModal = ref(false);
const crudSidebarEditMode = ref(true);
const currentId = ref<string>();
const currentRow = ref<any>(createEmptyRow());
const crudSidebar = ref<InstanceType<typeof CrudSidebar> | null>(null);
const filedIdName = props.schema.table[props.tableName].columns?.find(c => c.type === "id")?.fieldName ?? "id";
const currentOrderFieldName = ref(filedIdName);
const isAscending = ref(true);

const client = useSupabaseClient();

function formatValue(row: any, column: IColumnConfig): string {
    let value = row[column.fieldName] ?? "";
    if (column.type === "lookup" && column.lookup) {
        const fieldNames = column.lookup.displayFieldName.split(",");
        const values: string[] = [];
        for (const fieldName of fieldNames) {
            if (row[column.lookup.name]) {
                values.push(String(row[column.lookup.name][fieldName.trim()]) ?? "")
            }
        }
        value = values.join(" ");
    } else if (column.type === "image_url") {
        if (row[column.fieldName]) {
            const size = `${props.viewType === 'card' ? '200px' : '40px'}`;
            const align = `${props.viewType === 'card' ? 'justify-center items-center' : ''}`;
            value = `<div class="flex ${align} h-[${size}]"><img class="h-[${size}] rounded-md" src="${row[column.fieldName]}" /></div>`
        }
    } else if (column.type === "boolean") {
        value = value ? "YES" : "NO";
    }

    if (column.customFormatter) {
        return column.customFormatter(row, column, value);
    } else {
        return `<span>${value}</span>`;
    }
}

function openDeleteModal(id: string) {
    console.log("deleting:", id);
    currentId.value = id;
    const found = rows.value.find(r => String(r[filedIdName]) === String(id));
    currentRow.value = { ...createEmptyRow(), ...found };
    deleteModal.value = true;
}

function closeOverlay() {
    overlayOpen.value = false;
}

function closeDeleteModal() {
    deleteModal.value = false;
}

async function deleteRecord() {
    const { error } = await client.from(props.tableName).delete().match({ [`${filedIdName}`]: currentId.value });
    if (!error) {
        await load();
    }
    currentId.value = undefined;
    currentRow.value = createEmptyRow();
    deleteModal.value = false;
}

function getSelectFields(): string {
    let selectedFields = "*";
    let selectedLookups = "";
    const columns = (props.schema.table[props.tableName].columns ?? []).filter(f => f.type !== "collection");
    if (columns.length) {
        selectedFields = columns.map(c => c.fieldName).join(",");
        const lookups: {
            tableName: string;
            fieldNames: string[];
        }[] = [];
        const lookupColumns = columns.filter(c => c.type === 'lookup');
        for (const lc of lookupColumns) {
            const foundLookup = lookups.find(l => l.tableName === lc.lookup?.name);
            if (!foundLookup) {
                lookups.push({
                    tableName: lc.lookup?.name ?? "",
                    fieldNames: [lc.lookup?.displayFieldName ?? ""]
                })
            } else {
                foundLookup?.fieldNames.push(lc.lookup?.displayFieldName ?? "");
            }
            selectedLookups = lookups.map(l =>
                l.tableName + "(" + l.fieldNames.join(",") + ")"
            ).join(",")
        }
        selectedFields = selectedFields + (selectedLookups ? `, ${selectedLookups}` : "");
    }
    return selectedFields;
}

async function load() {
    console.log("columns:", getSelectFields());
    console.log("field id name:", filedIdName);
    const { data, error } = await client.from(props.tableName).select(getSelectFields()).order(currentOrderFieldName.value, { ascending: isAscending.value });
    console.log("data:", data);
    rows.value = data as any[];
}

function showInsertModal() {
    crudSidebarEditMode.value = false;
    currentId.value = undefined;
    currentRow.value = createEmptyRow();
    crudSidebar.value?.openSidebar();
}

function showEditModal(id: string) {
    crudSidebarEditMode.value = true;
    currentId.value = id;
    const found = rows.value.find(r => String(r[filedIdName]) === String(id));
    currentRow.value = { ...createEmptyRow(), ...found };
    crudSidebar.value?.openSidebar();
}

function createEmptyRow(): any {
    const result: any = {};
    for (let c of props.schema.table[props.tableName].columns ?? ([] as IColumnConfig[])) {
        result[c.fieldName] = c.defaultValue ?? null;
    }
    return result;
}

function getInsertReadyObject(obj: any) {
    const result = { ...obj };
    for (var propName in result) {
        if (result[propName] === null || result[propName] === undefined || propName === filedIdName) {
            delete result[propName];
        }
    }
    return result;
}

function getUpdateReadyObject(obj: any) {
    const result: any = {};
    const columns = (props.schema.table[props.tableName].columns ?? []);
    for (const column of columns) {
        result[column.fieldName] = obj[column.fieldName] ?? null;
    }
    return result;
}

async function handleSubmit({ model }: any) {
    if (crudSidebarEditMode.value) {
        const updateObject = getUpdateReadyObject(model);
        const { error, data } = await client.from(props.tableName).update(updateObject as never).eq(filedIdName, String(currentId.value)).select();
        if (error) {
            console.error(error);
        }
    } else {
        const insertObject = getInsertReadyObject(model);
        const { error } = await client.from(props.tableName).insert(insertObject);
        currentRow.value = createEmptyRow();
        currentId.value = undefined;
    }
    crudSidebar.value?.closeSidebar();
    await load();
}

function getOrderedColumns() {
    return props.schema.table[props.tableName].columns?.filter(c => c.columnOrder > 0).sort((a, b) => a.columnOrder - b.columnOrder);
}

function getOrderedCards() {
    return props.schema.table[props.tableName].columns?.filter(c => c.columnOrder > 0).sort((a, b) => a.columnOrder - b.columnOrder).slice(0, 3);
}

function getColumnVisibility(column: IColumnConfig): string {
    let result = '';
    if (column.columnOrder >= 3 && column.columnOrder <= 4) {
        result = "hidden md:table-cell";
    } else if (column.columnOrder > 4) {
        result = "hidden lg:table-cell";
    }
    return result;
}

async function orderBy(column: IColumnConfig) {
    if (currentOrderFieldName.value === column.fieldName) {
        if (isAscending) {
            isAscending.value = !isAscending.value;
        }
    } else {
        currentOrderFieldName.value = column.fieldName;
        isAscending.value = true;
    }
    await load();
}

function getCardStyle(column: IColumnConfig) {
    if (column.columnOrder <= 2) {
        return "text-center text-lg font-medium text-gray-900";
    } else {
        return "text-center p-3 rounded-md text-sm font-medium text-gray-900";
    }
}


await load();
</script>
<template>
    <!-- Overlay -->
    <div v-if="overlayOpen" 
        class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-10 overflow-hidden bg-gray-700 opacity-60"
        @click="closeOverlay"></div>
    <CrudSidebar ref="crudSidebar" :schema="props.schema" :table-name="props.tableName" :edit-mode="crudSidebarEditMode"
        :model="currentRow" @form-submitted="handleSubmit" />
    <!-- Delete Modal -->
    <div v-if="deleteModal"
        class="flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 w-full h-screen"
        @click="closeOverlay">
        <div
            class="bg-stone-50 relative transform overflow-hidden rounded-lg border text-left shadow-xl shadow-black transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div class="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                    <div
                        class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Delete record!</h3>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500">Are you sure you want to delete this record? </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button"
                    class="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 sm:ml-3 sm:w-auto"
                    @click="deleteRecord">Delete</button>
                <button type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    @click="closeDeleteModal">Cancel</button>
            </div>
        </div>
    </div>
    <!-- Table View Type -->
    <table v-if="props.viewType === 'table'" class="table-fixed w-[100%] shadow-md rounded-md overflow-hidden">
        <thead class="bg-cyan-500 h-[60px]">
            <tr class="text-left text-white">
                <th @click="orderBy(column)" class="p-2" :class="getColumnVisibility(column)"
                    v-for="(column, index) in getOrderedColumns()">
                    <span class="cursor-pointer">{{ column.title }}</span>
                    <span v-if="column.fieldName === currentOrderFieldName && isAscending === true">↑</span>
                    <span v-if="column.fieldName === currentOrderFieldName && isAscending === false">↓</span>
                </th>
                <th v-if="props.schema.table[props.tableName].editable" class="p-2 w-[58px]">
                </th>
                <th v-if="props.schema.table[props.tableName].editable" class="p-2 w-[58px]">
                    <!-- Insert Button-->
                    <button @click="showInsertModal"
                        class="w-full focus:shadow-outline rounded  px-2 py-2 text-white hover:bg-cyan-600 hover:rounded-full focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                </th>
            </tr>
        </thead>
        <tbody class="bg-white">
            <tr v-for="(row, index) in rows" class="border hover:bg-stone-50 h-[50px]">
                <td class="p-2" :class="getColumnVisibility(column)" v-for="(column, index) in getOrderedColumns()"
                    :key="index">
                    <div v-html="formatValue(row, column)"></div>
                </td>
                <td v-if="props.schema.table[props.tableName].editable" class="p-2">
                    <!-- Delete Button-->
                    <button @click="openDeleteModal(String((row as any)[filedIdName]))"
                        class="w-full focus:shadow-outline rounded px-2 py-2 text-cyan-500 hover:text-white hover:bg-cyan-500 hover:rounded-full focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </td>
                <td v-if="props.schema.table[props.tableName].editable" class="p-2">
                    <!-- Edit Button-->
                    <button @click="showEditModal(String((row as any)[filedIdName]))"
                        class="w-full focus:shadow-outline rounded px-2 py-2 text-cyan-500 hover:text-white hover:bg-cyan-500 hover:rounded-full focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
    <!-- Card View Type -->
    <div v-if="props.viewType === 'card'" class="flex flex-wrap">
        <div v-for="(row, index) in rows"
            class="flex flex-col border bg-slate-50 rounded-md p-2 m-2 w-[300px] shadow-lg shadow-gray-600 hover:bg-cyan-50">
            <div class="p-2 text" :class="getColumnVisibility(column)" v-for="(column, index) in getOrderedCards()"
                :key="index">
                <div :class="`${getCardStyle(column)}`" v-html="formatValue(row, column)"></div>
            </div>
            <div class="flex flex-row justify-end">
                <!-- Edit Button-->
                <button @click="showEditModal(String((row as any)[filedIdName]))"
                    class="focus:shadow-outline rounded px-2 py-2 text-cyan-500 hover:text-white hover:bg-cyan-500 hover:rounded-full focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                </button>
                <!-- Delete Button-->
                <button @click="openDeleteModal(String((row as any)[filedIdName]))"
                    class="focus:shadow-outline rounded px-2 py-2 text-cyan-500 hover:text-white hover:bg-cyan-500 hover:rounded-full focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button>
            </div>
        </div>
        <div
            class="flex border bg-cyan-500 rounded-md p-2 m-2 w-[300px] shadow-lg shadow-gray-600 justify-center items-center">
            <!-- Insert Button-->
            <button @click="showInsertModal"
                class="focus:shadow-outline rounded  px-2 py-2 text-white hover:bg-cyan-600 hover:rounded-full focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-16 h-16">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        </div>
    </div>
</template>