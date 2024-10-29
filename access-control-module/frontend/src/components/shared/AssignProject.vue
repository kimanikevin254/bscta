<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { FormField } from '../ui/form'
import FormItem from '../ui/form/FormItem.vue'
import FormLabel from '../ui/form/FormLabel.vue'
import FormControl from '../ui/form/FormControl.vue'
import FormMessage from '../ui/form/FormMessage.vue'
import type { AxiosError } from 'axios'
import { useToast } from '../ui/toast'
import { PlusIcon } from 'lucide-vue-next'
import { assignUser } from '@/services/projectService'

const props = defineProps(['projectId', 'fetchUsers'])

const { toast } = useToast()

const assignProjectSchema = toTypedSchema(
  z.object({
    email: z.string().email().min(1, "Project name is required"),
  })
);

const { handleSubmit } = useForm({
    validationSchema: assignProjectSchema,
})

const onSubmit = handleSubmit(async (values) => {
    try {
        // await apiClient.post(`/project/${props.projectId}/assign-user`, { ...values })
        await assignUser(props.projectId, values.email)
        await props.fetchUsers()

        toast({
            title: 'Success',
            description: `Project assigned successfully`
        })
    } catch (error) {
        console.log(error);
        // Cast error to AxiosError
        const axiosError = error as AxiosError;

        if(axiosError.response){
            toast({
                title: "Unable to assign project",
                // @ts-expect-error requires type def
                description: axiosError.response.data.message
            })
        } else {
            // Handle other error types (e.g., network errors)
            toast({
                title: "Unable to assign project",
                description: 'An unexpected error occurred. Please try again.'
            })
        }
    }
})
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button>
        <PlusIcon class="h-4 w-4" />
        Assign
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Assign Project</DialogTitle>
        <DialogDescription>
          Provide the email of the user to assign the project to and click "Assign".
        </DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <DialogFooter>
            <Button type="submit">
                Assign Project
            </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>