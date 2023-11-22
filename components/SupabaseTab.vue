<template>
    <div>
        <div class="flex flex-row">
            <div v-for="(item, index) in items" :key="index" @click="setActiveTab(index)"
                :class="index === activeTab ? 'bg-gray-600' : 'bg-gray-500'" class="p-2 mr-1 text-white cursor-pointer">
                {{ item.title }}
            </div>
        </div>
        
        <div v-for="(item, index) in items" :key="index">
            <div v-if="activeTab === index" name="fade" mode="in-out">
            <SupabaseView  :compact="true" :schema="app.schema" :table-name="currentTableName"
                view-type="table" :editable="false" :show-collections="false" />
            </div>
        </div>
       
    </div>
</template>
  
<script setup lang="ts">
import { app } from '~/assets/js/app';

const items = ref([
    { title: 'Tasks', tableName: "tasks" },
    { title: 'Tasks Progress', tableName: 'tasks_progress' },
    // ... other items
]);

const activeTab = ref(0);

const currentTableName = computed(() => items.value[activeTab.value].tableName);

const setActiveTab = (index: number) => {
    activeTab.value = index;
};

onMounted(() => {
    // Set the initial active tab to the first tab
    setActiveTab(0);
});
</script>
  
<style scoped>
.tab.active {
    background-color: #f0f0f0;
}
</style>
  