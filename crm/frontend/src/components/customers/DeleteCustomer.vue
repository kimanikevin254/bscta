<script setup lang="ts">
import Button from '../ui/button/Button.vue';
import Dialog from '../ui/dialog/Dialog.vue';
import DialogContent from '../ui/dialog/DialogContent.vue';
import DialogDescription from '../ui/dialog/DialogDescription.vue';
import DialogFooter from '../ui/dialog/DialogFooter.vue';
import DialogHeader from '../ui/dialog/DialogHeader.vue';
import DialogTitle from '../ui/dialog/DialogTitle.vue';
import DialogTrigger from '../ui/dialog/DialogTrigger.vue';
import { useToast } from '../ui/toast';
import { AxiosError } from 'axios';
import { ref } from 'vue';
import { deleteCustomer } from '@/services/customersService';

const props = defineProps(['customerDetails', 'fetchCustomers'])

const { toast } = useToast()

const dialogOpen = ref<boolean>(false)
const controlDialog = () => dialogOpen.value = !dialogOpen.value

const handleDeleteCustomer = async () => {
  try {
      await deleteCustomer(props.customerDetails.id)

        toast({
            title: 'Success',
            description: 'Customer has been deleted successfully!'
        })

        controlDialog()

    props.fetchCustomers()
  } catch (error) {
      if (error instanceof AxiosError && error.response) {
          toast({
              title: 'Error',
              description: error.response.data.message || 'Failed to delete customer. Please try again.'
          });
      } else {
          toast({
              title: 'Error',
              description: 'An unexpected error occurred. Please try again.'
          });
      }
  }
}

</script>

<template>
    <Dialog>
        <DialogTrigger @click.stop="controlDialog">
            Delete Customer
        </DialogTrigger>
        <DialogContent>
        <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
                Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
        </DialogHeader>

        <DialogFooter>
            <Button variant="ghost" @click="controlDialog">Cancel</Button>
            <Button variant="destructive" @click="handleDeleteCustomer">Delete</Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
</template>