<script setup lang="ts">
export type IColumnConfig = {
    fieldName: string,
    title: string,
}
export interface ITableConfig {
    tableName: string;
    columns: IColumnConfig[] | null,
}
const props = defineProps<{
    config: ITableConfig
}>();

const client = useSupabaseClient();

console.log(props.config.columns?.map(c => c.fieldName).join(","));
const { data: rows, error } = await client.from(props.config.tableName).select(props.config.columns?.map(c => c.fieldName).join(","));
</script>
<template>
    <div class="shadow-md bg-cyan-500 rounded-md overflow-hidden">
        <div class="flex h-12">
            <div v-for="column in props.config.columns" class="w-1/3 p-2 bg-cyan-500 text-white">{{ column.title }}</div>
        </div>
        <div v-for="row in rows" class="flex group bg-white hover:bg-gray-100 h-12">
            <div v-for="column in props.config.columns" class="w-1/3 p-2 border-b border-gray-300">{{ (row as any)[column.fieldName] }}</div>
        </div>
    </div>
</template>