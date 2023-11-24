// TimestampInput.vue

<script setup lang="ts">
import { ref, onBeforeUnmount, onBeforeMount, watchEffect } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits();

// Standalone functions for formatting and parsing local datetime
const toDatetimeLocal = (date: Date): string => {
  const ten = (i: number) => (i < 10 ? '0' : '') + i;
  const YYYY = date.getFullYear();
  const MM = ten(date.getMonth() + 1);
  const DD = ten(date.getDate());
  const HH = ten(date.getHours());
  const II = ten(date.getMinutes());
  const SS = ten(date.getSeconds());

  return `${YYYY}-${MM}-${DD}T${HH}:${II}:${SS}`;
};

const fromDatetimeLocal = (BST: string) => (date: Date): string => {
  return new Date(BST).toISOString().slice(0, 16) === BST
    ? new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString()
    : date.toISOString();
};

const localTime = ref<string>(''); // Initialize with an empty string

onBeforeMount(() => {
  // Convert Supabase timestamp to local time when the component is mounted
  localTime.value = toDatetimeLocal(new Date(props.modelValue));
});

watchEffect(() => {
  // Update localTime when props.modelValue changes
  localTime.value = toDatetimeLocal(new Date(props.modelValue));
});

onBeforeUnmount(() => {
  // Clean up any necessary resources when the component is unmounted
});

const updateLocalTime = () => {
  // Emit the updated local time value using v-model
  emit('update:modelValue', fromDatetimeLocal('2006-06-06T06:06')(new Date(localTime.value)));
};
</script>

<template>
  <div>
    <input v-model="localTime" @input="updateLocalTime" type="datetime-local" />
  </div>
</template>
