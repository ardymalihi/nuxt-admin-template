<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
const client = useSupabaseClient();
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const successMessage = ref("");

async function signup() {
    try {
        if (password.value !== confirmPassword.value) {
            errorMessage.value = "The confirm password does not match";
            return;
        }
        const { error } = await client.auth.signUp({
            email: email.value,
            password: password.value,
        });
        if (error) throw error;
        successMessage.value = "Check your email to confirm your account."
        errorMessage.value = "";
    } catch (error) {
        successMessage.value = "";
        errorMessage.value = (error as Error).message;
    }
}
</script>
<template>
    <div class="flex items-center justify-center h-screen w-screen">
        <div class="mb-10 mr-10 mt-10 flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-100 p-5 shadow-sm">
            <div class="text-lg text-center">Sign up</div>
            <form @submit.prevent="signup">
                <div class="mb-4 flex flex-col gap-5">
                    <div>
                        <label class="p-1 text-xs" for="email">email</label>
                        <input v-model="email" class="w-full rounded border px-3 py-2 text-gray-700 focus:outline-none" id="email"
                            type="text" placeholder="email" />
                    </div>
                    <div>
                        <label class="p-1 text-xs" for="create password">create password</label>
                        <input v-model="password" class="w-full rounded border px-3 py-2 text-gray-700 focus:outline-none" id="password"
                            type="password" placeholder="create password" />
                    </div>
                    <div>
                        <label class="p-1 text-xs" for="confirm password">confirm password</label>
                        <input v-model="confirmPassword" class="w-full rounded border px-3 py-2 text-gray-700 focus:outline-none" id="confirmPassword"
                            type="password" placeholder="confirm password" />
                    </div>
                    <div>
                        <button
                            class="w-full focus:shadow-outline rounded bg-cyan-500 px-2 py-2 text-white hover:bg-cyan-600 focus:outline-none">Sign up</button>
                    </div>
                    <div class="w-full text-center">
                        <span class="text-xs">Alredy have an account? </span><a class="text-xs text-cyan-500 hover:text-cyan-600" href="/login">Login</a>
                    </div>
                </div>
            </form>
            <div class="text-lg text-center text-green-800">{{ successMessage }}</div>
            <div class="text-lg text-center text-red-800">{{ errorMessage }}</div>
        </div>
    </div>
</template>
