<script setup lang="ts">

type TMenuItem = {
    name: string,
    icon: string, 
    route: string,
}

const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();
const menuItems: TMenuItem[] = [
    {
        name: "Profile",
        icon: "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z",
        route: "/profile"
    },
    {
        name: "Preps",
        icon: "M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z",
        route: "/profile"
    },
    {
        name: "Settings",
        icon: "M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z",
        route: "/settings"
    }
];


const sidebarOpen = ref(false);
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
            <div ref="sidebar" class="sidebar text-cyan-200 bg-gray-900 bg-opacity-95 absolute rounded-md overflow-hidden"
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
                <div class="p-3 m-3 space-y-5">
                    <div v-for="menuItem in menuItems"
                        class="flex p-2 rounded-md hover:text-gray-500 hover:bg-cyan-200 transition duration-200 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                :d="menuItem.icon" />
                        </svg><span class="ml-4">{{ menuItem.name }}</span>
                        

                    </div>
                </div>
            </div>
            <!-- Main Pane -->
            <div class="w-[100%]" ref="main">
                <!--Header Pane -->
                <div class="flex h-[64px] text-cyan-200">
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





