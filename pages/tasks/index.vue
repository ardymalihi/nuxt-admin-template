<script setup lang="ts">
import { app } from '~/assets/js/app';
definePageMeta({
    layout: "admin",
    middleware: [
        'auth',
    ]
});
</script>
<template>
    <div class="container mx-auto">
        <SupabaseView :schema="app.schema" table-name="tasks" view-type="table" :editable="true" />
    </div>
</template>
