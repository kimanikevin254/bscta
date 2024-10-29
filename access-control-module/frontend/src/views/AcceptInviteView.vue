<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { FormField } from '@/components/ui/form';
import FormControl from '@/components/ui/form/FormControl.vue';
import FormItem from '@/components/ui/form/FormItem.vue';
import FormLabel from '@/components/ui/form/FormLabel.vue';
import FormMessage from '@/components/ui/form/FormMessage.vue';
import Input from '@/components/ui/input/Input.vue';
import { useToast } from '@/components/ui/toast';
import { acceptInvite } from '@/services/userService';
import { useUserStore } from '@/stores/user';
import { toTypedSchema } from '@vee-validate/zod';
import type { AxiosError } from 'axios';
import { useForm } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import * as z from 'zod'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { toast } = useToast()

const acceptInviteSchema = toTypedSchema(
    z.object({
        password: z.string()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
            message: 'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character(@$!%*?&).',
            }),
        address: z.string()
            .min(5, { message: "Address must be at least 5 characters long" }) // Ensure a valid address
            .max(100, { message: "Address must be at most 100 characters long" }), // Limit address length
        kraPinNumber: z.string()
            .length(11, { message: "KRA PIN Number must be exactly 11 characters long" })
            .regex(/^A\d{10}$/, { message: "KRA PIN Number must start with 'A' followed by 10 digits" }), // Validate KRA PIN format
    })
)

const { handleSubmit } = useForm({
  validationSchema: acceptInviteSchema,
})

// const showPassword = ref<boolean>(false);

const onSubmit = handleSubmit(async (values) => {
   try {
        const data = await acceptInvite({ ...values, token: route.query.token as string })

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
})

</script>

<template>
    <main class="flex items-center justify-center min-h-screen bg-gray-50">
      <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h1 class="text-2xl font-bold text-center">Accept Invite</h1>
        <form @submit="onSubmit" class="space-y-4">
          <FormField v-slot="{ componentField }" name="address">
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Your Address" v-bind="componentField" />
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="kraPinNumber">
            <FormItem>
              <FormLabel>KRA PIN</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Your KRA PIN Number" v-bind="componentField" />
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem class="relative">
              <FormLabel>Password</FormLabel>
              <FormControl class="relative">
                <Input type="text" placeholder="Your Password" v-bind="componentField" />
                <!-- <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 px-3 mt-4 text-gray-600 hover:text-gray-800 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  <span v-if="showPassword">🙈</span>
                  <span v-else>👁️</span>
                </button> -->
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>
  
          <Button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white">Accept Invite</Button>
        </form>
      </div>
    </main>
</template>

  