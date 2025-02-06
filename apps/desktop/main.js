const { app, BrowserWindow } = require("electron")
const path = require("path")

function createWindow() {
  const win = new BrowserWindow({
    width: 1024, // Customowa szerokość okna
    height: 768, // Customowa wysokość okna
    frame: false, // Okno bez standardowej ramki (umożliwia customowy wygląd)
    transparent: true, // Umożliwia efekt przezroczystości, przydatny przy zaokrąglonych rogach
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Jeśli używasz preload scriptu, dostosuj według potrzeb
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  // W trybie developmentu ładujemy lokalny serwer na porcie 3000

  win.loadURL("http://localhost:3000")

  // Opcja 2 (alternatywna): Ładowanie zdalnej domeny
  // win.loadURL('https://twojadomena.com');
}

app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    // Na macOS, gdy klikniesz ikonę aplikacji, a okien nie ma – utwórz nowe
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on("window-all-closed", () => {
  // Zamknij aplikację na Windows/Linux, a na macOS zwykle pozostaje aktywna
  if (process.platform !== "darwin") app.quit()
})
