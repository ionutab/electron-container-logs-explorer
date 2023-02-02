const { exec, spawn } = require('child_process')
const log = require('electron-log');

// Add a method to run a shell command.
function runExec(command, callback) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`)
            return
        }
        console.log(`stdout: ${stdout}`)
        callback(stdout)
    })
}

// Add a method to run a shell command.
function runSpawn(command, args, callback) {

    console.log(`running ${command} ${args.join(' ')}`)
    let output = '';
    const child = spawn(command, args, {});
    
    child.stdout.on('data', data => {
        console.log(`stdout: ${data}`)
        output = output.concat(data);
    })
    child.on('error', (error) => {
        console.error(`error: ${error.message}`);
    })
    child.on('close', code => {
        console.log(`stdout close: ${code}`)
        console.log(`stdout close output: ${output}`)
        callback(output);
    })
}

module.exports = { runExec, runSpawn }