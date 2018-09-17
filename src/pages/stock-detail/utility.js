import {
    getCookie,
} from '@c/utils/util'
import {
    sendEvent,
} from '@c/utils/callQt'

// 截取新闻信息
export const subDate = (date) => {
    return date.substr(0, 11)
}

// 是否为实时行情
export const isHkRealTime = () => {
    let hk_now = getCookie('hk_now')

    return Object.is(String(hk_now), '1')
}

/**
 * 格式化日期
*/
export const formatDate = (date, format) => {
    const o = {
        "M+": date.getMonth() + 1, //month
        "d+": date.getDate(), //day
        "h+": date.getHours(), //hour
        "m+": date.getMinutes(), //minute
        "s+": date.getSeconds(), //second
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
        "S": date.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) {
        format = format
                    .replace(RegExp.$1, (date.getFullYear() + "")
                    .substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }

    return format
}

/**
 * @description 获取某个时间点的时间戳
 * @param {number} day 默认当天
 * @return {number}
*/
export const getTimeStamp = (day = 0, hour = 0, minute = 0, second = 0) => {
    let nowDayHourStamp = new Date(new Date().setHours(hour, minute, second, 0))
    // 一天 86400 秒
    const ONE_DAY_MILLISECOND = 86400 * 1000

    return nowDayHourStamp - ONE_DAY_MILLISECOND * day
}

/**
 * @description 自选股状态同步到其他模块
*/
export const syncMyStockState = () => {
    const MODULE_ARR = ['mystocks', 'home', 'dataCenter', 'intelligence']
    const EVENT_NAME = 'changeMystock'
    MODULE_ARR.forEach(((element) => {
        sendEvent(element, EVENT_NAME, JSON.stringify({}), false)
    }))
}
