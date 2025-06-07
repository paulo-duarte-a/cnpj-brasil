import { defineStore } from 'pinia'
import api from '@/utils/axios'
import type { User, AuthState, LoginCredentials, RegisterCredentials } from '@/types/auth'

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

    async register(credentials: RegisterCredentials): Promise<boolean> {
      try {
        this.isLoading = true;
        // Assuming the register endpoint does not return a token directly or log the user in.
        // If it does, the logic here might need to change (e.g., store token, fetch user).
        await api.post('/auth/register', credentials);
        // After successful registration, typically the user would be redirected to login,
        // or automatically logged in. For now, just return true.
        // The issue doesn't specify auto-login, so we'll assume they need to login after.
        return true;
      } catch (error) {
        console.error('Registration failed:', error);
        // You might want to inspect the error response to provide more specific feedback
        // if (axios.isAxiosError(error) && error.response) {
        //   // Handle specific error messages from backend
        // }
        return false;
      } finally {
        this.isLoading = false;
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
