import { useState } from 'react'
import MetricCard from '../components/MetricCard'
import RevenueChart from '../components/RevenueChart'
import RecentActivity from '../components/RecentActivity'
import TopProducts from '../components/TopProducts'
import ManualDataEntryModal from '../components/ManualDataEntryModal'
import { useData } from '../context/DataContext'
import { roasterAPI } from '../utils/api'
import { 
  DollarSign, 
  Users, 
  ShoppingCart, 
  TrendingUp,
  Plus 
} from 'lucide-react'

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })
  const { addRoasterProfiles } = useData()
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' })
    }, 5000)
  }

  const handleManualDataSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token')
      
      if (token) {
        // User is logged in - save to backend database
        try {
          const savedData = await roasterAPI.create(data)
          
          // Also update local context
          addRoasterProfiles([savedData])
          
          showNotification('Data entry saved successfully to database!', 'success')
        } catch (apiError) {
          console.error('API Error:', apiError)
          // Fallback to local storage if API fails
          const localData = {
            id: Date.now().toString(),
            ...data,
            createdAt: new Date().toISOString()
          }
          addRoasterProfiles([localData])
          showNotification('Data saved locally (database unavailable)', 'success')
        }
      } else {
        // Not logged in - save locally only
        const localData = {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date().toISOString()
        }
        addRoasterProfiles([localData])
        showNotification('Data saved locally! Login to save to database.', 'success')
      }
    } catch (error) {
      console.error('Error saving manual data:', error)
      showNotification(error.message || 'Failed to save data entry', 'error')
      throw error
    }
  }

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Users',
      value: '2,350',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-purple-500',
    },
    {
      title: 'Growth Rate',
      value: '24.3%',
      change: '+4.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus size={20} />
          Add Manual Entry
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProducts />
      </div>

      {/* Manual Data Entry Modal */}
      <ManualDataEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleManualDataSubmit}
      />
    </div>
  )
}

export default Dashboard
