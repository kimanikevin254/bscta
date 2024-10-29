<script setup lang="ts">
import AllUsers from '@/components/shared/AllUsers.vue';
import DashboardLayout from '@/components/shared/DashboardLayout.vue';
import InviteUser from '@/components/shared/InviteUser.vue';
import { hasPermission } from '@/lib/auth';

</script>

<template>
    <DashboardLayout>
        <div class="flex justify-between items-center">
            <h1 class="text-lg font-semibold md:text-2xl">
                Users
            </h1>
            <InviteUser v-if="hasPermission({ resource: 'user', actions: ['CREATE'] })" />
        </div>
        <AllUsers v-if="hasPermission({ resource: 'user', actions: ['READ'] })" />
    </DashboardLayout>
</template>