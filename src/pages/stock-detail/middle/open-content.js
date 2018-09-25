import {
    getUrlDomain,
    getToken,
} from '@c/utils/util.js'
import {
    openNewWin,
} from '@c/utils/callQt.js'

const getOpenUrl = (openParams) => {
    let baseUrl = getUrlDomain()
    let token = getToken()
    let address = `${baseUrl}/html/window-openContent.html?openParams=${openParams}&token=${token}`

    return address
}

const containerParam = (openParams, title) => {
    let clientWidth = document.body.clientWidth
    let clientHeight = document.body.clientHeight
    let _width = clientWidth - 100
    let _height = clientHeight - 100
    let width = _width < 1200 ? _width : 1000
    let height = _height < 980 ? _height : 620
    let top = clientHeight / 2 - height / 2
    let left = clientWidth / 2 - width / 2
    let url = getOpenUrl(openParams)

    return {
        width,
        height,
        url,
        title,
        top,
        left,
        newsList: true,
        resizeable: true,
        minimumVisible: true,
    }
}

const openContent = (openParams, title) => {
    let param = containerParam(openParams, title)

    openNewWin(param)
}

export default openContent
