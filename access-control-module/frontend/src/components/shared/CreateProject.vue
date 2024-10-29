<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import Dialog from '../ui/dialog/Dialog.vue';
import DialogContent from '../ui/dialog/DialogContent.vue';
import DialogDescription from '../ui/dialog/DialogDescription.vue';
import DialogFooter from '../ui/dialog/DialogFooter.vue';
import DialogHeader from '../ui/dialog/DialogHeader.vue';
import DialogTitle from '../ui/dialog/DialogTitle.vue';
import DialogTrigger from '../ui/dialog/DialogTrigger.vue';
import * as z from 'zod';
import { useForm } from 'vee-validate';
import { DateFormatter, parseDate } from '@internationalized/date';
import { computed } from 'vue';
import { useToast } from '../ui/toast';
import { useProjectStore } from '@/stores/project';
import type { AxiosError } from 'axios';
import { FormField } from '../ui/form';
import FormItem from '../ui/form/FormItem.vue';
import FormLabel from '../ui/form/FormLabel.vue';
import FormControl from '../ui/form/FormControl.vue';
import Input from '../ui/input/Input.vue';
import FormMessage from '../ui/form/FormMessage.vue';
import Popover from '../ui/popover/Popover.vue';
import PopoverTrigger from '../ui/popover/PopoverTrigger.vue';
import Button from '../ui/button/Button.vue';
import { CalendarIcon, PlusIcon } from 'lucide-vue-next';
import { toDate } from 'radix-vue/date';
import { cn } from '@/lib/utils';
import PopoverContent from '../ui/popover/PopoverContent.vue';
import Calendar from '../ui/calendar/Calendar.vue';
import { createProject } from '@/services/projectService';

const { toast } = useToast()
const projectStore = useProjectStore()

const createProjectSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().min(1, "Project name is required"),
    startDate: z.string().refine(v => v, { message: 'Start date is required' }),
    endDate: z.string().optional()
  })
);

const { handleSubmit, setFieldValue, values } = useForm({
    validationSchema: createProjectSchema,
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
        await createProject(values)

        toast({
            title: 'Success',
            description: `Project created successfully`
        })
        projectStore.loadProjects();
    } catch (error) {
        console.log(error);
        // Cast error to AxiosError
        const axiosError = error as AxiosError;

        if(axiosError.response){
            toast({
                title: "Unable to create project",
                // @ts-expect-error requires type def
                description: axiosError.response.data.message
            })
        } else {
            // Handle other error types (e.g., network errors)
            toast({
                title: "Unable to create project",
                description: 'An unexpected error occurred. Please try again.'
            })
        }
    }
})
</script>

<template>
    <Dialog>
    <DialogTrigger>
      <Button class="flex gap-2">
        <PlusIcon />
        Create Project
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Project</DialogTitle>
        <DialogDescription>
          Create a new project. 
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
                    Create
                </Button>
            </DialogFooter>
        </form>
    </DialogContent>
  </Dialog>
</template>