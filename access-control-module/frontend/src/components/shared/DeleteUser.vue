<script setup lang="ts">
import { ref } from 'vue';
import Button from '../ui/button/Button.vue';
import Dialog from '../ui/dialog/Dialog.vue';
import DialogContent from '../ui/dialog/DialogContent.vue';
import DialogDescription from '../ui/dialog/DialogDescription.vue';
import DialogFooter from '../ui/dialog/DialogFooter.vue';
import DialogHeader from '../ui/dialog/DialogHeader.vue';
import DialogTitle from '../ui/dialog/DialogTitle.vue';
import DialogTrigger from '../ui/dialog/DialogTrigger.vue';
import { deleteUser } from '@/services/userService';
import { useToast } from '../ui/toast';
import type { AxiosError } from 'axios';

const props = defineProps(['userId', 'fetchUsers']);
const { toast } = useToast();

const dialogOpen = ref<boolean>(false)

const controlDialog = () => dialogOpen.value = !dialogOpen.value

const removeUser = async () => {
    try {
        await deleteUser(props.userId)
        toast({
            title: 'Success',
            description: 'User deleted successfully'
        })
        props.fetchUsers()
    } catch (error) {
        console.log(error);

        // Cast error to AxiosError
        const axiosError = error as AxiosError;

        if(axiosError.response){
            toast({
                title: "Unable to delete user",
                // @ts-expect-error requires type def
                description: axiosError.response.data.message
            })
        } else {
            // Handle other error types (e.g., network errors)
            toast({
                title: "Unable to delete user",
                description: 'An unexpected error occurred. Please try again.'
            })
        }
    }
}
</script>

<template>
    <Dialog :open="dialogOpen">
    <DialogTrigger @click.stop="controlDialog">
      Delete User
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete User</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button variant="ghost" @click="controlDialog">
            Cancel
        </Button>
        <Button variant="destructive" @click="removeUser">Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>