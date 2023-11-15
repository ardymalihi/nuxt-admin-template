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
    <img src="~/assets/images/no_image.png" />
    <div class="container mx-auto">
        <SupabaseView :schema="app.schema" table-name="tasks" />
    </div>
</template>
