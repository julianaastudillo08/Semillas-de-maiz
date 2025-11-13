import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Login
      login: async (email, password) => {
        try {
          set({ isLoading: true })
          const response = await api.post('/auth/login', { email, password })
          const { token, user } = response.data

          localStorage.setItem('token', token)
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })

          return { success: true, user }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      // Register
      register: async (userData) => {
        try {
          set({ isLoading: true })
          const response = await api.post('/auth/register', userData)
          set({ isLoading: false })
          return { success: true, data: response.data }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem('token')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      // Get Profile
      getProfile: async () => {
        try {
          const response = await api.get('/auth/profile')
          set({ user: response.data.user })
          return response.data.user
        } catch (error) {
          get().logout()
          throw error
        }
      },

      // Update user in store
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

