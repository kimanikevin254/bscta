<script setup lang="ts">
import AssignedUsers from '@/components/shared/AssignedUsers.vue';
import DashboardLayout from '@/components/shared/DashboardLayout.vue';
import DeleteProject from '@/components/shared/DeleteProject.vue';
import EditProject from '@/components/shared/EditProject.vue';
import Tabs from '@/components/ui/tabs/Tabs.vue';
import TabsContent from '@/components/ui/tabs/TabsContent.vue';
import TabsList from '@/components/ui/tabs/TabsList.vue';
import TabsTrigger from '@/components/ui/tabs/TabsTrigger.vue';
import { useToast } from '@/components/ui/toast';
import { hasPermission } from '@/lib/auth';
import { fetchProject } from '@/services/projectService';
import { useProjectStore } from '@/stores/project';
import type { AxiosError } from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { toast } = useToast();
const projectStore = useProjectStore()

const project = computed(() => projectStore.currentProject)
const isProjectLoading = ref<boolean>(true)

const fetchProjectDetails = async () => {
    try {
        const data = await fetchProject(route.params.projectId as string)
        projectStore.setCurrentProject(data)
    } catch (error) {
        // Cast error to AxiosError
      const axiosError = error as AxiosError;

        if(axiosError.response){
            toast({
                title: "Unable to fetch project",
                // @ts-expect-error requires type def
                description: axiosError.response.data.message
            })
        } else {
            // Handle other error types (e.g., network errors)
            toast({
                title: "Unable to fetch project",
                description: 'An unexpected error occurred. Please try again.'
            })
        }
    } finally {
        isProjectLoading.value = false
    }
}

onMounted(async () => {
    fetchProjectDetails()
})
</script>

<template>
    <DashboardLayout>
        <h1 class="text-lg font-semibold md:text-2xl">
            Project Details
        </h1>

        <Tabs default-value="project">
            <TabsList>
            <TabsTrigger value="project">
                Project
            </TabsTrigger>
            <TabsTrigger value="assigned" v-if="hasPermission({ resource: 'user', actions: ['READ'] })">
                Assigned
            </TabsTrigger>
            </TabsList>
            <TabsContent value="project" class="space-y-4">
                <p v-if="isProjectLoading">Loading...</p>

                <div v-if="project">
                    <div class="space-y-1">
                        <p class="font-semibold">Name</p>
                        <p>{{ project.name }}</p>
                    </div>
                    <div class="space-y-1">
                        <p class="font-semibold">Description</p>
                        <p>{{ project.description }}</p>
                    </div>
                    <div class="space-y-1">
                        <p class="font-semibold">Start Date</p>
                        <p>{{ new Date(project.startDate).toLocaleString() }}</p>
                    </div>
                    <div class="space-y-1">
                        <p class="font-semibold">End Date</p>
                        <p>{{ project.endDate ? new Date(project.endDate).toLocaleString() : "Not set" }}</p>
                    </div>

                    <div class="mt-4 flex gap-4 items-center">
                        <EditProject v-if="hasPermission({ resource: 'project', actions: ['UPDATE'] })" :project-details="project" />
                        <DeleteProject v-if="hasPermission({ resource: 'project', actions: ['DELETE'] })" project-id="project.id" />
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="assigned">
                <AssignedUsers :project-id="project?.id" />
            </TabsContent>
        </Tabs>
    </DashboardLayout>
</template>