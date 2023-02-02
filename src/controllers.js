

// Modules to control application life and create native browser window
const { ipcMain } = require('electron')
const commandRunner = require('./commandRunner')

/** 
 * FUNCTION YOU WANT ACCESS TO ON THE FRONTEND
 */
function registerHandlers(){
    ipcMain.handle('listContainers', async (event, arg) => {
        return new Promise(function (resolve, reject) {
            const listContainersCallback = function (data) {
                let split = parseContainerListCommandOutput(data)
                // remove the first and las item
                split = split.slice(1, -1)
                resolve(split);
            }
            const containerList = commandRunner.runSpawn('docker', ['ps', '-a', '--format', 'table {{.ID}}\t{{.Image}}\t{{.Names}}\t{{.Ports}}'], listContainersCallback)
            // do stuff
            if (false) {
                reject("this didn't work!");
            }
        });
    });

    ipcMain.handle('listContainerLogs', async (event, args) => {
        const containerId = args[0]
        return new Promise(function (resolve, reject) {
            const listContainerLogsCallback = function (data) {
                const split = parseContainerListCommandOutput(data)
                resolve(split);
            }
            const containerList = commandRunner.runSpawn('docker', ['logs', containerId], listContainerLogsCallback)
            // do stuff
            if (false) {
                reject("this didn't work!");
            }
        });
    });
}

module.exports = { registerHandlers }

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function parseContainerListCommandOutput(listContainersOutput) {
    return listContainersOutput.split(/\r?\n/);
}