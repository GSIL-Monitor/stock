import QWebChannel from './module/qwebchannel'

let stack = []

const callStack = function() {
    let args
    while ((args = stack.shift())) {
        result.apply(null, args)
    }
    stack = null
}

if (typeof qt !== 'undefined') {
    // 新版本 mac
    new QWebChannel(qt.webChannelTransport, function(channel) {
        window.top.webMsg = channel.objects.webMsg
        callStack()
    })
}

// exexute Qt method
const executeQt = function(methodName, ...args) {
    if (typeof qt !== 'undefined' && !window.top.webMsg) {
        stack.push(arguments)
        return
    }
    const func = window.top[methodName] || window.top.webMsg[methodName]
    if (func) {
        func.apply(null, args)
    } else {
        console.warn('Qt function not found: %s', methodName)
    }
}

const openBrowser = url => {
    executeQt('OpenUrlOnBrowser', url)
}

const downloadFile = (url, title, method) => {
    executeQt('DownloadFile', url, title, method)
}

const sendEvent = (webIds, event, params, isOpen) => {
    executeQt('SendEvent', webIds, event, params, isOpen)
}

const appendTab = (id, paramsObj, hash) => {
    executeQt('OpenWebView', id, paramsObj, hash)
}

const openNewWin = function(params) {
    executeQt('OpenPopWindow', params)
}

const relogin = function() {
    executeQt('Relogin')
}

const pushData = function(id, params) {
    executeQt('SubscriptionMarketData', id, params)
}

const UnSubscriptSockets = function(id) {
    executeQt('UnSubscriptionMarketDate', id)
}

const JsToQtEventInterface = function(params) {
    executeQt('JsToQtEventInterface', params)
}

const SetHomeUrlFlag = function(init) {
    executeQt('SetHomeUrlFlag', init)
}

const hashChange = function(moduleId) {
    executeQt('SendHashChange', moduleId)
}

const sendUpdate = function(moduleId) {
    executeQt('SendUpdateFirstLevelState', moduleId)
}

//发布事件
const SendWebNotify = function(tabId, jsonString) {
    executeQt('SendWebNotify', tabId, jsonString)
}

export {
    openBrowser,
    downloadFile,
    sendEvent,
    appendTab,
    openNewWin,
    relogin,
    pushData,
    UnSubscriptSockets,
    JsToQtEventInterface,
    SetHomeUrlFlag,
    hashChange,
    sendUpdate,
    SendWebNotify,
}
