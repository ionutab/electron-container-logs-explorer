'use strict'

window.$ = window.jQuery = require('jquery')
window.Tether = require('tether')
window.Bootstrap = require('bootstrap')

const containersPage = document.getElementById('containers-page')
const containerTableBody = document.getElementById('containers-container-tbody')
const containerTableRowTemplate = document.getElementById('container-table-row')
const containersReloadTrigger = document.getElementById('containers-reload-trigger')
const containersViewTrigger = document.getElementById('containers-view-trigger')

const logsPage = document.getElementById('logs-page')
const logsBucket = document.getElementById('logs-bucket')

const setToContainersPage = function () {
    containersPage.style.display = 'block'
    logsPage.style.display = 'none'
}

const setToLogsPage = function () {
    containersPage.style.display = 'none'
    logsPage.style.display = 'block'
}

const loadContainers = function () {
    window.api.invoke('listContainers', [])
        .then(function (res) {
            console.log(res);
            replaceContainerList(res);
        })
        .catch(function (err) {
            console.error(err); // will print "This didn't work!" to the browser console.
        });
}

const loadContainerLogs = function (containerId) {
    window.api.invoke('listContainerLogs', [containerId])
        .then(function (res) {
            console.log(res);
            replaceContainerLogs(res);
        })
        .catch(function (err) {
            console.error(err); // will print "This didn't work!" to the browser console.
        })
}

containersReloadTrigger.addEventListener('click', e => {
    e.preventDefault()
    loadContainers()
})

containersViewTrigger.addEventListener('click', e => {
    e.preventDefault()
    setToContainersPage()
})

const replaceContainerLogs = function (res) {
    for (let i = 0; i < res.length; i++) {
        const logRow = document.createElement('p')
        logRow.appendChild(document.createTextNode(res[i]))
        logsBucket.appendChild(logRow)
    }
}

const replaceContainerList = function (res) {
    containerTableBody.innerHTML = ''

    for (let i = 0; i < res.length; i++) {
        const element = res[i];
        const rowData = element.split(/\s+/)
        const _tr = document.createElement('tr')
        for (var j = 0; j < rowData.length; j++) {
            const rowElement = rowData[j]
            const _td = document.createElement('td')

            if (j === 0) {
                const containerIdLink = document.createElement('a')
                containerIdLink.appendChild(document.createTextNode(rowElement))
                containerIdLink.setAttribute('href', '#')
                containerIdLink.setAttribute('data-container-id', rowElement)
                containerIdLink.addEventListener('click', e => {
                    e.preventDefault()
                    setToLogsPage()
                    loadContainerLogs(rowElement)
                })
                _td.appendChild(containerIdLink)
            } else {
                const _text = document.createTextNode(rowElement)
                _td.appendChild(_text)
            }
            _tr.appendChild(_td)
        }
        containerTableBody.appendChild(_tr)
    }
}

loadContainers();
setToContainersPage();