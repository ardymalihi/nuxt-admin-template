<template>
    <div>
        <div class="flex flex-row">
            <div 
                v-for="(item, index) in props.items" 
                :key="index" 
                @click="setActiveTab(index)"
                :class="index === activeTab ? 'bg-gray-600' : 'bg-gray-500'" 
                class="text-center p-2 mr-1  text-white cursor-pointer"
            >
                {{ item.title }}
            </div>
        </div>
        
        <div class="flex flex-col">
        
            <SupabaseView 
            v-if="props.items.length > 0"
            :compact="true" 
            :key="props.items[activeTab].tableName"
            :schema="app.schema" 
            :table-name="currentTableName"
            view-type="table" 
            :editable="false" 
            :show-collections="false" 
            :search-terms="searchTerms" />
        
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { app } from '~/assets/js/app';

export interface ITabItem {
    tableName: string,
    title: string,
    idName: string;
}

const props = defineProps<{
    items: ITabItem[];
    rowObject: any;
    parentTableName: string;
    parentFieldIdName: string;
}>();

const activeTab = ref(0);
const currentTableName = ref(props.items[0].tableName);

const searchTerms = computed(() => {
    const item = props.items[activeTab.value];
    const idValue = props.rowObject[props.parentFieldIdName];
    console.log("search terms:", `${item.idName}.eq.${idValue}`);
    return `${item.idName}.eq.${idValue}`;
});

const setActiveTab = (index: number) => {
    activeTab.value = index;
    currentTableName.value = props.items[index].tableName;
};

onMounted(() => {
    // Set the initial active tab to the first tab
    activeTab.value = 0;
});
</script>
