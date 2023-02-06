// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

const fs = require('fs')
const Papa = require('papaparse')

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.handle('getJson', async (_event, csvPath) => {
    return new Promise (async (resolve, reject) => {
      const csvData = fs.readFileSync(csvPath, 'utf8');
      const csvToJson = Papa.parse(csvData);
      resolve(csvToJson);
      reject(new Error(`Failed to parse ${csvPath} using ${method}`));
    });

  });

  /**
   * Custom Scripts go in this handler
   * 
   * */
  ipcMain.handle('parseCSV', async (_event, csvPath, method) => {
    //#region

    let csv = "";

    const csvData = fs.readFileSync(csvPath, 'utf8');
    const csvToJson = Papa.parse(csvData);
    console.log(csvToJson);

    /**
     * CUSTOM CSV SCRIPTS
     */

    switch (method) {
      case "unstack":
          


        break;
    }

    return new Promise (async (resolve, reject) => {
        
        resolve(csv);
        reject(new Error(`Failed to parse ${csvPath} using ${method}`));
    });
    //#endregion
  });

    //#endregion

});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
