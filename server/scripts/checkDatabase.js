import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rosterra')
    console.log('✅ Connected to MongoDB\n')

    // Count total users
    const totalUsers = await User.countDocuments()
    console.log(`📊 Total users in database: ${totalUsers}\n`)

    if (totalUsers === 0) {
      console.log('⚠️  No users found in database!')
      console.log('\nCreating default admin user...\n')
      
      // Create default admin
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@rosterra.com',
        password: 'admin123', // Will be hashed by the model
        role: 'admin',
        status: 'approved'
      })
      
      console.log('✅ Default admin created!')
      console.log(`   Email: admin@rosterra.com`)
      console.log(`   Password: admin123`)
      console.log(`   Role: admin`)
      console.log(`   Status: approved\n`)
    } else {
      // Show all users
      const users = await User.find({}, 'name email role status createdAt')
      console.log('📋 Current users:')
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name}`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Role: ${user.role}`)
        console.log(`   Status: ${user.status}`)
        console.log(`   Created: ${user.createdAt.toLocaleDateString()}`)
      })
      
      // Count by status
      const approved = await User.countDocuments({ status: 'approved' })
      const pending = await User.countDocuments({ status: 'pending' })
      const rejected = await User.countDocuments({ status: 'rejected' })
      
      console.log(`\n📊 Status breakdown:`)
      console.log(`   ✅ Approved: ${approved}`)
      console.log(`   ⏳ Pending: ${pending}`)
      console.log(`   ❌ Rejected: ${rejected}`)
    }

    mongoose.connection.close()
    console.log('\n✅ Done!')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

checkDatabase()
