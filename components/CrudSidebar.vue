<template>
    <div class="flex">
        <!-- Right Sidebar (Initially Hidden) -->
        <div class="w-[400px] bg-stone-50 rounded-tl-md rounded-bl-md border border-gray-200 fixed top-0 right-0 h-full p-4 transform transition-transform duration-300 ease-in-out"
            :class="{ 'translate-x-full': !showSidebar }">

            <div class="flex flex-col h-[90%] overflow-y-auto">
                <slot />
                <form @submit.prevent="handleSubmit">
                    <div v-for="column in app.table[props.tableName].columns">
                        <div>
                            <label class="p-1 text-xs" :for="column.fieldName">{{ column.title }}</label>
                            <div v-if="column.type === 'string'">
                                <input v-model="props.model[column.fieldName]" class="w-full rounded border px-3 py-2 text-gray-700 focus:outline-none" :id="column.fieldName"
                            type="text" :placeholder="column.title" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="flex mt-auto justify-center">
                <button
                    @click="handleSubmit"
                    class="m-1 p-2 focus:shadow-outline rounded bg-cyan-500 px-2 py-2 text-white hover:bg-cyan-600 focus:outline-none">Submit</button>
                <button @click="toggleSidebar"
                    class="m-1 p-2 focus:shadow-outline rounded bg-red-500 px-2 py-2 text-white hover:bg-red-600 focus:outline-none">Close</button>
            </div>
            <!-- Sidebar content goes here -->
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { TableNames, app } from '~/assets/js/app';

const showSidebar = ref(false);


const toggleSidebar = () => {
    showSidebar.value = !showSidebar.value;
};

function handleSubmit() {
    alert(JSON.stringify(props.model));
}


defineExpose({
    toggleSidebar
});

const props = defineProps<{
    tableName: TableNames,
    editMode: boolean,
    model: any
}>();
</script>
  