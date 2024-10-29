<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, PanelsTopLeft } from 'lucide-vue-next'
</script>

<template>
<Sheet>
    <SheetTrigger as-child>
    <Button
        variant="outline"
        size="icon"
        class="shrink-0 md:hidden"
    >
        <Menu class="h-5 w-5" />
        <span class="sr-only">Toggle navigation menu</span>
    </Button>
    </SheetTrigger>
    <SheetContent side="left" class="flex flex-col">
    <nav class="grid gap-2 text-lg font-medium">
        <RouterLink to="/dashboard" class="flex gap-2 items-center">
              <PanelsTopLeft class="h-4 w-4" />
              Dashboard
            </RouterLink>

            <RouterLink to="/dashboard/users" class="flex gap-2 items-center">
              <Users2 class="h-4 w-4" />
              Users
            </RouterLink>
    </nav>
    </SheetContent>
</Sheet>
</template>