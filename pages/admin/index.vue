<script setup lang="ts">
definePageMeta({
    layout: "admin",
    middleware: [
    'auth',
  ]
});
</script>
<template>
   <div class="bg-gray-300 p-10 m-10">
        <h1>Admin Page</h1>
    </div>
</template>
