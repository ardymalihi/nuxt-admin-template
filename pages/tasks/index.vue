<script setup lang="ts">
import { app } from '~/assets/js/app';
definePageMeta({
    layout: "admin",
    middleware: [
        'auth',
    ]
});
const uploadedFile = ref({ fileName: '', path: ''});
</script>
<template>
    <div class="container mx-auto">
        <SupabaseView :schema="app.schema" table-name="tasks" view-type="card" />
        <FileUploader :allowedExtensions="['.pdf']" uploadFolder="test" v-model="uploadedFile" />
    </div>
    <div>fileName: {{ uploadedFile.fileName }}, path: {{ uploadedFile.path }}</div>
</template>
