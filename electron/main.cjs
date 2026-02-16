const { app, BrowserWindow } = require("electron")
const path = require("path")

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
    },
  })

  if (app.isPackaged) {
    const indexPath = path.join(
      __dirname,
      "../frontend/dist/index.html"
    )
    mainWindow.loadURL(`file://${indexPath}`)
  } else {
    mainWindow.loadURL("http://localhost:5173")
    mainWindow.webContents.openDevTools()
  }
}

app.whenReady().then(() => {
  // ✅ START BACKEND SAFELY
  require("../server/server.js")

  createWindow()
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})
