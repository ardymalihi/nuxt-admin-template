<script setup lang="ts">
definePageMeta({
    layout: "admin",
});
import { watchEffect } from 'vue';

const user = useSupabaseUser();
const client = useSupabaseClient();

const router = useRouter();

interface Task {
    id: number;
    title: string;
    completed: boolean;
}

watchEffect(() => {
    if (!user.value) {
        router.push("/login");
    }
})

const { data: tasks, error } = await client.from("tasks").select("id, title, completed").order("created_at");
console.log("tasks:", tasks);


</script>
<template>
    <div class="container mx-auto pt-10">
        <div class="bg-white shadow-md rounded-md">
            <div class="flex h-12">
                <div class="w-1/3 p-2 bg-blue-500 text-white">ID</div>
                <div class="w-1/3 p-2 bg-blue-500 text-white">Title</div>
                <div class="w-1/3 p-2 bg-blue-500 text-white">Complated</div>
            </div>
            <div v-for="task in tasks" class="flex group hover:bg-gray-100 h-12">
                <div class="w-1/3 p-2 border-b border-gray-300">{{ task.id }}</div>
                <div class="w-1/3 p-2 border-b border-gray-300"> {{ task.title }}</div>
                <div class="w-1/3 p-2 border-b border-gray-300">{{ task.completed ? "Yes" : "No" }}</div>
            </div>
        </div>
    </div>
</template>
