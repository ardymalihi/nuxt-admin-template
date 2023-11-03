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
        <Table tableName="tasks" />
    </div>
</template>
