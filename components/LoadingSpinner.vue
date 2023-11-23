<template>
    <div class="flex flex-col items-center justify-center mb-10">
      <div class="animate-spin rounded-full border-t-4 border-cyan-100 border-opacity-25 h-12 w-12"></div>
    </div>
  </template>
  
  <style scoped>
  /* Add any additional styling as needed */
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
  