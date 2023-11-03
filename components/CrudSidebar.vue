<template>
    <div class="flex">
        <!-- Right Sidebar (Initially Hidden) -->
        <div class="w-64 bg-gray-200 fixed top-0 right-0 h-full p-4 transform transition-transform duration-300 ease-in-out"
            :class="{ 'translate-x-full': !showSidebar }">
            <!-- Sidebar content goes here -->
            <slot />
        </div>
    </div>
</template>
  
<script setup lang="ts">
const showSidebar = ref(false);

const toggleSidebar = () => {
    showSidebar.value = !showSidebar.value;
};

defineExpose({
    toggleSidebar
});

</script>
  