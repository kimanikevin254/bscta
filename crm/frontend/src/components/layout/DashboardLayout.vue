<script setup lang="ts">
import SidebarComponent from './SidebarComponent.vue';
import TopNavComponent from './TopNavComponent.vue';


</script>

<template>
  <div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
    <SidebarComponent />

    <div class="flex flex-col">
      <TopNavComponent />
      
      <!-- Main content -->
      <main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>