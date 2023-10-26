<script setup lang="ts">
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

async function logout() {
    await client.auth.signOut();
    router.push("/login");
}
</script>
<template>
    <!-- Header Section -->
    <header class="bg-white shadow-md py-4">
        <div class="container mx-auto flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-semibold">SAAS Product</h1>
            </div>
            <div v-if="user">
                <button @click="logout" class="text-s text-cyan-500 hover:text-cyan-700">Logout</button>
            </div>
            <div v-else>
                <a href="/login" class="text-s text-cyan-500 hover:text-cyan-700 mr-4">Login</a>
                <a href="/signup" class="text-s text-cyan-500 hover:text-cyan-700">Sign Up</a>
            </div>
        </div>
    </header>
    <div>
        <slot />
    </div>
    <!-- Footer Section -->
    <footer class="bg-gray-800 text-white py-4">
        <div class="container mx-auto text-center">
            <p>&copy; 2023 SAAS Product. All rights reserved.</p>
        </div>
    </footer>
</template>