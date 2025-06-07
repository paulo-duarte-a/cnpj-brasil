export interface User {
  id: string; // Or number, depending on your backend
  email: string;
  // name?: string; // Example of another potential user field
  // roles?: string[]; // Example for user roles
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  initialized: boolean; // To track if initial auth check is done
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterCredentials {
  email: string;
  senha: string;
}
