import {
    getToken,
    getUrlDomain,
} from '@c/utils/util.js'
import {
    openNewWin,
} from '@c/utils/callQt.js'

const openBuyPrice = () => {
    let url,
        params,
        winWidth = 650,
        winHeight = 473,
        text = '确定性评分报告'
    let baseUrl = getUrlDomain()
    let token = getToken()
    url = `${baseUrl}/html/buyRights.html
        ?token=${token}&winWidth=${winWidth}
        &winHeight=${winHeight}&text=${text}`

    params = {
        width: winWidth,
        height: winHeight,
        minWidth: winWidth,
        minHeight: winHeight,
        url,
        title: '系统提示',
        top: 100,
        left: 200,
        resizeable: false,
    }

    openNewWin(params)
}


export default openBuyPrice
