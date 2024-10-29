<script setup lang="ts">
import { findAllUsers } from '@/services/userService';
import type { AxiosError } from 'axios';
import { onMounted, ref } from 'vue';
import { useToast } from '../ui/toast';
import type { UserInfo } from '@/types';
import Table from '../ui/table/Table.vue';
import TableHeader from '../ui/table/TableHeader.vue';
import TableRow from '../ui/table/TableRow.vue';
import TableHead from '../ui/table/TableHead.vue';
import { hasPermission } from '@/lib/auth';
import TableBody from '../ui/table/TableBody.vue';
import TableCell from '../ui/table/TableCell.vue';
import Button from '../ui/button/Button.vue';
import DropdownMenu from '../ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuTrigger from '../ui/dropdown-menu/DropdownMenuTrigger.vue';
import DropdownMenuContent from '../ui/dropdown-menu/DropdownMenuContent.vue';
import { EllipsisVertical } from 'lucide-vue-next';
import DropdownMenuItem from '../ui/dropdown-menu/DropdownMenuItem.vue';
import DeleteUser from './DeleteUser.vue';
import UpdateUserRole from './UpdateUserRole.vue';

const { toast } = useToast()

const users = ref<UserInfo[] | null>(null)

const fetchUsers = async () => {
    try {
        const data = await findAllUsers()
        users.value = data
    } catch (error) {
        console.log(error);

        console.log(error);

        // Cast error to AxiosError
        const axiosError = error as AxiosError;

        if(axiosError.response){
            toast({
                title: "Unable to fetch assigned users",
                // @ts-expect-error requires type def
                description: axiosError.response.data.message
            })
        } else {
            // Handle other error types (e.g., network errors)
            toast({
                title: "Unable to fetch assigned users",
                description: 'An unexpected error occurred. Please try again.'
            })
        }
    }
}

onMounted(() => {
    fetchUsers()
})
</script>

<template>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            Name
          </TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone Number</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>KRA PIN</TableHead>
          <TableHead>Role</TableHead>
          <TableHead v-if="hasPermission({ resource: 'user', actions: ['UPDATE'] })">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="user in users" :key="user.id">
          <TableCell class="font-medium">
            {{ user.name }}
          </TableCell>
          <TableCell>{{ user.email }}</TableCell>
          <TableCell>{{ user.phoneNumber }}</TableCell>
          <TableCell>{{ user.address }}</TableCell>
          <TableCell>{{ user.kraPinNumber }}</TableCell>
          <TableCell>{{ user.role.name }}</TableCell>
          <TableCell v-if="hasPermission({ resource: 'user', actions: ['UPDATE'] })">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="ghost">
                        <EllipsisVertical class="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                <DropdownMenuItem>
                    <DeleteUser :user-id="user.id" :fetch-users="fetchUsers" />
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <UpdateUserRole :user-id="user.id" :fetch-users="fetchUsers" />
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
</template>