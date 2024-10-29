<script setup lang="ts">
import MobileSidebarComponent from '@/components/shared/MobileSidebarComponent.vue'
import UserDropdownComponent from '@/components/shared/UserDropdownComponent.vue'
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
<header class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
    <MobileSidebarComponent />
    <div class="w-full flex-1">
        <p class="font-semibold">Hello, {{ userStore.userInfo?.name.split(' ')[0] }}</p>
    </div>
    <UserDropdownComponent />
</header>
</template>