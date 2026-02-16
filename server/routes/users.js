import express from 'express'
import User from '../models/User.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

// Get all users (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get pending users count (admin only)
router.get('/pending/count', requireAdmin, async (req, res) => {
  try {
    const count = await User.countDocuments({ status: 'pending' })
    res.json({ count })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get pending users (admin only)
router.get('/pending', requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' }).sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Approve user (admin only)
router.put('/:id/approve', requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    )
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json({ 
      success: true, 
      message: 'User approved successfully',
      user: user.toJSON() 
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Reject user (admin only)
router.put('/:id/reject', requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    )
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json({ 
      success: true, 
      message: 'User rejected',
      user: user.toJSON() 
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete user (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json({ 
      success: true, 
      message: 'User deleted successfully' 
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
