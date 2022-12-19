// preload.js
const {
    contextBridge,
    ipcRenderer
} = require("electron");

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

/**
 * HERE YOU WILL EXPOSE YOUR 'listContainers' FROM main.js
 * TO THE FRONTEND.
 * (remember in main.js, you're putting preload.js
 * in the electron window? your frontend js will be able
 * to access this stuff as a result.
 */
contextBridge.exposeInMainWorld(
    "api", {
    invoke: (channel, data) => {
        let validChannels = ['listContainers', 'listContainerLogs']; // list of ipcMain.handle channels you want access in frontend to
        if (validChannels.includes(channel)) {
            // ipcRenderer.invoke accesses ipcMain.handle channels like 'listContainers'
            // make sure to include this return statement or you won't get your Promise back
            return ipcRenderer.invoke(channel, data);
        }
    },
}
);