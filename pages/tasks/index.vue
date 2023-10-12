<script setup lang="ts">
definePageMeta({
    layout: "admin",
});
import { watchEffect } from 'vue';

const user = useSupabaseUser();
const client = useSupabaseClient();

const router = useRouter();

watchEffect(() => {
    if (!user.value) {
        router.push("/login");
    }
})

    const { data: tasks, error } =  await client.from("tasks").select("id, title, completed").order("created_at");
    

console.log(tasks);
</script>
<template>
    <h1>Tasks</h1>
</template>
