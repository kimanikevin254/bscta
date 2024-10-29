<script setup lang="ts">
import AddInteraction from '@/components/customers/AddInteraction.vue';
import DeleteCustomer from '@/components/customers/DeleteCustomer.vue';
import EditCustomer from '@/components/customers/EditCustomer.vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
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
import { getCustomers, searchCustomers } from '@/services/customersService';
import type { Customer } from '@/types';
import { AxiosError } from 'axios';
import { EllipsisVertical } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';

const { toast } = useToast()

const customers = ref<Customer[] | null>(null)
const selectedStatus = ref<string | undefined>(undefined);


const retrieveCustomers = async () => {
    try {
      customers.value = await getCustomers()
  } catch (error) {
      if (error instanceof AxiosError && error.response) {
          toast({
              title: 'Error',
              description: error.response.data.message || 'Could not fetch customers'
          });
      } else {
          toast({
              title: 'Error',
              description: 'An unexpected error occurred. Please try again.'
          });
      }
  }
}

const handleSearchCustomers = async (status: string) => {
    try {
        customers.value = await searchCustomers({ status })
    } catch (error) {
        console.log(error);
    }
}

watch(selectedStatus, (newStatus) => {
    if(newStatus === 'ALL') {
        retrieveCustomers();
    } else {
        handleSearchCustomers(newStatus as string);
    }
});

onMounted(() => {
    retrieveCustomers()
})

</script>

<template>
    <DashboardLayout>
        <h1 class="text-lg font-semibold md:text-2xl">
            Customers
      </h1>

      <div class="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Select v-model="selectedStatus">
            <SelectTrigger>
            <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ALL">
                    All
                </SelectItem>
                <SelectItem value="ACTIVE">
                    Active
                </SelectItem>
                <SelectItem value="INACTIVE">
                    Inactive
                </SelectItem>
            </SelectContent>
        </Select>
        </div>
        <div />
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
            <TableRow v-for="customer in customers" :key="customer.id">
                <TableCell>{{ customer.name }}</TableCell>
                <TableCell>{{ customer.email }}</TableCell>
                <TableCell>{{ customer.phone }}</TableCell>
                <TableCell>{{ customer.companyName }}</TableCell>
                <TableCell>{{ customer.status }}</TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="ghost">
                                <EllipsisVertical class="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                         <DropdownMenuItem>
                            <EditCustomer :customer-details="customer" :fetch-customers="retrieveCustomers" />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <DeleteCustomer :customer-details="customer" :fetch-customers="retrieveCustomers" />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <AddInteraction :customer-details="customer" />
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>

    </DashboardLayout>
</template>