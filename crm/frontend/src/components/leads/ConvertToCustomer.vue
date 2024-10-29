<script setup lang="ts">
import { converToCustomer } from '@/services/leadServices';
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

const props = defineProps(['leadDetails', 'fetchLeads'])

const { toast } = useToast()

const dialogOpen = ref<boolean>(false)
const controlDialog = () => dialogOpen.value = !dialogOpen.value

const handleConvert = async () => {
  try {
      await converToCustomer(props.leadDetails.id)

        toast({
            title: 'Success',
            description: 'Lead has been converted successfully!'
        })

        controlDialog()

        props.fetchLeads()
  } catch (error) {
      if (error instanceof AxiosError && error.response) {
          toast({
              title: 'Error',
              description: error.response.data.message || 'Failed to convert lead. Please try again.'
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
            Convert Lead to Customer
        </DialogTrigger>
        <DialogContent>
        <DialogHeader>
            <DialogTitle>Convert Lead</DialogTitle>
            <DialogDescription>
                Are you sure you want to convert this lead to customer? This action cannot be undone.
            </DialogDescription>
        </DialogHeader>

        <DialogFooter>
            <Button variant="ghost" @click="controlDialog">Cancel</Button>
            <Button @click="handleConvert">Convert</Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
</template>