// Load electron
const { ipcRenderer } = require('electron');

ipcRenderer.on('selector', (event, info) => {
    ipcRenderer.sendToHost(document.querySelector(info).innerText);
});