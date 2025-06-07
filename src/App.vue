<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const baseMenuItems = ref([
  {
    label: 'Início',
    icon: 'pi pi-home',
    command: () => router.push('/')
  },
  // {
  //   label: 'Dashboard',
  //   icon: 'pi pi-chart-bar',
  //   command: () => router.push('/dashboard')
  // },
  // {
  //   label: 'Usuários',
  //   icon: 'pi pi-users',
  //   items: [
  //     {
  //       label: 'Listagem',
  //       icon: 'pi pi-list',
  //       command: () => router.push('/users')
  //     },
  //     {
  //       label: 'Novo Usuário',
  //       icon: 'pi pi-plus',
  //       command: () => router.push('/users/new')
  //     }
  //   ]
  // },
  // {
  //   label: 'Configurações',
  //   icon: 'pi pi-cog',
  //   command: () => router.push('/settings')
  // }
])

const logout = async () => {
  authStore.logout()
  await router.push({ name: 'login' })
}

const computedMenuItems = computed(() => {
  const items = [...baseMenuItems.value]
  if (authStore.user) {
    items.push({
      label: 'Sair',
      icon: 'pi pi-sign-out',
      command: logout
    })
  }
  return items
})
</script>

<template>
  <div class="main-container">
    <!-- Barra de navegação -->
    <nav class="">
      <div class="">
        <div class="nav-menu">
          <!-- Menu Principal -->
          <Menubar :model="computedMenuItems" class="">
            <template #start></template>
          </Menubar>
        </div>
      </div>
    </nav>

    <!-- Container Principal -->
    <main class="main-content">
      <router-view />
      <ScrollTop />
    </main>

    <!-- Rodapé -->
    <footer class="footer-content">
      <div class="">
        © {{ new Date().getFullYear() }} CNPJ Brasil
      </div>
    </footer>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
}

.main-content,
.footer-content {
  justify-items: center;
  margin: auto;
  padding: 2dvw;
}
</style>
