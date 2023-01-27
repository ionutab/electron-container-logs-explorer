// index.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron')
const path = require('path')
const { exec } = require('child_process')
const log = require('electron-log');

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
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

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

/** 
 * FUNCTION YOU WANT ACCESS TO ON THE FRONTEND
 */
ipcMain.handle('listContainers', async (event, arg) => {
    return new Promise(function (resolve, reject) {
        const myx = function(data){
            let split = parseContainerListCommandOutput(data)
            // remove the first and las item
            split = split.slice(1, -1)
            resolve(split);
        }
        const containerList = runCommand('docker ps -a --format "table {{.ID}}\t{{.Image}}\t{{.Names}}\t{{.Ports}}"', myx)
        // do stuff
        if (false) {
            reject("this didn't work!");
        }
    });
});



ipcMain.handle('listContainerLogs', async (event, args) => {
    const containerId = args[0]
    return new Promise(function (resolve, reject) {
        const commandOutputCallback = function(data){
            const split = parseContainerListCommandOutput(data)
            resolve(split);
        }
        const containerList = runCommand(`docker logs ${containerId}`, commandOutputCallback)
        // do stuff
        if (false) {
            reject("this didn't work!");
        }
    });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Add a method to run a shell command.
function runCommand(command, callback) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`)
            return
        }
        console.log(`stdout: ${stdout}`)
        callback(stdout)
    })
}

function parseContainerListCommandOutput(listContainersOutput){
    return listContainersOutput.split(/\r?\n/);
}