<script setup lang="ts">
import type { AssignedUser } from '@/types';
import type { AxiosError } from 'axios';
import { onMounted, ref } from 'vue';
import { useToast } from '../ui/toast';
import { fetchAssignedUsers, unassignUser } from '@/services/projectService';
import Table from '../ui/table/Table.vue';
import TableHeader from '../ui/table/TableHeader.vue';
import TableRow from '../ui/table/TableRow.vue';
import TableHead from '../ui/table/TableHead.vue';
import TableBody from '../ui/table/TableBody.vue';
import TableCell from '../ui/table/TableCell.vue';
import { hasPermission } from '@/lib/auth';
import Button from '../ui/button/Button.vue';
import AssignProject from './AssignProject.vue';

const props = defineProps(['projectId'])
const { toast } = useToast()

const assignedUsers = ref<AssignedUser[]>([])
const isLoadingUsers = ref<boolean>(true)

const fetchUsers = async () => {
    try {
        assignedUsers.value = await fetchAssignedUsers(props.projectId)
    } catch (error) {
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
    } finally {
        isLoadingUsers.value = false
    }
}

const unassign = async (userId: string) => {
    try {
        await unassignUser(props.projectId, userId)
        await fetchUsers()
    } catch (error) {
        console.log(error);

        // Cast error to AxiosError
        const axiosError = error as AxiosError;

        if(axiosError.response){
            toast({
                title: "Unable to unassign",
                // @ts-expect-error requires type def
                description: axiosError.response.data.message
            })
        } else {
            // Handle other error types (e.g., network errors)
            toast({
                title: "Unable to unassigned",
                description: 'An unexpected error occurred. Please try again.'
            })
        }
    }
}

onMounted(async () => {
    fetchUsers()
})
</script>

<template>
    <div class="flex justify-between items-center mb-4">
        <p class="text-gray-500 my-1">Explore who has been assigned the project here</p>
        <AssignProject v-if="hasPermission({ resource: 'assignment', actions: ['CREATE'] })" :project-id="projectId" :fetch-users="fetchUsers" />
    </div>

    <p v-if="isLoadingUsers">Loading...</p>
    <p v-else-if="assignedUsers.length === 0">No assigned users</p>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            Name
          </TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead v-if="hasPermission({ resource: 'user', actions: ['UPDATE'] })">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="user in assignedUsers" :key="user.id">
          <TableCell class="font-medium">
            {{ user.name }}
          </TableCell>
          <TableCell>{{ user.email }}</TableCell>
          <TableCell>{{ user.role.name }}</TableCell>
          <TableCell v-if="hasPermission({ resource: 'user', actions: ['UPDATE'] })">
            <Button @click="unassign(user.id)">
                Unassign
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
</template>