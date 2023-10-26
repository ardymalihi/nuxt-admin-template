<script setup lang="ts">

const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

const sidebarOpen = ref(true);
const sidebar = ref<HTMLDivElement>();

async function logout() {
    await client.auth.signOut();
    router.push("/login");
}

function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
}
</script>
<template>
    <div class="bg-gradient-to-br from-black via-cyan-700 to-pink-200 flex min-h-screen">
        <div class="flex w-screen rounded-md overflow-hidden">
            <!-- Sidebar Pane -->
            <div ref="sidebar" class="sidebar text-blue-200 bg-gray-900 bg-opacity-95 absolute rounded-md overflow-hidden"
                :class="{ open: sidebarOpen }">
                <div class="flex h-[64px]">
                    <div class="flex-row p-5" @click="toggleSidebar">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6 cursor-pointer">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <div class="flex-row ml-5 p-5">logo</div>
                </div>
                <!-- Menu Items -->
                <div class="flex w-max p-3 m-3">
                    Menu 1
                </div>
            </div>
            <!-- Main Pane -->
            <div class="w-[100%]" ref="main">
                <!--Header Pane -->
                <div class="flex h-[64px] text-blue-200">
                    <div class="flex-row p-5" @click="toggleSidebar">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6 cursor-pointer">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </div>
                    <div class="flex-row ml-5 p-5">logo</div>
                    <div class="flex-row w-[100%]"></div>
                    <div v-if="user" class="flex-row  ml-5 p-5">
                        <button @click="logout" class="text-s">Logout</button>
                    </div>
                    <div v-else>
                        <a href="/login" class="text-s mr-4">Login</a>
                        <a href="/signup" class="text-s">Sign Up</a>
                    </div>
                </div>
                <!-- Content Pane -->
                <div class="h-[100%] p-5">
                    <!-- Content Pane Content -->
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template> 
<style scoped>
.sidebar {
    transform: translateX(-300px);
    width: 300px;
    height: 100%;
    transition: transform 0.3s;
}

.sidebar.open {
    transform: translateX(0);
}

.close-button {
    transform: translateX(-300px);
}
</style>





