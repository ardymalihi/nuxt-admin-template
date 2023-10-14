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
if (user.value) {
    const { data: tasks, error } = await client.from("tasks").select("id, title, completed").eq("user_id", user.value.id).order("created_at");
    console.log(tasks);
}

</script>
<template>
    <div class="bg-gray-300 p-10 m-10">
        <h1>Tasks</h1>
    </div>
</template>
