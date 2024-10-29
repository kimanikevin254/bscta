<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { FormField } from '@/components/ui/form';
import FormControl from '@/components/ui/form/FormControl.vue';
import FormItem from '@/components/ui/form/FormItem.vue';
import FormLabel from '@/components/ui/form/FormLabel.vue';
import FormMessage from '@/components/ui/form/FormMessage.vue';
import Input from '@/components/ui/input/Input.vue';
import { useToast } from '@/components/ui/toast';
import { resetPassword } from '@/services/userService';
import { toTypedSchema } from '@vee-validate/zod';
import type { AxiosError } from 'axios';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const { toast } = useToast();
const showPassword = ref(false);

// Define schema for new password validation
const resetPasswordSchema = toTypedSchema(
    z.object({
        password: z.string()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
                message: 'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.',
            })
    })
);

const { handleSubmit } = useForm({
  validationSchema: resetPasswordSchema,
});

const onSubmit = handleSubmit(async (values) => {
    try {
        const data = await resetPassword({ ...values, token: route.query.token as string });
        toast({
            title: 'Success',
            description: 'Your password has been reset successfully.',
        });

        // Store data in local storage
        localStorage.setItem('accessToken', data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
        localStorage.setItem('userId', data.userId);

        // Fetch user info
        await userStore.loadUser()

        // Navigate to dashboard
        router.replace('/dashboard');
    } catch (error) {
        // Cast error to AxiosError
        const axiosError = error as AxiosError;

        if(axiosError.response){
            toast({
                title: 'Error',
                // @ts-expect-error Requires type def
                description: axiosError.response.data.message
            })
        } else {
            // Handle other error types (e.g., network errors)
            toast({
                title: 'Error',
                description: 'An unexpected error occurred. Please try again.'
            })
        };
    }
});
</script>

<template>
  <main class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
      <h1 class="text-2xl font-bold text-center">Reset Password</h1>
      <p class="text-sm text-gray-600 text-center">Enter your new password below.</p>
      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>New Password</FormLabel>
            <FormControl>
              <div class="relative">
                <Input
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="New Password"
                  v-bind="componentField"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                  @click="showPassword = !showPassword"
                >
                  <span v-if="showPassword">🙈</span>
                  <span v-else>👁️</span>
                </button>
              </div>
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <Button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white">Reset Password</Button>
      </form>
      <div class="flex justify-center mt-4 text-sm text-gray-600">
        <RouterLink to="/login" class="hover:underline">Back to Login</RouterLink>
      </div>
    </div>
  </main>
</template>
