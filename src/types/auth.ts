export interface User {
  email: string
  role: string[]
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  initialized: boolean
}

export interface LoginCredentials {
  email: string
  senha: string
}

export interface RegisterCredentials {
  email: string
  senha: string
}
