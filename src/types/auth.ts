export interface User {
  email: string
  role: string
}

export interface LoginCredentials {
  email: string
  senha: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  initialized: boolean
}
