export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
} 