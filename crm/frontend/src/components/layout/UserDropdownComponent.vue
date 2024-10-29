<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import apiClient from '@/services/apiClient';
import { CircleUser } from 'lucide-vue-next'
import { useRouter } from 'vue-router';

const router = useRouter()

const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    await apiClient.post(`/auth/logout`, { refreshToken })

    // Remove all tokens from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');

    router.replace('/login')
}
</script>

<template>
<DropdownMenu>
    <DropdownMenuTrigger as-child>
    <Button variant="secondary" size="icon" class="rounded-full">
        <CircleUser class="h-5 w-5" />
        <span class="sr-only">Toggle user menu</span>
    </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
    <DropdownMenuItem @click="logout">Logout</DropdownMenuItem>
    </DropdownMenuContent>
</DropdownMenu>
</template>