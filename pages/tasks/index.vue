<script setup lang="ts">
import { app } from '~/assets/js/app';
definePageMeta({
    layout: "admin",
    middleware: [
        'auth',
    ]
});
const filePath = ref("");
</script>
<template>
    <div class="container mx-auto">
        <SupabaseView :schema="app.schema" table-name="tasks" view-type="card" />
        <FileUploader :allowedExtensions="['.pdf']" uploadFolder="test" v-model="filePath" />
    </div>
    <div>filePath: {{ filePath }}</div>
</template>
