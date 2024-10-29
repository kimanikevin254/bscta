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
import FormItem from '../ui/form/FormItem.vue';
import FormLabel from '../ui/form/FormLabel.vue';
import FormControl from '../ui/form/FormControl.vue';
import Input from '../ui/input/Input.vue';
import FormMessage from '../ui/form/FormMessage.vue';
import Select from '../ui/select/Select.vue';
import { FormField } from '../ui/form';
import SelectTrigger from '../ui/select/SelectTrigger.vue';
import SelectValue from '../ui/select/SelectValue.vue';
import SelectContent from '../ui/select/SelectContent.vue';
import SelectItem from '../ui/select/SelectItem.vue';
import { addInteraction } from '@/services/customersService';

const props = defineProps(['customerDetails']);

const { toast } = useToast();

const interactionSchema = toTypedSchema(
  z.object({
    interactionType: z.string().min(1, { message: 'Interaction type is required' }),
    date: z.string().min(1, { message: 'Date is required' }),
    notes: z.string().optional(),
  })
);

const { handleSubmit } = useForm({
  validationSchema: interactionSchema,
  initialValues: {
    interactionType: 'PHONE_CALL',
    date: new Date().toISOString(),
    notes: '',
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await addInteraction(props.customerDetails.id, { ...values, date: new Date(values.date)});
    toast({
      title: 'Success',
      description: 'Interaction added successfully!',
    });
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      toast({
        title: 'Error',
        description: error.response.data.message || 'Failed to add interaction. Please try again.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    }
  }
});
</script>

<template>
  <Dialog>
    <DialogTrigger @click.stop>
      Add Interaction
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Interaction</DialogTitle>
        <DialogDescription>Enter interaction details below.</DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="interactionType">
          <FormItem>
            <FormLabel>Interaction Type</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Select interaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHONE_CALL">Phone Call</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="MEETING">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="date">
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <Input type="date" v-bind="componentField" />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="notes">
          <FormItem>
            <FormLabel>Notes (optional)</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Add any notes here..." v-bind="componentField" />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <Button class="w-full" type="submit">
          Add Interaction
        </Button>
      </form>
    </DialogContent>
  </Dialog>
</template>
