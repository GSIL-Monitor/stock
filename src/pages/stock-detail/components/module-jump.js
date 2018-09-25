import {
    getUrlDomain,
} from '@c/utils/util.js'
import {
    sendEvent,
} from '@c/utils/callQt.js'

export const skipF1 = (hash, moduleId) => {
    let baseUrl = getUrlDomain()
    let url = `${baseUrl}/html/timeShareDetail.html?stock_code=${hash}&id=${moduleId}`

    sendEvent('hidden', '', JSON.stringify({url}), true)
}

export const skipF10 = (hash, moduleId) => {
    let baseUrl = getUrlDomain()
    let url = `${baseUrl}/html/companyInfo.html?stock_code=${hash}&id=${moduleId}`

    sendEvent('hidden', '', JSON.stringify({url}), true)
}
