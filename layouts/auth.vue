<script setup lang="ts">
import { app } from '~/assets/js/app'

const sidebarOpen = ref(false);
const sidebar = ref<HTMLDivElement>();

function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
}
</script>
<template>
    <div class="bg-gradient-to-br from-black via-cyan-700 to-pink-200 flex min-h-screen">
        <slot/>
    </div>
</template> 
