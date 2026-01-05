import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '../services/api'

interface User {
  email: string
  name: string
  userId: number
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password)
    setToken(response.token)
    setUser({
      email: response.email,
      name: response.name,
      userId: response.userId,
    })
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify({
      email: response.email,
      name: response.name,
      userId: response.userId,
    }))
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await authService.register(name, email, password)
    setToken(response.token)
    setUser({
      email: response.email,
      name: response.name,
      userId: response.userId,
    })
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify({
      email: response.email,
      name: response.name,
      userId: response.userId,
    }))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

