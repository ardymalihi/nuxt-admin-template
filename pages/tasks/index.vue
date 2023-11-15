<script setup lang="ts">
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
        <Table table-name="tasks" />
    </div>
</template>
