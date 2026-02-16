import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../utils/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored token and verify it
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token with backend
      authAPI.verifyToken()
        .then(data => {
          setUser(data.user)
        })
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem('token')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password)
      
      if (data.success) {
        setUser(data.user)
        localStorage.setItem('token', data.token)
        return { success: true }
      }
      
      return { success: false, error: data.error }
    } catch (error) {
      // Check if it's a pending/rejected status error
      if (error.message.includes('pending')) {
        return { 
          success: false, 
          error: error.message,
          status: 'pending',
          message: 'Your account is pending admin approval. Please wait for approval to login.'
        }
      }
      if (error.message.includes('rejected')) {
        return { 
          success: false, 
          error: error.message,
          status: 'rejected',
          message: 'Your account has been rejected by admin. Please contact support.'
        }
      }
      return { success: false, error: error.message || 'Invalid credentials' }
    }
  }

  const signup = async (name, email, password, role = 'staff') => {
    try {
      const data = await authAPI.signup(name, email, password)
      
      if (data.success) {
        // Don't log user in - they need admin approval
        return { 
          success: true, 
          message: data.message || 'Account created. Please wait for admin approval.' 
        }
      }
      
      return { success: false, error: data.error }
    } catch (error) {
      return { success: false, error: error.message || 'Signup failed' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('rosterra_user') // Keep for backwards compatibility
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
