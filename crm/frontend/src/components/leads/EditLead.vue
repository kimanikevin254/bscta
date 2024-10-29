<script setup lang="ts">
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
import { updateLead } from '@/services/leadServices';
import { computed, toRaw } from 'vue';
import Select from '../ui/select/Select.vue';
import SelectTrigger from '../ui/select/SelectTrigger.vue';
import SelectValue from '../ui/select/SelectValue.vue';
import SelectContent from '../ui/select/SelectContent.vue';
import SelectItem from '../ui/select/SelectItem.vue';

const props = defineProps(['leadDetails', 'fetchLeads'])

const leadDetails = computed(() => toRaw(props.leadDetails));

const { toast } = useToast()

const createLeadSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Must be a valid email' }).min(1, { message: 'Email is required' }),
    phone: z.string().min(1, { message: 'Phone number is required' }),
    companyName: z.string().min(1, { message: 'Company name is required' }),
    status: z.enum(['NEW', 'IN_PROGRESS', 'CLOSED']).default('NEW')
  })
)

const { handleSubmit } = useForm({
  validationSchema: createLeadSchema,
  initialValues: {
    name: leadDetails.value.name,
    email: leadDetails.value.email,
    phone: leadDetails.value.phone,
    companyName: leadDetails.value.companyName,
    status: leadDetails.value.status,
  }
})

const onSubmit = handleSubmit(async (values) => {
  try {
      await updateLead(leadDetails.value.id, values)

      toast({
      title: 'Success',
      description: 'Lead has been updated successfully!'
    })

    props.fetchLeads()
  } catch (error) {
      if (error instanceof AxiosError && error.response) {
          toast({
              title: 'Error',
              description: error.response.data.message || 'Update failed. Please try again.'
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
    <DialogTrigger @click.stop>
        Edit Lead
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogDescription>Enter lead details below.</DialogDescription>
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

          <FormField v-slot="{ componentField }" name="status">
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                    <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="NEW">
                            New
                        </SelectItem>
                        <SelectItem value="IN_PROGRESS">
                            In Progress
                        </SelectItem>
                        <SelectItem value="CLOSED">
                            Closed
                        </SelectItem>
                    </SelectContent>
                </Select>
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>
          <Button class="w-full" type="submit">
            Update Lead
          </Button>
        </form>
    </DialogContent>
  </Dialog>
</template>