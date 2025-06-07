<template>
  <div class="">
    <div class="">
      <Form :resolver="resolver" @submit="handleRegister" class="">
        <FormField v-slot="$field" as="section" name="email" class="">
          <InputText v-model="credentials.email" type="email" placeholder="Email" />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" asChild name="senha">
          <section class="">
            <Password v-model="credentials.senha" placeholder="Password" :feedback="true" toggleMask />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
              {{ $field.error?.message }}
            </Message>
          </section>
        </FormField>
        <Button type="submit" :disabled="isLoading" label="Register" icon="pi pi-user-plus" iconPos="right" />
        <Message vif="error" severity="error" variant="outlined">{{ error }}</Message>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { RegisterCredentials } from '@/types/auth' // Assuming RegisterCredentials will be defined
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

const router = useRouter()
const authStore = useAuthStore()
const credentials = ref<RegisterCredentials>({ email: '', senha: '' })
const error = ref<string>('')
const isLoading = ref<boolean>(false)

const passwordSchema = z
  .string()
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Password must be at least 8 characters long, include uppercase, lowercase, number, and a special character (@$!%*?&)."
  });

const resolver = zodResolver(
  z.object({
    email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Invalid email address.' }),
    senha: passwordSchema,
  })
);

const handleRegister = async (e: { valid: unknown }) => {
  if (e.valid) {
    try {
      isLoading.value = true;
      const success = await authStore.register(credentials.value); // Call the new action
      if (success) {
        // Redirect to login page after successful registration
        // Or show a success message and let them navigate manually
        router.push({ name: 'login' });
        // Optionally, display a success message to the user (e.g., using a toast notification)
      } else {
        error.value = 'Registration failed. Please try again or contact support.';
      }
    } catch (err) {
      console.error(err);
      // This catch might be redundant if authStore.register handles its own errors
      // and returns false, but good for unexpected issues.
      error.value = 'An unexpected error occurred during registration.';
    } finally {
      isLoading.value = false;
    }
  }
}
</script>
