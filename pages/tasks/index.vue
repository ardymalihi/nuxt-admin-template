<script setup lang="ts">
definePageMeta({
    layout: "admin",
    middleware: [
    'auth',
  ]
});

const client = useSupabaseClient();

interface Task {
    id: number;
    title: string;
    completed: boolean;
}

const { data: tasks, error } = await client.from("tasks").select("id, title, completed").order("created_at");
console.log("tasks:", tasks);


</script>
<template>
    <div class="container mx-auto">
        <div class="shadow-md bg-cyan-500 rounded-md overflow-hidden">
            <div class="flex h-12">
                <div class="w-1/3 p-2 bg-cyan-500 text-white">ID</div>
                <div class="w-1/3 p-2 bg-cyan-500 text-white">Title</div>
                <div class="w-1/3 p-2 bg-cyan-500 text-white">Complated</div>
            </div>
            <div v-for="task in tasks" class="flex group bg-white hover:bg-gray-100 h-12">
                <div class="w-1/3 p-2 border-b border-gray-300">{{ task.id }}</div>
                <div class="w-1/3 p-2 border-b border-gray-300"> {{ task.title }}</div>
                <div class="w-1/3 p-2 border-b border-gray-300">{{ task.completed ? "Yes" : "No" }}</div>
            </div>
        </div>
    </div>
</template>
