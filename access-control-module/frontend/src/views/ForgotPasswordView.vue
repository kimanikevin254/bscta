<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { FormField } from '@/components/ui/form';
import FormControl from '@/components/ui/form/FormControl.vue';
import FormItem from '@/components/ui/form/FormItem.vue';
import FormLabel from '@/components/ui/form/FormLabel.vue';
import FormMessage from '@/components/ui/form/FormMessage.vue';
import Input from '@/components/ui/input/Input.vue';
import { useToast } from '@/components/ui/toast';
import { forgetPassword } from '@/services/userService';
import { toTypedSchema } from '@vee-validate/zod';
import type { AxiosError } from 'axios';
import { useForm } from 'vee-validate';
import * as z from 'zod';

const { toast } = useToast();

// Define schema for email validation
const forgotPasswordSchema = toTypedSchema(
    z.object({
        email: z.string().email({ message: "Please enter a valid email address" }),
    })
)

const { handleSubmit } = useForm({
  validationSchema: forgotPasswordSchema,
});

const onSubmit = handleSubmit(async (values) => {
   try {
        await forgetPassword(values.email)
        toast({
            title: 'Success',
            description: 'Check your inbox for a email reset link.'
        })
   } catch (error) {
        // Cast error to AxiosError
        const axiosError = error as AxiosError;

        if(axiosError.response){
            toast({
                title: 'Error',
                // @ts-expect-error Requires type def
                message: axiosError.response.data.message
            })
        } else {
            // Handle other error types (e.g., network errors)
            toast({
                title: 'Error',
                // @ts-expect-error Requires type def
                message: 'An unexpected error occurred. Please try again.'
            })
        }
   }
});
</script>

<template>
  <main class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
      <h1 class="text-2xl font-bold text-center">Forgot Password</h1>
      <p class="text-sm text-gray-600 text-center">Enter your email address and we’ll send you a link to reset your password.</p>
      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="name@email.com" v-bind="componentField" />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>
  
        <Button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white">Send Reset Link</Button>
      </form>
      <div class="flex justify-between mt-4 text-sm text-gray-600">
        <RouterLink to="/login" class="hover:underline">Back to Login</RouterLink>
      </div>
    </div>
  </main>
</template>
