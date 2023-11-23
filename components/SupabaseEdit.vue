<script setup lang="ts">
interface ILookupItem {
    key: string;
    value: any;
}

type SortDirection = 'asc' | 'desc';

interface ISortConfig {
    property: string;
    direction: SortDirection;
}

import { IColumnConfig, ISchema, TableNames } from '~/assets/js/app';
import { getColumnsFor, getTableFor } from '~/common/utils';

const props = defineProps<{
    schema: ISchema,
    tableName: TableNames,
    editMode: boolean,
    model: any
}>();

const emit = defineEmits(['formSubmitted', 'formClosed'])

const client = useSupabaseClient();

const showSidebar = ref(false);
const crudOverlayOpen = ref(false);
const lookups: any = ref({});
const invalid = ref(false);
const validationModel: any = ref({});
const formValidationError = ref("");

function getColumns(): IColumnConfig[] {
    return getColumnsFor( props.schema.tables, props.tableName).filter(c => c.type !== "id").sort((a, b) => a.formOrder - b.formOrder) ?? [];
}

const openSidebar = () => {
    invalid.value = false;
    validationModel.value = {};
    crudOverlayOpen.value = true;
    showSidebar.value = true;
};

function getInputType(column: IColumnConfig): string {
    if (column.type === "boolean") {
        return "checkbox";
    } else if (column.type === "date") {
        return "date";
    } else if (column.type === "number") {
        return "number";
    }
    return "text";
}

function closeSidebar() {
    showSidebar.value = false;
    emit("formClosed", { model: props.model });
    crudOverlayOpen.value = false;
}

function checkFormValidation() {
    validationModel.value = {};
    let isValid = true;
    for (const column of getColumnsFor(props.schema.tables, props.tableName)) {
        if (column.required && String(props.model[column.fieldName] ?? "").length <= 0) {
            validationModel.value[column.fieldName] = `${column.title} is required`;
            isValid = false;
        }
        if (column.required && column.type === "image_url" && String(props.model[column.fieldName] ?? "").length > 0) {
            const image_element = document.getElementById(`img_${column.fieldName}`);
            if (image_element && (image_element as HTMLImageElement).src.endsWith("bad_image.jpg")) {
                console.log(image_element?.id)
                validationModel.value[column.fieldName] = `${column.title} is invalid`;
                isValid = false;
            }
        }
        if (column.validations && props.model[column.fieldName]) {
            for (const validation of column.validations) {
                const validationResult = validation(props.model, column, props.model[column.fieldName]);
                if (validationResult) {
                    validationModel.value[column.fieldName] = validationResult;
                    isValid = false;
                }
            }
        }
    }
    console.log("Validation Model:", validationModel.value);
    invalid.value = !isValid;
}

async function handleSubmit() {
    let canBeSubmitted = false;
    checkFormValidation();
    if (!invalid.value) {
        if (getTableFor(props.schema.tables, props.tableName)?.validation) {
            const formValidationMessage = await getTableFor(props.schema.tables, props.tableName)?.validation?.(props.model);
            if (formValidationMessage) {
                formValidationError.value = formValidationMessage;
                setTimeout(() => formValidationError.value = "", 4000);
            } else {
                canBeSubmitted = true;
            }
        } else {
            canBeSubmitted = true;
        }

        if (canBeSubmitted) {
            emit("formSubmitted", { model: props.model });
            crudOverlayOpen.value = false;
        }
    }
}

function sortByProperties(data: any[], ...sortProperties: ISortConfig[]): any[] {
    return data.sort((a, b) => {
        for (const sortConfig of sortProperties) {
            const { property, direction } = sortConfig;
            const aValue = (a as any)[property];
            const bValue = (b as any)[property];

            if (aValue < bValue) {
                return direction === 'asc' ? -1 : 1;
            } else if (aValue > bValue) {
                return direction === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });
}

async function getLookupItems(column: IColumnConfig): Promise<ILookupItem[]> {
    let result: ILookupItem[] = [];
    const filedIdName = getColumnsFor(props.schema.tables, props.tableName).find(c => c.type === "id")?.fieldName ?? "id";
    const fieldNames = column.lookup?.displayFieldName.split(",");
    const { data, error } = await client.from(column.lookup?.name ?? "").select(`${filedIdName}, ${column.lookup?.displayFieldName}`);
    for (const row of data as any[]) {
        const values: string[] = [];
        for (const fieldName of fieldNames || []) {
            values.push(String(row[fieldName.trim()]));
        }
        result.push({
            key: row[filedIdName],
            value: values.join(" ")
        });
    }
    result = sortByProperties(result, { property: "value", direction: "asc" });
    if (!column.required) {
        result = [{
            key: "",
            value: null,
        },
        ...result]
    }
    return result;
}

async function load() {
    const lookupColumns = getColumnsFor(props.schema.tables, props.tableName).filter(c => c.type === "lookup");
    if (lookupColumns) {
        for (const lookupColumn of lookupColumns) {
            const lookupItems = await getLookupItems(lookupColumn);
            lookups.value[lookupColumn.lookup?.name ?? ""] = lookupItems;
        }
    }
}

function handleImageError(event: Event, column: IColumnConfig, value: any) {
    delete validationModel.value[column.fieldName];
    if (value) {
        (event.target as HTMLImageElement).src = "/images/bad_image.jpg";
    } else {
        (event.target as HTMLImageElement).src = "/images/no_image.jpg";
    }
}

defineExpose({
    openSidebar,
    closeSidebar,
});


onMounted(async () => {
    await load();
});

</script>

<template>
    <!-- Overlay -->
    <div v-if="crudOverlayOpen"
        class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-10 overflow-hidden bg-gray-700 opacity-60"></div>
    <div class="flex flex-col">
        <!-- Right Sidebar (Initially Hidden) -->
        <div class="flex flex-col w-[350px] border bg-stone-100 rounded-md shadow-lg z-50 shadow-gray-600 fixed top-0 right-0 h-full p-4 transform transition-transform duration-300 ease-in-out"
            :class="{ 'translate-x-full': !showSidebar }">

            <div class="flex flex-col h-[100%] overflow-y-auto text-xs">
                <ClientOnly fallback-tag="span" fallback="Loading form...">
                    <form @submit.prevent="handleSubmit">
                        <div v-for="column in getColumns()" @focusout="checkFormValidation">
                            <div class="p-2"
                                :class="((invalid === true) && validationModel[column.fieldName] !== undefined) ? 'bg-red-100' : ''">
                                <label class="p-1 text-xs" :for="column.fieldName">{{ `${column.required ? '* ' :
                                    ''}${column.title}` }}</label>
                                <div v-if="column.type === 'lookup'">
                                    <select class="w-full rounded border px-3 py-2 text-gray-700 focus:outline-none"
                                        v-model="props.model[column.fieldName]">
                                        <option v-for="(item, index) in lookups[column.lookup?.name ?? '']"
                                            :value="item.key" :key="index"><label>{{ item.value
                                            }}</label></option>
                                    </select>
                                </div>
                                <div v-else-if="column.type === 'boolean'">
                                    <select class="w-full rounded border px-3 py-2 text-gray-700 focus:outline-none"
                                        v-model="props.model[column.fieldName]">
                                        <option v-for="(item, index) in [null, true, false]" :value="item" :key="index">
                                            <label>{{ `${item === true ? 'YES' : (item === false ? 'NO' : '')}` }}</label>
                                        </option>
                                    </select>
                                </div>
                                <div v-else-if="column.type === 'memo'">
                                    <textarea cols="40" rows="5" v-model="props.model[column.fieldName]"
                                        class="w-full rounded border px-3 py-2 text-gray-700 focus:outline-none"
                                        :id="column.fieldName" :type="getInputType(column)" :placeholder="column.title" />
                                </div>
                                <div v-else-if="column.type === 'image_url'">
                                    <input v-model="props.model[column.fieldName]"
                                        class="w-full rounded border px-3 py-2 text-gray-700 focus:outline-none"
                                        :id="column.fieldName" :type="getInputType(column)" :placeholder="column.title" />
                                    <img :id="`img_${column.fieldName}`" :ref="`img_${column.fieldName}`"
                                        class="mt-1 rounded-md"
                                        :src="props.model[column.fieldName] ?? '/images/no_image.jpg'" width="500"
                                        :alt="column.title"
                                        @error="handleImageError($event, column, props.model[column.fieldName])" />
                                </div>
                                <div v-else-if="column.type === 'file_url'">
                                    <FileUploader :allowedExtensions="['.pdf']" uploadFolder="test" :id="column.fieldName"
                                        v-model="props.model[column.fieldName]"
                                        class="w-full rounded border px-3 py-2 text-gray-700 focus:outline-none" />
                                </div>
                                <div v-else="column.type === 'string'">
                                    <input v-model="props.model[column.fieldName]"
                                        class="w-full rounded border px-3 py-2 text-gray-700 focus:outline-none"
                                        :id="column.fieldName" :type="getInputType(column)" :placeholder="column.title" />
                                </div>
                                <span class="text-xs text-red-700 ml-1"
                                    v-if="(invalid === true) && validationModel[column.fieldName] !== undefined"> {{
                                        String(validationModel[column.fieldName]) }}</span>


                            </div>
                        </div>
                        <div class="h-[44px]">
                            <transition name="fade" mode="out-in">
                                <div v-if="formValidationError" class="flex bg-red-100 ml-2 mr-2 p-3 min-w-max rounded-md">
                                    <span class=" text-xs text-red-700 ml-1"> {{ formValidationError }}</span>
                                </div>
                            </transition>
                        </div>
                    </form>
                </ClientOnly>
                
            </div>
            <div class="flex mb-2 justify-center">
                    <button @click="handleSubmit" type="submit"
                        class="m-1 p-2 focus:shadow-outline rounded bg-cyan-500 px-2 py-2 text-white hover:bg-cyan-600 focus:outline-none">Submit</button>
                    <button @click="closeSidebar"
                        class="m-1 p-2 focus:shadow-outline rounded bg-red-500 px-2 py-2 text-white hover:bg-red-600 focus:outline-none">Close</button>
                </div>
            <!-- Sidebar content goes here -->
        </div>
    </div>
</template>
<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
