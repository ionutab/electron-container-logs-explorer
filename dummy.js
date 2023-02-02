const { exec, spawn } = require('child_process')

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
    const child = spawn(command, args);

    child.stdout.on('data', data => {
        console.log(`stdout: ${data}`)
        output = output.concat(data);
    })
    child.on('error', (error) => {
        console.error(`error: ${error.message}`);
    })
    child.on('close', code => {
        console.log(`stdout close: ${code}`)
        callback(output);
    })
}

function doStuff(stuff) {
    console.log('DOING STUFF IN THE CALLBACK')
}

runSpawn('docker', ['ps'], doStuff);
console.log('')
console.log('')
console.log('')
console.log('')
runSpawn('docker', ['ps', '-a', '--format', '"table {{.ID}}\t{{.Image}}\t{{.Names}}\t{{.Ports}}"'], doStuff);
