<script setup lang="ts">
import { app } from '~/common/app';
definePageMeta({
    layout: "admin",
    middleware: [
        'auth',
    ]
});
</script>
<template>
    <div class="container mx-auto">
        <SupabaseView 
        :compact="false" 
        :schema="app.schema" 
        table-name="tasks" 
        view-type="table" 
        :editable="true" 
        :show-collections="true"
        sort-by="title"
    />
    </div>
</template>
