<script setup lang="ts">

const props = defineProps(['modelValue']);
const emit = defineEmits();

// Standalone functions for formatting and parsing local datetime
const toDatetimeLocal = (date: Date): string => {
    if (date) {
        const ten = (i: number) => (i < 10 ? '0' : '') + i;
        const YYYY = date.getFullYear();
        const MM = ten(date.getMonth() + 1);
        const DD = ten(date.getDate());
        const HH = ten(date.getHours());
        const II = ten(date.getMinutes());
        const SS = ten(date.getSeconds());

        return `${YYYY}-${MM}-${DD}T${HH}:${II}:${SS}`;
    } else {
        return "";
    }
};

const fromDatetimeLocal = (BST: string) => (date: Date): string => {
    return new Date(BST).toISOString().slice(0, 16) === BST
        ? new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString()
        : date.toISOString();
};

const localTime = ref<string>(''); // Initialize with an empty string


watchEffect(() => {
    // Update localTime when props.modelValue changes
    if (props.modelValue) {
        localTime.value = toDatetimeLocal(new Date(props.modelValue));
    } else {
        localTime.value = "";
    }
});

const updateLocalTime = () => {
    emit('update:modelValue', localTime.value ? fromDatetimeLocal('2006-06-06T06:06')(new Date(localTime.value)) : '');
};
</script>

<template>
    <input v-model="localTime" @input="updateLocalTime" type="datetime-local" />
</template>
