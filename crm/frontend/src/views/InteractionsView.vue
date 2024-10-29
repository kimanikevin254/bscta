<script setup lang="ts">
import ViewNotes from '@/components/interactions/ViewNotes.vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import Button from '@/components/ui/button/Button.vue';
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue';
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue';
import Table from '@/components/ui/table/Table.vue';
import TableBody from '@/components/ui/table/TableBody.vue';
import TableCell from '@/components/ui/table/TableCell.vue';
import TableHead from '@/components/ui/table/TableHead.vue';
import TableHeader from '@/components/ui/table/TableHeader.vue';
import TableRow from '@/components/ui/table/TableRow.vue';
import { useToast } from '@/components/ui/toast';
import { getInteractions } from '@/services/interactionService';
import type { Interaction } from '@/types';
import { AxiosError } from 'axios';
import { EllipsisVertical } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';

const { toast } = useToast()

const interactions = ref<Interaction[] | null>(null)

const retrieveInteractions = async () => {
    try {
      interactions.value = await getInteractions()
  } catch (error) {
      if (error instanceof AxiosError && error.response) {
          toast({
              title: 'Error',
              description: error.response.data.message || 'Could not fetch interactions'
          });
      } else {
          toast({
              title: 'Error',
              description: 'An unexpected error occurred. Please try again.'
          });
      }
  }
}

onMounted(() => {
    retrieveInteractions()
})

</script>

<template>
    <DashboardLayout>
        <h1 class="text-lg font-semibold md:text-2xl">
            Interactions
      </h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Customer/Lead</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="interaction in interactions" :key="interaction.id">
                <TableCell>{{ new Date(interaction.date).toLocaleString() }}</TableCell>
                <TableCell>{{ interaction.interactionType }}</TableCell>
                <TableCell>{{ interaction.customer ? interaction.customer.name : interaction.lead?.name }}</TableCell>
                <TableCell>{{ interaction.createdBy.name }}</TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="ghost">
                                <EllipsisVertical class="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                        <DropdownMenuItem>
                            <ViewNotes :interaction-details="interaction" />
                        </DropdownMenuItem>
                        </DropdownMenuContent> 
                    </DropdownMenu>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>

</DashboardLayout>
</template>