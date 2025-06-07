import { defineStore } from 'pinia'
import api from '@/utils/axios'
import type { User, AuthState, LoginCredentials } from '@/types/auth'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isLoading: false,
    initialized: false,
  }),
  actions: {
    async login(credentials: LoginCredentials): Promise<boolean> {
      try {
        this.isLoading = true
        const response = await api.post<{ accessToken: string }>('/auth/login', credentials)
        localStorage.setItem('token', response.data.accessToken)
        await this.fetchUser()
        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      } finally {
        this.isLoading = false
      }
    },

    async fetchUser(): Promise<boolean> {
      try {
        this.isLoading = true
        const response = await api.get<User>('/usuarios/me')
        this.user = response.data
        return true
      } catch (error) {
        console.error(error)
        this.logout()
        return false
      } finally {
        this.isLoading = false
      }
    },

    logout(): void {
      localStorage.removeItem('token')
      this.user = null
    },

    async initialize(): Promise<void> {
      const token = localStorage.getItem('token')
      if (token && !this.user) {
        await this.fetchUser()
      }
      this.initialized = true
    },
  },
})
