<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField } from '@/components/ui/form';
import FormControl from '@/components/ui/form/FormControl.vue';
import FormItem from '@/components/ui/form/FormItem.vue';
import FormLabel from '@/components/ui/form/FormLabel.vue';
import FormMessage from '@/components/ui/form/FormMessage.vue';
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast';
import { register } from '@/services/authService';
import { toTypedSchema } from '@vee-validate/zod';
import { AxiosError } from 'axios';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as z from 'zod';

const router = useRouter();
const { toast } = useToast();

const showPassword = ref(false);

// Define signup schema
const signupSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Must be a valid email' }),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
      ),
  })
);

// Initialize form
const { handleSubmit } = useForm({
  validationSchema: signupSchema,
});

// Signup submission handler
const onSubmit = handleSubmit(async (values) => {
  try {
      await register(values); // Call the registration service
      router.replace('/dashboard'); // Redirect to the dashboard after successful signup
  } catch (error) {
      if (error instanceof AxiosError && error.response) {
          toast({
              title: 'Error',
              description: error.response.data.message || 'Registration failed. Please try again.'
          });
      } else {
          toast({
              title: 'Error',
              description: 'An unexpected error occurred. Please try again.'
          });
      }
  }
});
</script>

<template>
  <div class="flex h-screen w-screen items-center justify-center">
    <Card class="w-full max-w-sm">
        <CardHeader>
        <CardTitle class="text-2xl">
            Sign Up
        </CardTitle>
        <CardDescription>
            Create an account to get started.
        </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
            <form @submit="onSubmit" class="space-y-4">
                <FormField v-slot="{ componentField }" name="name">
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                    <Input type="text" placeholder="John Doe" v-bind="componentField" />
                    </FormControl>
                    <FormMessage class="text-xs" />
                </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="email">
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                    <Input type="email" placeholder="name@email.com" v-bind="componentField" />
                    </FormControl>
                    <FormMessage class="text-xs" />
                </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="password">
                <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <div class="relative">
                            <Input
                                :type="showPassword ? 'text' : 'password'"
                                placeholder="******"
                                v-bind="componentField"
                            />
                            <!-- Toggle visibility icon/button -->
                            <button
                                type="button"
                                @click="showPassword = !showPassword"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            >
                                {{ showPassword ? 'Hide' : 'Show' }}
                            </button>
                        </div>
                    </FormControl>
                    <FormMessage class="text-xs" />
                </FormItem>
                </FormField>

                <Button class="w-full" type="submit">
                    Sign up
                </Button>

            </form>
            <div class="flex justify-between items-center mt-4 text-sm text-gray-600">
                <p>Already have an account? <RouterLink to="/login" class="underline">Login</RouterLink></p>
            </div>
        </CardContent>
    </Card>
  </div>
</template>
