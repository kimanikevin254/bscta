<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import Button from '../ui/button/Button.vue';
import Dialog from '../ui/dialog/Dialog.vue';
import DialogTrigger from '../ui/dialog/DialogTrigger.vue';
import DialogContent from '../ui/dialog/DialogContent.vue';
import DialogHeader from '../ui/dialog/DialogHeader.vue';
import DialogTitle from '../ui/dialog/DialogTitle.vue';
import DialogDescription from '../ui/dialog/DialogDescription.vue';
import { useToast } from '../ui/toast';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { AxiosError } from 'axios';
import { FormField } from '../ui/form';
import FormItem from '../ui/form/FormItem.vue';
import FormLabel from '../ui/form/FormLabel.vue';
import FormControl from '../ui/form/FormControl.vue';
import Input from '../ui/input/Input.vue';
import FormMessage from '../ui/form/FormMessage.vue';
import { createLead } from '@/services/leadServices';

const props = defineProps(['fetchLeads'])


const { toast } = useToast()

const createLeadSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Must be a valid email' }).min(1, { message: 'Email is required' }),
    phone: z.string().min(1, { message: 'Phone number is required' }),
    companyName: z.string().min(1, { message: 'Company name is required' }),
  })
)

const { handleSubmit } = useForm({
  validationSchema: createLeadSchema
})

const onSubmit = handleSubmit(async (values) => {
  try {
      await createLead(values)

      toast({
      title: 'Success',
      description: 'Lead has been created successfully!'
    })

    props.fetchLeads()
  } catch (error) {
      if (error instanceof AxiosError && error.response) {
          toast({
              title: 'Error',
              description: error.response.data.message || 'Registration failed. Please try again.'
          });
      } else {
          toast({
              title: 'Error',
              description: 'An unexpected error occurred. Please try again.'
          });
      }
  }
});
</script>

<template>
    <Dialog>
    <DialogTrigger>
        <Button><Plus className="mr-2 h-4 w-4" /> Create New Lead</Button>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Create New Lead</DialogTitle>
            <DialogDescription>Enter the details of the new lead below.</DialogDescription>
        </DialogHeader>
        <form @submit="onSubmit" class="space-y-4">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="John Doe" v-bind="componentField" />
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="johndoe@example.com" v-bind="componentField" />
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="phone">
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+1234567890" v-bind="componentField" />
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="companyName">
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Acme Corp" v-bind="componentField" />
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>
          <Button class="w-full" type="submit">
            Create Lead
          </Button>
        </form>
    </DialogContent>
  </Dialog>
</template>