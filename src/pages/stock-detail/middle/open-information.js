import openContent from './open-content.js'

export const openNews = (pageParam = {}, titleName = '资讯') => {
    const param = Object.assign({
        dataType: 'news',
        windowHeight: document.body.clientWidth,
        windowWidth: document.body.clientHeight,
        path: 'G3_08_10',
    }, pageParam)

    openContent(JSON.stringify(param), titleName)
}

export const openNotice = (pageParam = {}, titleName = '公告') => {
    const param = Object.assign({
        dataType: 'notice',
        windowHeight: document.body.clientWidth,
        windowWidth: document.body.clientHeight,
        path: 'G3_08_11',
    }, pageParam)

    openContent(JSON.stringify(param), titleName)
}

export const openReport = (pageParam = {}, titleName = '研报') => {
    const param = Object.assign({
        dataType: 'research',
        windowHeight: document.body.clientWidth,
        windowWidth: document.body.clientHeight,
        path: 'G3_08_12',
    }, pageParam)

    openContent(JSON.stringify(param), titleName)
}

export const openInvestment = (pageParam = {}, titleName = '投资问答') => {
    const param = Object.assign({
        dataType: 'answer',
        windowHeight: document.body.clientWidth,
        windowWidth: document.body.clientHeight,
        path: 'G3_08_13',
    }, pageParam)
console.log(param)
    openContent(JSON.stringify(param), titleName)
}

export const openBigEvent = (pageParam = {}, titleName = '大事件') => {
    const param = Object.assign({
        dataType: 'events',
        windowHeight: document.body.clientWidth,
        windowWidth: document.body.clientHeight,
        path: 'G3_08_14',
    }, pageParam)

    openContent(JSON.stringify(param), titleName)
}
