import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rosterra')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

// ✅ Fix __dirname for ES modules (Electron safe)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ✅ Routes folder path
const routesPath = path.join(__dirname, "routes")

async function loadRoutes() {
  if (!fs.existsSync(routesPath)) {
    console.error("❌ Routes folder not found:", routesPath)
    return
  }

  const files = fs.readdirSync(routesPath)

  for (const file of files) {
    if (file.endsWith(".js")) {
      try {
        const routeModule = await import(`./routes/${file}`)
        const routeName = file.replace(".js", "")

        if (!routeModule.default) {
          console.warn(`⚠️ Route ${file} has no default export`)
          continue
        }

        app.use(`/api/${routeName}`, routeModule.default)
        console.log(`✅ Loaded route: /api/${routeName}`)
      } catch (err) {
        console.error(`❌ Failed loading route ${file}`, err)
      }
    }
  }
}

// ✅ Start server ONLY after routes are loaded
const PORT = process.env.PORT || 5000

loadRoutes().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
})
