import { createContext, useContext, useState, useEffect } from 'react'
import { roasterAPI } from '../utils/api'

const DataContext = createContext()

export function DataProvider({ children }) {
  const [profiles, setProfiles] = useState([])
  const [selectedProfiles, setSelectedProfiles] = useState([])
  const [roasterProfiles, setRoasterProfiles] = useState([])
  const [isLoadingRoasters, setIsLoadingRoasters] = useState(false)

  // Load roaster profiles from backend on mount
  useEffect(() => {
    loadRoasterProfilesFromBackend()
  }, [])

  useEffect(() => {
    // Load profiles from localStorage
    const stored = localStorage.getItem('rosterra_profiles')
    if (stored) {
      setProfiles(JSON.parse(stored))
    }
  }, [])

  const loadRoasterProfilesFromBackend = async () => {
    try {
      setIsLoadingRoasters(true)
      const token = localStorage.getItem('token')
      
      if (token) {
        const roasters = await roasterAPI.getAll()
        setRoasterProfiles(roasters)
        localStorage.setItem('rosterra_roaster_profiles', JSON.stringify(roasters))
      } else {
        // Load from localStorage if not authenticated
        const storedRoasters = localStorage.getItem('rosterra_roaster_profiles')
        if (storedRoasters) {
          setRoasterProfiles(JSON.parse(storedRoasters))
        }
      }
    } catch (error) {
      console.error('Error loading roaster profiles:', error)
      // Fallback to localStorage
      const storedRoasters = localStorage.getItem('rosterra_roaster_profiles')
      if (storedRoasters) {
        setRoasterProfiles(JSON.parse(storedRoasters))
      }
    } finally {
      setIsLoadingRoasters(false)
    }
  }

  const saveProfiles = (newProfiles) => {
    setProfiles(newProfiles)
    localStorage.setItem('rosterra_profiles', JSON.stringify(newProfiles))
  }

  const addProfiles = (newProfiles) => {
    const updated = [...profiles, ...newProfiles]
    saveProfiles(updated)
  }

  const updateProfile = (id, updatedData) => {
    const updated = profiles.map(p => 
      p.id === id ? { ...p, ...updatedData } : p
    )
    saveProfiles(updated)
  }

  const deleteProfile = (id) => {
    const updated = profiles.filter(p => p.id !== id)
    saveProfiles(updated)
    setSelectedProfiles(prev => prev.filter(pid => pid !== id))
  }

  const deleteProfiles = (ids) => {
    const updated = profiles.filter(p => !ids.includes(p.id))
    saveProfiles(updated)
    setSelectedProfiles(prev => prev.filter(pid => !ids.includes(pid)))
  }

  const toggleSelectProfile = (id) => {
    setSelectedProfiles(prev => 
      prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedProfiles(profiles.map(p => p.id))
  }

  const deselectAll = () => {
    setSelectedProfiles([])
  }

  const clearProfiles = () => {
    setProfiles([])
    setSelectedProfiles([])
    localStorage.removeItem('rosterra_profiles')
  }

  const saveRoasterProfiles = (newRoasterProfiles) => {
    setRoasterProfiles(newRoasterProfiles)
    localStorage.setItem('rosterra_roaster_profiles', JSON.stringify(newRoasterProfiles))
  }

  const addRoasterProfiles = (newRoasterProfiles) => {
    const updated = [...roasterProfiles, ...newRoasterProfiles]
    saveRoasterProfiles(updated)
  }

  const clearRoasterProfiles = () => {
    setRoasterProfiles([])
    localStorage.removeItem('rosterra_roaster_profiles')
  }

  return (
    <DataContext.Provider value={{
      profiles,
      selectedProfiles,
      roasterProfiles,
      isLoadingRoasters,
      addProfiles,
      updateProfile,
      deleteProfile,
      deleteProfiles,
      toggleSelectProfile,
      selectAll,
      deselectAll,
      clearProfiles,
      setProfiles: saveProfiles,
      addRoasterProfiles,
      clearRoasterProfiles,
      setRoasterProfiles: saveRoasterProfiles,
      loadRoasterProfilesFromBackend
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}
