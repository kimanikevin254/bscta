<script setup lang="ts">
import MobileSidebarComponent from './MobileSidebarComponent.vue';
import UserDropdownComponent from './UserDropdownComponent.vue';


</script>

<template>
<header class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
    <MobileSidebarComponent />
    <div class="w-full flex-1" />
    <UserDropdownComponent />
</header>
</template>