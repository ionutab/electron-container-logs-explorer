
const containerList = document.getElementById('containers-container')
const reloadButton = document.getElementById('containers-reload-trigger')

const loadContainers = function(){
    window.api.invoke('listContainers', [])
    .then(function (res) {
        console.log(res);
        replaceContainerList(res);
    })
    .catch(function (err) {
        console.error(err); // will print "This didn't work!" to the browser console.
    });
}

reloadButton.addEventListener('click', e => {
    e.preventDefault();
    loadContainers();
})

const replaceContainerList = function (res) {
    
    const _table = document.createElement('table')
    const _tbody = document.createElement('tbody')

    for (var i = 0; i < res.length; i++) {
        const element = res[i];
        const rowData = element.split(/\t/)
        const _tr = document.createElement('tr')
        for(var j = 0; j < rowData.length; j++){
            const rowElement = rowData[j]
            const _td = document.createElement('td')
            const _text = document.createTextNode(rowElement)
            _td.appendChild(_text)
            _tr.appendChild(_td)
        }
        _tbody.appendChild(_tr)
    }
    _table.appendChild(_tbody);
    containerList.innerHTML = _table.outerHTML
}

loadContainers();