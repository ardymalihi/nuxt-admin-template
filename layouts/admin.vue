<script setup lang="ts">

const sidebarOpen = ref(false);
const sidebar = ref<HTMLDivElement>();

function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
}
</script>
<template>
    <div class="bg-gradient-to-br from-black via-cyan-700 to-pink-200 flex min-h-screen">
        <div class="flex w-screen m-10 rounded-md overflow-hidden">
            <!-- Sidebar Pane -->
            <div v-show="sidebarOpen" ref="sidebar" class="w-[300px] bg-gray-500 m-10 absolute inset-y-0 left-0 rounded-tl-md rounded-bl-md overflow-hidden">
                <div class="flex h-[80px]">
                    <div class="flex-row bg-green-500 p-5" @click="toggleSidebar">close</div>
                    <div class="flex-row ml-5 p-5">logo</div>   
                </div>
                 <!-- Menu Items -->
                <div class="flex bg-yellow-500 w-max p-3 m-3">
                    Menu 1 
                </div>
                
            </div>
            <!-- Main Pane -->
            <div class="w-[100%]" ref="main">
                <!--Header Pane -->
                <div class="flex h-[80px] bg-blue-500">
                    <div class="flex-row bg-green-500 p-5" @click="toggleSidebar">close</div>
                    <div class="flex-row ml-5 p-5">logo</div>   
                </div>
                <!-- Content Pane -->
                <div class="h-[100%] bg-yellow-500 p-5">
                    <!-- Content Pane Content -->
                    <slot />
                </div>
            </div>
        </div>
        <!-- <section class="container mx-auto">
            <slot />
        </section> -->
    </div>
</template> 
