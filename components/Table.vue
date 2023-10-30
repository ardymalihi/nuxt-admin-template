<script setup lang="ts">
export type IColumnConfig = {
    fieldName: string,
    title: string,
}
export interface ITableConfig {
    tableName: string;
    allowDelete: boolean;
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
    <table class="table-fixed w-[100%] shadow-md rounded-md overflow-hidden">
        <thead class="bg-cyan-500 h-12">
            <tr class="text-left text-white">
                <th v-for="column in props.config.columns" class="p-2">{{ column.title }}</th>
            </tr>
        </thead>
        <tbody class="bg-white">
            <tr v-for="row in rows" class="border hover:bg-gray-100 h-12">
                <td v-for="column in props.config.columns" class="p-2">{{ (row as any)[column.fieldName] }}</td>
            </tr>
        </tbody>
    </table>
</template>