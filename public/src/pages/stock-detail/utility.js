import {
    getCookie,
} from '@c/utils/util'

// 截取新闻信息
export const subDate = (date) => {
    return date.substr(0, 11)
}

// 港股是否为实时行情
export const isHkRealTime = () => {
    let hk_now = getCookie('hk_now')

    return Object.is(String(hk_now), '1')
}
