
const containerList = document.getElementById('containers-container')

window.api.invoke('listContainers', [])
    .then(function (res) {
        console.log(res);
        containerList.append(res);
    })
    .catch(function (err) {
        console.error(err); // will print "This didn't work!" to the browser console.
    });
