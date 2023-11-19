<template>
  <div class="max-w-md mx-auto my-8 p-4 bg-white shadow-md rounded-md">
    <input type="file" @change="handleFileChange" :accept="props.allowedExtensions.join(', ')"
      class="w-full rounded border px-3 py-2 text-gray-700 focus:outline-none" />

    <button @click="uploadFile"
      class="m-1 p-2 focus:shadow-outline rounded bg-cyan-500 px-2 py-2 text-white hover:bg-cyan-600 focus:outline-none">
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
}

const props = defineProps(['allowedExtensions', 'uploadFolder']);
const emit = defineEmits(['update:modelValue'])

const selectedFile = ref<File | null>(null);
const errorMessage = ref<string | null>(null);

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
    emit('update:modelValue', {
      fileName: selectedFile.value.name,
      path: await response.json(), // Adjust the path as needed
    });

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
  