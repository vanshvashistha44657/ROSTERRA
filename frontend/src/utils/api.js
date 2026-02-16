const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token')
}

// Create headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

// Authentication APIs
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Login failed')
    }
    
    return response.json()
  },

  signup: async (name, email, password) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Signup failed')
    }
    
    return response.json()
  },

  verifyToken: async () => {
    const response = await fetch(`${API_URL}/auth/verify`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Token verification failed')
    }
    
    return response.json()
  }
}

// Roaster Profile APIs
export const roasterAPI = {
  // Get all roaster profiles
  getAll: async () => {
    const response = await fetch(`${API_URL}/roasters`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch roasters')
    }
    
    return response.json()
  },

  // Get single roaster profile
  getById: async (id) => {
    const response = await fetch(`${API_URL}/roasters/${id}`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch roaster')
    }
    
    return response.json()
  },

  // Create single roaster profile
  create: async (data) => {
    const response = await fetch(`${API_URL}/roasters`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create roaster')
    }
    
    return response.json()
  },

  // Create multiple roaster profiles (bulk)
  createBulk: async (roasters) => {
    const response = await fetch(`${API_URL}/roasters/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ roasters })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create roasters')
    }
    
    return response.json()
  },

  // Update roaster profile
  update: async (id, data) => {
    const response = await fetch(`${API_URL}/roasters/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update roaster')
    }
    
    return response.json()
  },

  // Delete single roaster profile
  delete: async (id) => {
    const response = await fetch(`${API_URL}/roasters/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete roaster')
    }
    
    return response.json()
  },

  // Clear all roaster profiles
  clearAll: async () => {
    const response = await fetch(`${API_URL}/roasters/clear/all`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to clear roasters')
    }
    
    return response.json()
  }
}

// User API endpoints
export const userAPI = {
  // Get all users (admin only)
  getAll: async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch users')
    }
    
    return response.json()
  },

  // Get pending users count (admin only)
  getPendingCount: async () => {
    const response = await fetch(`${API_URL}/users/pending/count`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch pending count')
    }
    
    return response.json()
  },

  // Get pending users (admin only)
  getPending: async () => {
    const response = await fetch(`${API_URL}/users/pending`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch pending users')
    }
    
    return response.json()
  },

  // Approve user (admin only)
  approve: async (id) => {
    const response = await fetch(`${API_URL}/users/${id}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to approve user')
    }
    
    return response.json()
  },

  // Reject user (admin only)
  reject: async (id) => {
    const response = await fetch(`${API_URL}/users/${id}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to reject user')
    }
    
    return response.json()
  },

  // Delete user (admin only)
  delete: async (id) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete user')
    }
    
    return response.json()
  }
}

export default {
  authAPI,
  roasterAPI,
  userAPI
}
