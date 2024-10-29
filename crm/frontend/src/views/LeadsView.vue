<script setup lang="ts">
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import AddInteraction from '@/components/leads/AddInteraction.vue';
import ConvertToCustomer from '@/components/leads/ConvertToCustomer.vue';
import CreateNewLead from '@/components/leads/CreateNewLead.vue';
import DeleteLead from '@/components/leads/DeleteLead.vue';
import EditLead from '@/components/leads/EditLead.vue';
import Button from '@/components/ui/button/Button.vue';
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue';
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue';
import Select from '@/components/ui/select/Select.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';
import Table from '@/components/ui/table/Table.vue';
import TableBody from '@/components/ui/table/TableBody.vue';
import TableCell from '@/components/ui/table/TableCell.vue';
import TableHead from '@/components/ui/table/TableHead.vue';
import TableHeader from '@/components/ui/table/TableHeader.vue';
import TableRow from '@/components/ui/table/TableRow.vue';
import { useToast } from '@/components/ui/toast';
import { getLeads, searchLeads } from '@/services/leadServices';
import type { Lead } from '@/types';
import { AxiosError } from 'axios';
import { EllipsisVertical } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';

const { toast } = useToast()

const leads = ref<Lead[] | null>(null)
const selectedStatus = ref<string | undefined>(undefined);

const retrieveLeads = async () => {
    try {
      leads.value = await getLeads()
  } catch (error) {
      if (error instanceof AxiosError && error.response) {
          toast({
              title: 'Error',
              description: error.response.data.message || 'Could not fetch leads'
          });
      } else {
          toast({
              title: 'Error',
              description: 'An unexpected error occurred. Please try again.'
          });
      }
  }
}

const handleSearchLeads = async (status: string) => {
    try {
        leads.value = await searchLeads({ status })
    } catch (error) {
        console.log(error);
    }
}

watch(selectedStatus, (newStatus) => {
    if(newStatus === 'ALL') {
        retrieveLeads();
    } else {
        handleSearchLeads(newStatus as string);
    }
});

onMounted(() => {
    retrieveLeads()
})

</script>

<template>
    <DashboardLayout>
        <h1 class="text-lg font-semibold md:text-2xl">
            Leads
      </h1>

      <div class="flex justify-between items-center mb-4">
        <div className="w-32">
          <Select v-model="selectedStatus">
            <SelectTrigger>
            <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ALL">
                    All
                </SelectItem>
                <SelectItem value="NEW">
                    New
                </SelectItem>
                <SelectItem value="IN_PROGRESS">
                    In Progress
                </SelectItem>
                <SelectItem value="CONVERTED">
                    Converted
                </SelectItem>
                <SelectItem value="CLOSED">
                    Closed
                </SelectItem>
            </SelectContent>
        </Select>
        </div>
        <CreateNewLead :fetch-leads="retrieveLeads" />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="lead in leads" :key="lead.id">
                <TableCell>{{ lead.name }}</TableCell>
                <TableCell>{{ lead.email }}</TableCell>
                <TableCell>{{ lead.phone }}</TableCell>
                <TableCell>{{ lead.companyName }}</TableCell>
                <TableCell>{{ lead.status }}</TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="ghost">
                                <EllipsisVertical class="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                        <DropdownMenuItem>
                            <EditLead :lead-details="lead" :fetch-leads="retrieveLeads" />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <DeleteLead :lead-details="lead" :fetch-leads="retrieveLeads" />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <ConvertToCustomer :lead-details="lead" :fetch-leads="retrieveLeads" />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <AddInteraction :lead-details="lead" />
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>

    </DashboardLayout>
</template>