<script setup lang="ts">
import { hasPermission } from '@/lib/auth';
import { Package2, PanelsTopLeft, Users2 } from 'lucide-vue-next'
</script>

<template>
    <div class="hidden border-r bg-muted/40 md:block">
      <div class="flex h-full max-h-screen flex-col gap-2">
        <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <a href="/dashboard" class="flex items-center gap-2 font-semibold">
            <Package2 class="h-6 w-6" />
            <span class="">Bingwa Services</span>
          </a>
        </div>
        <div class="flex-1">
          <nav class="grid items-start px-2 space-y-4 text-sm font-medium lg:px-4">
            <RouterLink to="/dashboard" class="flex gap-2 items-center">
              <PanelsTopLeft class="h-4 w-4" />
              Dashboard
            </RouterLink>

            <RouterLink v-if="hasPermission({ resource: 'user', actions: ['READ'] })" to="/dashboard/users" class="flex gap-2 items-center">
              <Users2 class="h-4 w-4" />
              Users
            </RouterLink>
          </nav>
        </div>
      </div>
    </div>
</template>