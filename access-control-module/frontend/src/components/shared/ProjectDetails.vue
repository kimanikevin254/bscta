<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useProjectStore } from '@/stores/project'
import { toRaw, watch } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { computed } from 'vue'
import { hasPermission } from '@/lib/auth'
import AssignedUsers from '@/components/shared/AssignedUsers.vue'

const props = defineProps(['projectDetails'])

const projectStore = useProjectStore()

// Immediately set the project in store when props change
watch(
    () => props.projectDetails,
    (newProjectDetails) => {
        projectStore.setCurrentProject(toRaw(newProjectDetails))
    },
    { immediate: true }
)

const currentProject = computed(() => projectStore.currentProject)
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="ghost" @click.stop class="p-0 font-normal h-4 w-full justify-start">
        View
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Project Details</DialogTitle>
        <DialogDescription>
          An overview of the project details.
        </DialogDescription>
      </DialogHeader>
        <Tabs default-value="project">
            <TabsList>
            <TabsTrigger value="project">
                Project
            </TabsTrigger>
            <TabsTrigger value="assigned" v-if="hasPermission({ resource: 'user', actions: ['READ'] })">
                Assigned
            </TabsTrigger>
            </TabsList>
            <TabsContent value="project" v-if="currentProject" class="space-y-4">
                <div class="space-y-1">
                    <p class="font-semibold">Name</p>
                    <p>{{ currentProject.name }}</p>
                </div>
                <div class="space-y-1">
                    <p class="font-semibold">Description</p>
                    <p>{{ currentProject.description }}</p>
                </div>
                <div class="space-y-1">
                    <p class="font-semibold">Start Date</p>
                    <p>{{ new Date(currentProject.startDate).toLocaleString() }}</p>
                </div>
                <div class="space-y-1">
                    <p class="font-semibold">End Date</p>
                    <p>{{ currentProject.endDate ? new Date(currentProject.endDate).toLocaleString() : "Not set" }}</p>
                </div>
                <div class="space-y-1">
                    <p class="font-semibold">Created by</p>
                    <p>{{ currentProject.creator.name}}</p>
                </div>
            </TabsContent>
            <TabsContent value="assigned">
                <AssignedUsers :project-id="currentProject?.id" />
            </TabsContent>
        </Tabs>
    </DialogContent>
  </Dialog>
</template>