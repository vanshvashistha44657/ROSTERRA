import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { userAPI } from '../utils/api'
import { UserPlus, Trash2, X, Check, XCircle, Bell, Clock } from 'lucide-react'

function Users() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [pendingCount, setPendingCount] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notification, setNotification] = useState({ message: '', type: '' })
  const [loading, setLoading] = useState(true)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff'
  })

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await userAPI.getAll()
      setUsers(data)
      
      // Count pending users
      const pending = data.filter(u => u.status === 'pending').length
      setPendingCount(pending)
      
      // Show notification if there are pending users
      if (pending > 0 && currentUser?.role === 'admin') {
        setShowNotification(true)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      showToast(error.message || 'Failed to load users', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    
    // Poll for new pending users every 30 seconds (for admin)
    if (currentUser?.role === 'admin') {
      const interval = setInterval(async () => {
        try {
          const { count } = await userAPI.getPendingCount()
          if (count > pendingCount) {
            setPendingCount(count)
            setShowNotification(true)
            fetchUsers()
          }
        } catch (error) {
          console.error('Error checking pending users:', error)
        }
      }, 30000)
      
      return () => clearInterval(interval)
    }
  }, [currentUser, pendingCount])

  const showToast = (message, type = 'success') => {
    setNotification({ message, type })
    const timer = setTimeout(() => {
      setNotification({ message: '', type: '' })
    }, 5000)
    return () => clearTimeout(timer)
  }

  const handleApprove = async (userId) => {
    try {
      await userAPI.approve(userId)
      showToast('User approved successfully!', 'success')
      fetchUsers()
    } catch (error) {
      console.error('Error approving user:', error)
      showToast(error.message || 'Failed to approve user', 'error')
    }
  }

  const handleReject = async (userId) => {
    if (confirm('Are you sure you want to reject this user?')) {
      try {
        await userAPI.reject(userId)
        showToast('User rejected', 'success')
        fetchUsers()
      } catch (error) {
        console.error('Error rejecting user:', error)
        showToast(error.message || 'Failed to reject user', 'error')
      }
    }
  }

  const handleDeleteUser = async (userId) => {
    if (userId === currentUser?._id) {
      showToast('You cannot delete your own account', 'error')
      return
    }

    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(userId)
        showToast('User deleted successfully!', 'success')
        fetchUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
        showToast(error.message || 'Failed to delete user', 'error')
      }
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-medium flex items-center gap-1">
            <Check className="w-3 h-3" />
            Approved
          </span>
        )
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg text-xs font-medium flex items-center gap-1 animate-pulse">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        )
      case 'rejected':
        return (
          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-medium flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification.message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Pending Users Notification */}
      {showNotification && pendingCount > 0 && currentUser?.role === 'admin' && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-l-4 border-yellow-500 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-yellow-600 dark:text-yellow-400 animate-bounce" />
            <div>
              <h3 className="text-yellow-900 dark:text-yellow-100 font-semibold">
                {pendingCount} {pendingCount === 1 ? 'User' : 'Users'} Awaiting Approval
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                New signup{pendingCount > 1 ? 's' : ''} require your attention
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNotification(false)}
            className="p-1 hover:bg-yellow-200 dark:hover:bg-yellow-800 rounded transition-colors"
          >
            <X className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Users Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage user accounts and permissions
            {pendingCount > 0 && currentUser?.role === 'admin' && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded text-xs font-medium">
                {pendingCount} pending
              </span>
            )}
          </p>
        </div>
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all flex items-center space-x-2 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 font-medium"
          >
            <UserPlus className="w-5 h-5" />
            <span>Create Admin</span>
          </button>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Create New User</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Created</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr 
                    key={user._id} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      user.status === 'pending' ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                      {user._id === currentUser?._id && (
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(You)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{user.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {currentUser?.role === 'admin' && user.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(user._id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors"
                              title="Approve User"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(user._id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                              title="Reject User"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {currentUser?.role === 'admin' && user._id !== currentUser?._id && (
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Users
