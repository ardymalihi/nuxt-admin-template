<script setup lang="ts">
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
                },
                {
                    fieldName: 'title',
                    title: 'Title',
                },
                {
                    fieldName: 'completed',
                    title: 'Completed'
                }
            ]
        }" />
    </div>
</template>
