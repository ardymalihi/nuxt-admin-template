<script setup lang="ts">
import CrudSidebar from '~/components/CrudSidebar.vue';
import { IColumnConfig, TableNames, app } from '~/assets/js/app';
import { useAuthStore } from '~/stores/AuthStore';
const props = defineProps<{
    tableName: TableNames
}>();

const authStore = useAuthStore();
const users = await authStore.getAllUsers();
console.log("users:", users);

function formatValue(row: any, column: IColumnConfig): string {
    let value = row[column.fieldName];
    if (column.type === "lookup" && column.lookup) {
        value = row[column.lookup.name][column.lookup.displayFieldName]
    }
    else if (column.type === "boolean") {
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
    deleteModal.value = false;
}

function getSelectFields(): string {
    let selectedFields = "*";
    let selectedLookups = "";
    const columns = app.table[props.tableName].columns ?? [];
    if (columns.length) {
        selectedFields = columns.map(c => c.fieldName).join(",");
        const lookups: {
            tableName: string;
            fieldNames: string[];
        }[] = [];
        const lookupColumns = columns.filter(c => c.type === 'lookup');
        lookupColumns.forEach(lc => {
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
        });
        selectedFields = selectedFields + (selectedLookups ? `, ${selectedLookups}` : "");
    }
    return selectedFields;
}

async function load() {
    console.log("columns:", getSelectFields());
    console.log("field id name:", filedIdName);
    const { data, error } = await client.from(props.tableName).select(getSelectFields());
    console.log("data:", data);
    rows.value = data as any[];
}

const rows = ref<any[]>([]);
const overlayOpen = ref(false);
const deleteModal = ref(false);
const currentId = ref<string>();
const crudSidebar = ref<InstanceType<typeof CrudSidebar> | null>(null)
const filedIdName = app.table[props.tableName].columns?.find(c => c.type === "id")?.fieldName ?? "id";

function toggleCrudSidebar() {
    crudSidebar.value?.toggleSidebar();
}

const client = useSupabaseClient();

await load();
</script>
<template>
    <CrudSidebar ref="crudSidebar">
        <p>this is a test</p>
    </CrudSidebar>
    <!-- Overlay -->
    <div v-if="overlayOpen" ref="overlay"
        class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-10 overflow-hidden bg-gray-700 opacity-60"
        @click="closeOverlay"></div>
    <!-- Delete Modal -->
    <div v-if="deleteModal" ref="overlay"
        class="flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-10"
        @click="closeOverlay">
        <div
            class="bg-white relative transform overflow-hidden rounded-lg  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
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
                    class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    @click="deleteRecord">Delete</button>
                <button type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    @click="closeDeleteModal">Cancel</button>
            </div>
        </div>
    </div>
    <table class="table-fixed w-[100%] shadow-md rounded-md overflow-hidden">
        <thead class="bg-cyan-500 h-[60px]">
            <tr class="text-left text-white">
                <th v-for="column in app.table[props.tableName].columns" class="p-2">{{ column.title }}</th>
                <th v-if="app.table[props.tableName].editable" class="p-2 w-[58px]">
                </th>
                <th v-if="app.table[props.tableName].editable" class="p-2 w-[58px]">
                    <button
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
            <tr v-for="row in rows" class="border hover:bg-gray-100 h-[50px]">
                <td v-for="column in app.table[props.tableName].columns" class="p-2">
                    <div v-html="formatValue(row, column)"></div>
                </td>
                <td v-if="app.table[props.tableName].editable" class="p-2">
                    <button @click="openDeleteModal(String((row as any)[filedIdName]))"
                        class="w-full focus:shadow-outline rounded px-2 py-2 text-cyan-500 hover:text-white hover:bg-cyan-600 hover:rounded-full focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </td>
                <td v-if="app.table[props.tableName].editable" class="p-2">
                    <button @click="toggleCrudSidebar"
                        class="w-full focus:shadow-outline rounded px-2 py-2 text-cyan-500 hover:text-white hover:bg-cyan-600 hover:rounded-full focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                </button>
            </td>
        </tr>
    </tbody>
</table></template>