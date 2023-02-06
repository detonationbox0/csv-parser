/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 * 
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const {contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('api', {
  getJson: async (csvPath) => ipcRenderer.invoke("getJson", csvPath),
  parseCSV: async (csvPath, method) => ipcRenderer.invoke("parseCSV", csvPath, method),
});
