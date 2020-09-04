
const { app, shell, BrowserWindow, globalShortcut } = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900, 
    height: 680
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '/../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
  mainWindow.removeMenu();

  mainWindow.webContents.on("new-window", function(event, url) {
    event.preventDefault();
    shell.openExternal(url);
  });

  globalShortcut.register('f5', function() {
		console.log('f5 is pressed')
		mainWindow.reload();
	})
	globalShortcut.register('CommandOrControl+R', function() {
		console.log('CommandOrControl+R is pressed')
		mainWindow.reload();
  })
  globalShortcut.register('CommandOrControl+Shift+I', function() {
		console.log('CommandOrControl+Shift+I is pressed')
    if(isDev) {
      mainWindow.webContents.openDevTools();
    }
	})
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});