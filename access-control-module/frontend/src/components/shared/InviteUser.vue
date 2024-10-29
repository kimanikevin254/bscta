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
import Select from '../ui/select/Select.vue'
import SelectTrigger from '../ui/select/SelectTrigger.vue'
import SelectValue from '../ui/select/SelectValue.vue'
import SelectContent from '../ui/select/SelectContent.vue'
import SelectItem from '../ui/select/SelectItem.vue'
import { inviteUser } from '@/services/userService'

const { toast } = useToast()

const inviteUserSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    phoneNumber: z.string().regex(/^\+254\d{9}$/, "Phone number must start with +254 and be followed by 9 digits"),
    role: z.enum(["ADMIN", "ENGINEER", "PROJECT_MANAGER"]),
  })
);

const { handleSubmit } = useForm({
    validationSchema: inviteUserSchema,
})

const onSubmit = handleSubmit(async (values) => {
    try {
        await inviteUser(values)
        toast({
            title: 'Success',
            description: `Invitation sent successfully`
        })
    } catch (error) {
        console.log(error);
        // Cast error to AxiosError
        const axiosError = error as AxiosError;

        if(axiosError.response){
            toast({
                title: "Unable to invite user",
                // @ts-expect-error requires type def
                description: axiosError.response.data.message
            })
        } else {
            // Handle other error types (e.g., network errors)
            toast({
                title: "Unable to invite user",
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
        Invite User
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Invite User</DialogTitle>
        <DialogDescription>
          Provide the user details and click "Send Invitation".
        </DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="phoneNumber">
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="role">
          <FormItem>
            <FormLabel>Role</FormLabel>
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

        <DialogFooter>
            <Button type="submit">
                Send Invitation
            </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>