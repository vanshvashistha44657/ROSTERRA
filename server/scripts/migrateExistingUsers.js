import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

async function migrateExistingUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rosterra')
    console.log('✅ Connected to MongoDB')

    // Update all existing users to approved status
    const result = await User.updateMany(
      { status: { $exists: false } }, // Users without status field
      { $set: { status: 'approved' } }
    )

    console.log(`✅ Updated ${result.modifiedCount} existing users to approved status`)

    // Also update any pending users to approved (for immediate fix)
    const pendingResult = await User.updateMany(
      { status: 'pending' },
      { $set: { status: 'approved' } }
    )

    console.log(`✅ Updated ${pendingResult.modifiedCount} pending users to approved status`)

    // Show all users and their status
    const allUsers = await User.find({}, 'name email role status')
    console.log('\n📋 Current users:')
    allUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - ${user.role} - ${user.status}`)
    })

    mongoose.connection.close()
    console.log('\n✅ Migration complete! All existing users can now login.')
  } catch (error) {
    console.error('❌ Migration error:', error)
    process.exit(1)
  }
}

migrateExistingUsers()
