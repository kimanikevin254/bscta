<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import Dialog from '../ui/dialog/Dialog.vue';
import DialogContent from '../ui/dialog/DialogContent.vue';
import DialogDescription from '../ui/dialog/DialogDescription.vue';
import DialogFooter from '../ui/dialog/DialogFooter.vue';
import DialogHeader from '../ui/dialog/DialogHeader.vue';
import DialogTitle from '../ui/dialog/DialogTitle.vue';
import DialogTrigger from '../ui/dialog/DialogTrigger.vue';
import * as z from 'zod';
import { useForm } from 'vee-validate';
import { useToast } from '../ui/toast';
import type { AxiosError } from 'axios';
import { FormField } from '../ui/form';
import FormItem from '../ui/form/FormItem.vue';
import FormLabel from '../ui/form/FormLabel.vue';
import FormControl from '../ui/form/FormControl.vue';
import Select from '../ui/select/Select.vue';
import SelectTrigger from '../ui/select/SelectTrigger.vue';
import SelectValue from '../ui/select/SelectValue.vue';
import SelectContent from '../ui/select/SelectContent.vue';
import SelectItem from '../ui/select/SelectItem.vue';
import Button from '../ui/button/Button.vue';
import { ref } from 'vue';
import { updateUserRole } from '@/services/userService';

const { toast } = useToast()

const dialogOpen = ref<boolean>(false)
const props = defineProps(['userId', 'fetchUsers'])

const controlDialog = () => dialogOpen.value = !dialogOpen.value

const updateRoleSchema = toTypedSchema(
  z.object({
    role: z.enum(["ADMIN", "ENGINEER", "PROJECT_MANAGER"]),
  })
);

const { handleSubmit } = useForm({
    validationSchema: updateRoleSchema,
})

const onSubmit = handleSubmit(async (values) => {
    try {
        await updateUserRole(props.userId, values.role)
        toast({
            title: 'Success',
            description: `User role updated successfully`
        })
        props.fetchUsers()
    } catch (error) {
        console.log(error);
        // Cast error to AxiosError
        const axiosError = error as AxiosError;

        if(axiosError.response){
            toast({
                title: "Unable to update user role",
                // @ts-expect-error requires type def
                description: axiosError.response.data.message
            })
        } else {
            // Handle other error types (e.g., network errors)
            toast({
                title: "Unable to update user role",
                description: 'An unexpected error occurred. Please try again.'
            })
        }
    }
})

</script>

<template>
    <Dialog :open="dialogOpen">
    <DialogTrigger @click.stop="controlDialog">
      Update User Role
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update User Role</DialogTitle>
        <DialogDescription>
          Update the user's role to give them more/less permissions
        </DialogDescription>
      </DialogHeader>
      <form class="space-y-4">
        <FormField v-slot="{ componentField }" name="role">
          <FormItem>
            <FormLabel>New Role</FormLabel>
            <FormControl>
                <Select v-bind="componentField">
                    <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ADMIN">
                            ADMIN
                        </SelectItem>
                        <SelectItem value="PROJECT_MANAGER">
                            PROJECT MANAGER
                        </SelectItem>
                        <SelectItem value="ENGINEER">
                            ENGINEER
                        </SelectItem>
                    </SelectContent>
                </Select>
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>
      </form>
      <DialogFooter>
        <Button variant="ghost" @click="controlDialog">Cancel</Button>
        <Button @click="onSubmit">Confirm</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>