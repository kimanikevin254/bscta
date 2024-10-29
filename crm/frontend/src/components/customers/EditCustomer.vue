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
import { computed, toRaw } from 'vue';
import Select from '../ui/select/Select.vue';
import SelectTrigger from '../ui/select/SelectTrigger.vue';
import SelectValue from '../ui/select/SelectValue.vue';
import SelectContent from '../ui/select/SelectContent.vue';
import SelectItem from '../ui/select/SelectItem.vue';
import { updateCustomer } from '@/services/customersService';

const props = defineProps(['customerDetails', 'fetchCustomers'])

const customerDetails = computed(() => toRaw(props.customerDetails));

const { toast } = useToast()

const updateCustomerSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Must be a valid email' }).min(1, { message: 'Email is required' }),
    phone: z.string().min(1, { message: 'Phone number is required' }),
    companyName: z.string().min(1, { message: 'Company name is required' }),
    status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE')
  })
)

const { handleSubmit } = useForm({
  validationSchema: updateCustomerSchema,
  initialValues: {
    name: customerDetails.value.name,
    email: customerDetails.value.email,
    phone: customerDetails.value.phone,
    companyName: customerDetails.value.companyName,
    status: customerDetails.value.status,
  }
})

const onSubmit = handleSubmit(async (values) => {
  try {
      await updateCustomer(customerDetails.value.id, values)

      toast({
      title: 'Success',
      description: 'Customer has been updated successfully!'
    })

    props.fetchCustomers()
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
        Edit Customer
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Enter customer details below.</DialogDescription>
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
                        <SelectItem value="ACTIVE">
                            Active
                        </SelectItem>
                        <SelectItem value="INACTIVE">
                            Inactive
                        </SelectItem>
                    </SelectContent>
                </Select>
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>
          <Button class="w-full" type="submit">
            Update Customer
          </Button>
        </form>
    </DialogContent>
  </Dialog>
</template>