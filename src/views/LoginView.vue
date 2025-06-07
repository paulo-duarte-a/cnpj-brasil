<template>
  <div class="">
    <div class="">
      <Form :resolver @submit="handleLogin" class="">
        <FormField v-slot="$field" as="section" name="username" initialValue="{{ credentials.email }}" class="">
          <InputText v-model="credentials.email" type="text" placeholder="Username" />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" asChild name="password" initialValue="{{ credentials.senha }}">
          <section class="">
            <Password v-model="credentials.senha" type="text" placeholder="Password" :feedback="false" toggleMask />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
              {{ $field.error?.message }}
            </Message>
          </section>
        </FormField>
        <Button type="submit" :disabled="isLoading" label="Login" icon="pi pi-user" iconPos="right" />
        <Message v-if="error" severity="error" variant="outlined">{{ error }}</Message>
        <Button label="Don't have an account? Register here" link @click="navigateToRegister" class="p-mt-2" />
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials } from '@/types/auth'
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

const router = useRouter()
const authStore = useAuthStore()
const credentials = ref<LoginCredentials>({ email: 'teste@teste.com', senha: 'Teste@2025' })
const error = ref<string>('')
const isLoading = ref<boolean>(false)

const resolver = zodResolver(
  z.object({
    username: z.string().min(1, { message: 'Username is required.' }),
    password: z.string().min(1, { message: 'Password is required.' }),
    // password: z
    //   .string()
    //   .min(3, { message: 'Minimum 3 characters.' })
    //   .refine((value) => /[a-z]/.test(value), {
    //     message: 'Must have a lowercase letter.'
    //   })
    //   .refine((value) => /[A-Z]/.test(value), {
    //     message: 'Must have an uppercase letter.'
    //   })
    //   .refine((value) => /\d/.test(value), {
    //     message: 'Must have a number.'
    //   })
  })
);

const handleLogin = async (e: { valid: unknown }) => {
  // e.originalEvent: Represents the native form submit event.
  // e.valid: A boolean that indicates whether the form is valid or not.
  // e.states: Contains the current state of each form field, including validity status.
  // e.errors: An object that holds any validation errors for the invalid fields in the form.
  // e.values: An object containing the current values of all form fields.
  // e.reset: A function that resets the form to its initial state.

  if (e.valid) {

    try {
      isLoading.value = true
      const success = await authStore.login(credentials.value)
      if (success) {
        router.push({ name: 'home' })
      } else {
        error.value = 'Credenciais inválidas'
      }
    } catch (err) {
      console.log(err)
      error.value = 'Erro na autenticação'
    } finally {
      isLoading.value = false
    }
  }
}

const navigateToRegister = () => {
  router.push({ name: 'register' });
};
</script>
