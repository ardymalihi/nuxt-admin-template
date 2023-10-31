<script setup lang="ts">
import { IColumnConfig } from '~/components/Table.vue';

definePageMeta({
    layout: "admin",
    middleware: [
        'auth',
    ]
});
</script>
<template>
    <div class="container mx-auto">
        <Table :config="{
            tableName: 'tasks',
            editable: true,
            columns: [
                {
                    fieldName: 'id',
                    title: 'ID',
                    type: 'number',
                    customFormat: (row, column) => {
                        const value = row[column.fieldName];
                        if (value > 2) {
                            return `<span class='text-red-500'>${value}</span>`
                        }
                        return value
                    },
                },
                {
                    fieldName: 'title',
                    title: 'Title',
                    type: 'string',
                },
                {
                    fieldName: 'completed',
                    title: 'Completed',
                    type: 'boolean',
                }
            ]
        }" />
    </div>
</template>
