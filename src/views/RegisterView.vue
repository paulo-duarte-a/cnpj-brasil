<template>
  <div class="">
    <div class="">
      <Form :resolver="resolver" @submit="handleRegister" class="">
        <FormField v-slot="$fieldEmail" as="section" name="email" class="">
          <InputText v-model="credentials.email" type="email" placeholder="Email" fluid />
          <Message v-if="$fieldEmail?.invalid" severity="error" size="small" variant="simple">
            {{ $fieldEmail.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$fieldPassword" asChild name="senha">
          <section class="">
            <Password v-model="credentials.senha" placeholder="Senha@2025" :feedback="true" toggleMask fluid />
            <Message v-if="$fieldPassword?.invalid" severity="error" size="small" variant="simple">
              {{ $fieldPassword.error?.message }}
            </Message>
          </section>
        </FormField>
        <Button type="submit" :disabled="isLoading" label="Register" icon="pi pi-user-plus" iconPos="right" />
        <Button label="Já possui uma conta? Faça login" icon="pi pi-user-plus" link @click="navigateToLogin"
          class="p-mt-2" />
        <Message v-if="error" severity="error" variant="outlined">{{ error }}</Message>
        <Message v-if="success" severity="success" variant="outlined">{{ success }}</Message>
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
const success = ref<string>('')
const isLoading = ref<boolean>(false)

const passwordSchema = z
  .string()
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "A senha deve ter pelo menos 8 caracteres, incluir letras maiúsculas, minúsculas, números e um caractere especial (@$!%*?&)."
  });

const resolver = zodResolver(
  z.object({
    email: z.string().min(1, { message: 'Email é obrigatório.' }).email({ message: 'Email inválido.' }),
    senha: passwordSchema,
  })
);

const handleRegister = async (e: { valid: unknown }) => {
  if (e.valid) {
    try {
      isLoading.value = true;
      const result = await authStore.register(credentials.value);
      if (result) {
        success.value = 'Registro bem-sucedido! Agora você pode fazer login.';
        router.push({ name: 'login' });
      } else {
        error.value = 'Registro falhou. Por favor, tente novamente.';
      }
    } catch (err) {
      console.error(err);
      error.value = 'Um erro ocorreu durante o registro. Por favor, tente novamente.';
    } finally {
      isLoading.value = false;
    }
  }
}

const navigateToLogin = () => {
  router.push({ name: 'login' });
};
</script>
