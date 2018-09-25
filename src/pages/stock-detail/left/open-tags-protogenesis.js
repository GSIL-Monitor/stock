import {
    openNewWin,
} from '@c/utils/callQt.js'
import {
    getUrlDomain,
    getToken,
} from '@c/utils/util.js'

// --- 打开原生弹窗
export const popProtogenesis = (param, config) => {
    openDetailPage(param, config)
}

// --- 打开公司荣誉
export const openCompanyHonor = (param) => {
    const config = {
        openHtml: 'publicPage/popCompanyHonor.html',
        width: 374,
        height: 293,
    }

    openDetailPage(param, config)
}

// --- 所属板块
export const openBelongPlate = (param) => {
    const config = {
        title: "所属板块",
        openHtml: "publicPage/popBelongPlate.html",
        width: 330,
        height: 401,
    }

    openDetailPage(param, config);
}

// --- 季度胜率
export const openSeasonRate = (param, season) => {
    const config = {
        openHtml: "publicPage/popQuarterWinRate.html",
        width: 346,
        height: 120,
    }
    param.season = season

    openDetailPage(param, config)
}

// --- 公司业绩鉴定 (历史、最新季)
export const openPerformanceAppraisal = (param, title, season) => {
    const config = {
        openHtml: "publicPage/popPerformanceAppraisal.html",
        title: title,
        season: season,
        width: 422,
        height: 168
    }

    param.season = season
    openDetailPage(param, config)
}

// -- 行业业绩鉴定 (历史、最新季)
export const openIndustryPerformanceAppraisal = (param, season) => {
    const config = {
        openHtml: "publicPage/popIndustryPerformanceEval.html",
        season: season,
        width: 422,
        height: 168,
    }

    param.season = season
    openDetailPage(param, config)
}

const getTopAndLeft = (width, height) => {
    let offsetTop = document.body.clientHeight / 2 - height / 2,
        offsetLeft = document.body.clientWidth / 2 - width / 2

    if (offsetTop && offsetTop < 100) {
        offsetTop = 100
    }

    offsetLeft = Math.ceil(offsetLeft)
    offsetTop = Math.ceil(offsetTop)

    return {
        top: offsetTop,
        left: offsetLeft,
    }
}

const openDetailPage = (params, config) => {
    let baseUrl = getUrlDomain(),
        token = getToken(),
        winParam,
        winWidth = config.width || 200,
        winHeight = config.height || 150,
        toStr = Object.prototype.toString,
        url = `${baseUrl}/html/${config.openHtml}?token=${token}&winWidth=${winWidth}&winHeight=${winHeight}`

    let topLeft = getTopAndLeft(winWidth, winHeight);

    if (Object.is(params.field, 'sunScore') ) {
        url += '&openParams=' + JSON.stringify(params);
    } else {
        url += '&params=' + JSON.stringify(params);
    }

    winParam = {
        width: winWidth,
        height: winHeight,
        minWidth: winWidth,
        minHeight: winHeight,
        url,
        top: topLeft.top,
        left: topLeft.left,
        resizeable: false
    }
    if (toStr.call(config) === "[object Object]") {
        Object.assign(winParam, config)
    }

    openNewWin(winParam)
}
