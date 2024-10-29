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
import { useToast } from '../ui/toast';
import type { AxiosError } from 'axios';
import { TrashIcon } from 'lucide-vue-next';
import { deleteProject } from '@/services/projectService';
import { useRouter } from 'vue-router';

const props = defineProps(['projectId']);
const { toast } = useToast();
const router = useRouter()

const dialogOpen = ref<boolean>(false)

const controlDialog = () => dialogOpen.value = !dialogOpen.value

const removeProject = async () => {
    try {
        await deleteProject(props.projectId)

        toast({
            title: 'Success',
            description: 'Project deleted successfully'
        })

        router.replace('/dashboard')
    } catch (error) {
        console.log(error);

        // Cast error to AxiosError
        const axiosError = error as AxiosError;

        if(axiosError.response){
            toast({
                title: "Unable to delete project",
                // @ts-expect-error requires type def
                description: axiosError.response.data.message
            })
        } else {
            // Handle other error types (e.g., network errors)
            toast({
                title: "Unable to delete project",
                description: 'An unexpected error occurred. Please try again.'
            })
        }
    }
}
</script>

<template>
    <Dialog :open="dialogOpen">
    <DialogTrigger @click.stop="controlDialog">
      <Button variant="destructive" class="flex gap-2 items-center">
        <TrashIcon />
        Delete Project
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this project? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button variant="ghost" @click="controlDialog">
            Cancel
        </Button>
        <Button variant="destructive" @click="removeProject">Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>