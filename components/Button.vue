<script setup lang="ts">

const props = defineProps({
    title: {
        type: String,
        required: true,
    }
})
</script>

<style scoped></style>

<template>
    <button
        class="w-full focus:shadow-outline rounded bg-cyan-500 px-2 py-2 text-white hover:bg-cyan-600 focus:outline-none">{{
            props.title }}</button>
</template>