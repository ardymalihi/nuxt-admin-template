<script setup lang="ts">

type TMenuItem = {
    name: string,
    icon: string,
    route: string,
}
const menuItems: TMenuItem[] = [
    {
        name: "Profile",
        icon: "M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z",
        route: "/profile"
    },
    {
        name: "Preps",
        icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
        route: "/preps"
    },
    {
        name: "Settings",
        icon: "M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5",
        route: "/settings"
    }
];

const sidebarOpen = ref(false);
const sidebar = ref<HTMLDivElement>();

function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
}

defineExpose({
    toggleSidebar
});
</script>
<template>
    <div v-if="sidebarOpen" ref="overlay"
        class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-10 overflow-hidden bg-gray-700 opacity-60"
        @click="toggleSidebar"></div>
    <!-- Sidebar Pane -->
    <div 
        ref="sidebar" 
        class="sidebar text-cyan-200 bg-gray-900 absolute rounded-md overflow-hidden z-50"
        :class="{ open: sidebarOpen }">
        <div class="flex h-[64px]">
            <div class="flex-row p-5" @click="toggleSidebar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="p-1 w-8 h-8 cursor-pointer hover:bg-cyan-900 rounded-full">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <div class="flex-row ml-5 p-5">logo</div>
        </div>
        <!-- Menu Items -->
        <div class="p-3 m-3 space-y-5">
            <div v-for="menuItem in menuItems"
                class="flex p-2 rounded-md hover:bg-cyan-900 transition duration-200 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="menuItem.icon" />
                </svg><span class="ml-4">{{ menuItem.name }}</span>


            </div>
        </div>
    </div>
</template> 
<style scoped>
.sidebar {
    transform: translateX(-200px);
    width: 200px;
    height: 100%;
    transition: transform 0.3s;
}

.sidebar.open {
    transform: translateX(0);
}

.close-button {
    transform: translateX(-200px);
}
</style>



