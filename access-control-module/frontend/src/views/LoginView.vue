<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { FormField } from '@/components/ui/form';
import FormControl from '@/components/ui/form/FormControl.vue';
import FormItem from '@/components/ui/form/FormItem.vue';
import FormLabel from '@/components/ui/form/FormLabel.vue';
import FormMessage from '@/components/ui/form/FormMessage.vue';
import Input from '@/components/ui/input/Input.vue';
import apiClient from '@/services/apiClient';
import { useUserStore } from '@/stores/user';
import { toTypedSchema } from '@vee-validate/zod';
import type { AxiosError } from 'axios';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as z from 'zod';

const router = useRouter();
const userStore = useUserStore();

const errorMessage = ref('');

const loginSchema = toTypedSchema(
  z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Must be a valid email' }),
    password: z.string().min(1, { message: 'Password is required' }),
  })
)

const { handleSubmit } = useForm({
  validationSchema: loginSchema,
})

const onSubmit = handleSubmit(async (values) => {
  try {
      const { data } = await apiClient.post('/auth/login', { email: values.email, password: values.password })
      
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
        // @ts-expect-error Requires type def
        errorMessage.value = axiosError.response.data.message
      } else {
        // Handle other error types (e.g., network errors)
        errorMessage.value = 'An unexpected error occurred. Please try again.';
      }
    }
})

</script>

<template>
  <main class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
      <h1 class="text-2xl font-bold text-center">Login</h1>
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

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="******" v-bind="componentField" />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <Button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white">Login</Button>
      </form>
      <div class="flex justify-between items-center mt-4 text-sm text-gray-600">
        <RouterLink to="/forgot-password" class="hover:underline">Forgot password?</RouterLink>
      </div>
    </div>
  </main>
</template>