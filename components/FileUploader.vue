<template>
  <div v-if="props.modelValue" class="flex flex-row justify-between">
    <a :href="`/api/download?file=${props.modelValue}`" target="_blank" class="text-xs m-1 text-blue-500">{{ props.modelValue }}</a>
    <button @click="cleanUpload" type="button"
      class="focus:shadow-outline h-7 rounded bg-cyan-500 text-xs pl-2 pr-2 text-white hover:bg-cyan-600 focus:outline-none">
      Clean
    </button>
    <p v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</p>
  </div>
  <div v-else="props.modelValue" class="flex flex-row">
    <input type="file" @change="handleFileChange" :accept="props.allowedExtensions.join(', ')"
      class="w-full" />
    <button @click="uploadFile" type="button"
      class="focus:shadow-outline h-7 rounded bg-cyan-500 text-xs pl-2 pr-2 text-white hover:bg-cyan-600 focus:outline-none">
      Upload
    </button>
    <p v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</p>
  </div>
</template>
  
<script setup lang="ts">
import { ref, defineProps } from 'vue';

interface Props {
  allowedExtensions: ['.pdf' | '.png' | '.jpg'];
  uploadFolder: string;
  modelValue: string;
}

const props = defineProps(['allowedExtensions', 'uploadFolder', 'modelValue']);
const emit = defineEmits(['update:modelValue'])

const selectedFile = ref<File | null>(null);
const errorMessage = ref<string | null>(null);

function cleanUpload() {
  emit('update:modelValue', "");
}

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const extension = file.name.split('.').pop();
    if (!props.allowedExtensions.includes(`.${extension?.toLowerCase()}` || '')) {
      errorMessage.value = 'Invalid file extension. Please upload a valid file.';
    } else {
      errorMessage.value = null;
      selectedFile.value = file;
    }
  }
};

const uploadFile = async () => {
  if (!selectedFile.value) {
    errorMessage.value = 'Please select a file before uploading.';
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile.value);
  formData.set('folder', props.uploadFolder);

  try {
    const response = await fetch(`api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error uploading the file.');
    }

    // Emit the file information to the parent component
    emit('update:modelValue',(await response.json()).path);

    // Clear the selected file after successful upload
    selectedFile.value = null;
    errorMessage.value = null;
  } catch (error) {
    errorMessage.value = 'Error uploading the file. Please try again.';
    console.error(error);
  }
};
</script>
  
<style scoped>
/* No additional styles needed as Tailwind CSS classes are applied directly in the template */
</style>
  