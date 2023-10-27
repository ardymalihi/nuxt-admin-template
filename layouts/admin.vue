<script setup lang="ts">

import Sidebar from '../components/Sidebar.vue';

const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

const sidebar = ref<InstanceType<typeof Sidebar> | null>(null)

async function logout() {
    await client.auth.signOut();
    router.push("/login");
}

</script>
<template>
    <div class="bg-gradient-to-br from-black via-cyan-700 to-pink-200 flex min-h-screen">
        <div class="flex w-screen rounded-md overflow-hidden">
            <!-- Sidebar Pane -->
            <Sidebar ref="sidebar"/>
            <!-- Main Pane -->
            <div class="w-[100%]" ref="main">
                <!--Header Pane -->
                <div class="flex h-[64px] text-cyan-200">
                    <div class="flex-row p-5" @click="sidebar?.toggleSidebar">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="p-1 w-8 h-8 cursor-pointer hover:bg-cyan-900 rounded-full">
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


