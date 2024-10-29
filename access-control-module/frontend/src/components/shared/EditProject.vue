<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { FormField } from '../ui/form'
import FormItem from '../ui/form/FormItem.vue'
import FormLabel from '../ui/form/FormLabel.vue'
import FormControl from '../ui/form/FormControl.vue'
import FormMessage from '../ui/form/FormMessage.vue'
import { useProjectStore } from '@/stores/project'
import { computed, toRaw, watch } from 'vue'
import Popover from '../ui/popover/Popover.vue'
import PopoverTrigger from '../ui/popover/PopoverTrigger.vue'
import { cn } from '@/lib/utils'
import PopoverContent from '../ui/popover/PopoverContent.vue'
import Calendar from '../ui/calendar/Calendar.vue'
import { CalendarIcon, PencilIcon } from 'lucide-vue-next'
import { DateFormatter, parseDate } from '@internationalized/date'
import { toDate } from 'radix-vue/date'
import type { AxiosError } from 'axios'
import { useToast } from '../ui/toast'
import apiClient from '@/services/apiClient'

const props = defineProps(['projectDetails'])

const projectStore = useProjectStore()
const { toast } = useToast()

// Immediately set the project in store when props change
watch(
    () => props.projectDetails,
    (newProjectDetails) => {
        projectStore.setCurrentProject(toRaw(newProjectDetails))
    },
    { immediate: true }
)

// Use a computed property to get current project details
const initialValues = computed(() => ({
    name: projectStore.currentProject?.name,
    description: projectStore.currentProject?.description,
    startDate: projectStore.currentProject?.startDate.split('T')[0] as string,
    endDate: projectStore.currentProject?.endDate?.split('T')[0] as string || undefined
}))

const editProjectSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string(),
    startDate: z.string().refine(v => v, { message: 'Start date is required' }),
    endDate: z.string().optional()
  })
);

const { handleSubmit, setFieldValue, values } = useForm({
    validationSchema: editProjectSchema,
    initialValues: initialValues.value,
})

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const startDateValue = computed({
  get: () => values.startDate ? parseDate(values.startDate) : undefined,
  set: val => val
})

const endDateValue = computed({
  get: () => values.endDate ? parseDate(values.endDate) : undefined,
  set: val => val
})

const onSubmit = handleSubmit(async (values) => {
    try {
        const { data } = await apiClient.patch(`/project/${projectStore.currentProject?.id}`, { ...values, startDate: new Date(values.startDate), endDate: new Date(values?.endDate as string) })
        
        toast({
            title: 'Success',
            description: `Project ${data.name} updated successfully`
        })

        projectStore.setCurrentProject(data);
        projectStore.loadProjects();
    } catch (error) {
        console.log(error);
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
  <Dialog>
    <DialogTrigger as-child>
      <Button class="flex space-x-2">
        <PencilIcon />
        Edit
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogDescription>
          Make changes to the project here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <FormField name="startDate">
            <FormLabel>Start Date</FormLabel>
            <Popover>
                <PopoverTrigger as-child>
                    <FormControl>
                    <Button
                        variant="outline" :class="cn(
                        'text-start font-normal w-full',
                        !startDateValue && 'text-muted-foreground',
                        )"
                    >
                        <p> {{ startDateValue ? df.format(toDate(startDateValue)) : "Pick a date" }}</p>
                        <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                    </Button>
                    <input hidden>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                    <Calendar
                    v-model="startDateValue"
                    calendar-label="Start Date"
                    initial-focus
                    @update:model-value="(v) => {
                        if (v) {
                        setFieldValue('startDate', v.toString())
                        }
                        else {
                        setFieldValue('startDate', undefined)
                        }

                    }"
                    />
                </PopoverContent>
            </Popover>
        </FormField>

        <FormField name="endDate">
            <FormLabel>End Date</FormLabel>
            <Popover>
                <PopoverTrigger as-child>
                    <FormControl>
                    <Button
                        variant="outline" :class="cn(
                        'text-start font-normal w-full',
                        !startDateValue && 'text-muted-foreground',
                        )"
                    >
                        <p> {{ endDateValue ? df.format(toDate(endDateValue)) : "Pick a date" }}</p>
                        <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                    </Button>
                    <input hidden>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                    <Calendar
                    v-model="endDateValue"
                    calendar-label="End Date"
                    initial-focus
                    @update:model-value="(v) => {
                        if (v) {
                        setFieldValue('endDate', v.toString())
                        }
                        else {
                        setFieldValue('endDate', undefined)
                        }

                    }"
                    />
                </PopoverContent>
            </Popover>
        </FormField>

        <DialogFooter>
            <Button type="submit">
            Save changes
            </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>