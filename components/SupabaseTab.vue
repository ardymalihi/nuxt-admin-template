<template>
    <div>
        <div class="flex flex-row">
            <div v-for="(item, index) in props.items" :key="index" @click="setActiveTab(index)"
                :class="index === activeTab ? 'bg-gray-600' : 'bg-gray-500'" class="text-center p-2 mr-1 mb-[1px] text-white cursor-pointer">
                {{ item.title }}
            </div>
        </div>
        
        <div v-for="(item, index) in props.items" :key="index">
            <div v-if="activeTab === index" name="fade" mode="in-out">
            <SupabaseView  :compact="true" :schema="app.schema" :table-name="currentTableName"
                view-type="table" :editable="false" :show-collections="false" />
            </div>
        </div>
       
    </div>
</template>
  
<script setup lang="ts">
import { app } from '~/assets/js/app';

export interface ITabItem {
    tableName: string,
    title: string,
    searchTerms: string,
}

const props = defineProps<{
    items: ITabItem[]
}>();

const activeTab = ref(0);

const currentTableName = computed(() => props.items[activeTab.value].tableName);

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
  