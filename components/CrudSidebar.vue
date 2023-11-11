<template>
    <div class="flex">
        <!-- Right Sidebar (Initially Hidden) -->
        <div class="w-[400px] bg-stone-50 rounded-tl-md rounded-bl-md border border-gray-200 fixed top-0 right-0 h-full p-4 transform transition-transform duration-300 ease-in-out"
            :class="{ 'translate-x-full': !showSidebar }">

            <div class="flex flex-col h-[90%] overflow-y-auto">
                <slot />
                <form @submit.prevent="handleSubmit">
                    <div v-for="column in app.table[props.tableName].columns">
                        <div>
                            <label class="p-1 text-xs" :for="column.fieldName">{{ column.title }}</label>
                            <div v-if="column.type === 'string'">
                                <input v-model="props.model[column.fieldName]"
                                    class="w-full rounded border px-3 py-2 text-gray-700 focus:outline-none"
                                    :id="column.fieldName" type="text" :placeholder="column.title" />
                            </div>
                            <div v-else-if="column.type === 'lookup'">
                                <select class="w-full rounded border px-3 py-2 text-gray-700 focus:outline-none"
                                    v-model="props.model[column.fieldName]">
                                    <option v-for="(item, index) in lookups[column.lookup?.name ?? '']" :value="item.key" :key="index"><label>{{ item.value
                                    }}</label></option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="flex mt-auto justify-center">
                <button @click="handleSubmit"
                    class="m-1 p-2 focus:shadow-outline rounded bg-cyan-500 px-2 py-2 text-white hover:bg-cyan-600 focus:outline-none">Submit</button>
                <button @click="toggleSidebar"
                    class="m-1 p-2 focus:shadow-outline rounded bg-red-500 px-2 py-2 text-white hover:bg-red-600 focus:outline-none">Close</button>
            </div>
            <!-- Sidebar content goes here -->
        </div>
    </div>
</template>
  
<script setup lang="ts">
interface ILookupItem {
    key: string;
    value: any;
}
import { IColumnConfig, TableNames, app } from '~/assets/js/app';

const client = useSupabaseClient();

const showSidebar = ref(false);
const lookups: any = ref({});


const toggleSidebar = () => {
    showSidebar.value = !showSidebar.value;
};

function handleSubmit() {
    alert(JSON.stringify(props.model));
}

async function getLookupItems(column: IColumnConfig): Promise<ILookupItem[]> {
    const result: ILookupItem[] = [];
    const filedIdName = app.table[props.tableName].columns?.find(c => c.type === "id")?.fieldName ?? "id";
    const { data, error } = await client.from(column.lookup?.name ?? "").select(`${filedIdName}, ${column.lookup?.displayFieldName}`);
    const fieldNames = column.lookup?.displayFieldName.split(",");
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
    return result;
}


defineExpose({
    toggleSidebar
});

const props = defineProps<{
    tableName: TableNames,
    editMode: boolean,
    model: any
}>();


async function load() {
    const lookupColumns = app.table[props.tableName].columns?.filter(c => c.type === "lookup");
    if (lookupColumns) {
        for (const lookupColumn of lookupColumns) {
            const lookupItems = await getLookupItems(lookupColumn);
            lookups.value[lookupColumn.lookup?.name ?? ""] = lookupItems;
        }
    }
}

onMounted(async () => {
    await load();
   });

</script>
  