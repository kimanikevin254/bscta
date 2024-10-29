<script setup lang="ts">
import DashboardLayout from '@/components/shared/DashboardLayout.vue';
import Table from '@/components/ui/table/Table.vue';
import TableBody from '@/components/ui/table/TableBody.vue';
import TableCell from '@/components/ui/table/TableCell.vue';
import TableHead from '@/components/ui/table/TableHead.vue';
import TableHeader from '@/components/ui/table/TableHeader.vue';
import TableRow from '@/components/ui/table/TableRow.vue';
import { ChevronRight } from 'lucide-vue-next';
import { computed, onMounted } from 'vue';
import { useProjectStore } from '@/stores/project';
import { useToast } from '@/components/ui/toast';
import type { AxiosError } from 'axios';
import CreateProject from '@/components/shared/CreateProject.vue';
import { hasPermission } from '@/lib/auth';

const projectStore = useProjectStore();
const { toast } = useToast()

const projects = computed(() => projectStore.projects)

onMounted(() => {
    try {
      projectStore.loadProjects()
    } catch (error) {
      console.log(error)
      // Cast error to AxiosError
      const axiosError = error as AxiosError;

      if(axiosError.response){
          toast({
              title: "Unable to update project",
              // @ts-expect-error requires type def
              description: axiosError.response.data.message
          })
      } else {
          // Handle other error types (e.g., network errors)
          toast({
              title: "Unable to update project",
              description: 'An unexpected error occurred. Please try again.'
          })
      }
    }
})
</script>

<template>
  <DashboardLayout>
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-semibold md:text-2xl">
        Projects
      </h1>

      <CreateProject v-if="hasPermission({ resource: 'project', actions: ['CREATE'] })"/>
    </div>

    <p v-if="projectStore.isLoadingProjects">Loading...</p>
    <p v-else-if="projectStore.projects.length === 0">No projects</p>
    <Table v-else>
      <TableHeader>
        <TableRow>
          <TableHead>
            Name
          </TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>
            Created By
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="project in projects" :key="project.id">
          <TableCell class="font-medium">
            {{ project.name }}
          </TableCell>
          <TableCell>{{ new Date(project.startDate).toLocaleDateString() }}</TableCell>
          <TableCell>{{ project.endDate ? new Date(project.endDate).toLocaleDateString() : '_' }}</TableCell>
          <TableCell>
            {{ project.creator.name }}
          </TableCell>
          <TableCell>
            <RouterLink :to="{ path: `/dashboard/project/${project.id}` }">
              <ChevronRight />
            </RouterLink>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </DashboardLayout>
</template>