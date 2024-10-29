<script setup lang="ts">
</script>

<template>
    <div class="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 class="text-6xl font-bold text-red-600 mb-4">Oops! 🤔</h1>
      <p class="text-lg mb-2">Looks like you've wandered off the beaten path!</p>
      <p class="text-xl font-semibold">404 - Page Not Found</p>
      <p class="text-lg mt-4">Don't worry; it happens to the best of us.</p>
      <router-link to="/" class="mt-6 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
        Go Back Home
      </router-link>
    </div>
</template>