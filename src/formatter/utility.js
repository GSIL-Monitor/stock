import * as TYPE from './config/stock-type-config.js'
import {
    DEFAULT,
    RED,
    GREEN,
} from './config/color-config.js'

/**
 * @description 判断类型，总是返回一个有效的、全小写字符串
 * @return {string}
 */
export const toType = obj => {
    return Object.prototype.toString
        .call(obj)
        .split(' ')[1]
        .slice(0, -1)
        .toLowerCase()
}

/**
 * @description 判断是否是数字(包含字符串数字)
 * @return {boolean}
 */
export const isNumber = obj => {
    const type = toType(obj)

    return ['number', 'string'].includes(type) && !isNaN(obj - parseFloat(obj))
}

/**
 * @description 获取股票对应类型 B股将会返回 上海B股或深圳B股
*/
export const stockToType = (source, symbol_type) => {
    const type = String(symbol_type)
    if (['sh', 'sz', 'csi', 'BK'].includes(source)) {
        // 大陆品种
        if (Object.is(type, '1')) { return TYPE.ASTOCK }
        else if (Object.is(type, '2')) { return TYPE.INDEX }
        else if (Object.is(type, '3')) { return TYPE.FUND }
        else if (Object.is(type, '4')) { return TYPE.BOND }
        else if (Object.is(type, '5')) {
            if (Object.is(source, 'sh')) { return TYPE.SHBSTOCK }
            else if (Object.is(source, 'sz')) { return TYPE.SZBSTOCK }
        }
    } else if (Object.is(source, 'hk')) {
        // 港股
        if (Object.is(type, '1')) { return TYPE.HKSTOCK }
        else if (Object.is(type, '2')) { return TYPE.HKINDEX }
        else if (Object.is(type, '3')) { return TYPE.HKFUND }
        else if (Object.is(type, '4')) { return TYPE.HKBOND }
        else if (Object.is(type, '5')) { return TYPE.HKWARRANT }
        else if (Object.is(type, '6')) { return TYPE.HKCBBC }
    } else if (/qh_/.test(source)) {
        // 期货
        return TYPE.FUTURES
    }
}

/**
 * @description 获取该类型股票部分字段需要保留位数
 * @param {string} type
 */
export const getRetainBits = type => {
    if ([TYPE.ASTOCK, TYPE.INDEX, TYPE.SZBSTOCK, TYPE.HKINDEX].includes(type)) {
        return 2
    } else if ([TYPE.SHBSTOCK, TYPE.FUND, TYPE.BOND, TYPE.HKSTOCK, TYPE.HKFUND, TYPE.HKBOND, TYPE.HKWARRANT, TYPE.HKCBBC].includes(type)) {
        return 3
    } else if ([TYPE.FUTURES].includes(type)) {
        // 期货无固定位数
        return void 0
    } else {
        // 默认为两位
        return 2
    }
}

export const isClearCase = (value, list) => {
    if (!isNumber(value)) {
        return true
    } else if (
        Reflect.has(list, 'stock_type') &&
        isNumber(Reflect.get(list, 'stock_type')) &&
        String(Reflect.get(list, 'stock_type')) !== '1'
    ) {
        return true
    } else if (
        Reflect.has(list, 'mark') &&
        String(Reflect.get(list, 'mark')) === '1'
    ) {
        return true
    } else {
        return false
    }
}

export const getColor = (price_change, number = 2) => {
    if (!isNumber(price_change)) {
        return DEFAULT
    } else {
        price_change = Number(price_change).toFixed(number)
        return price_change > 0 ? RED :
               price_change < 0 ? GREEN :
                                  DEFAULT
    }
}

export const formatNum = (val, num = 2) => {
    return (Number(val).toFixed(num) || '--')
}

/**
 * @description 金融字段处理
 * @param {number} num
 * @param {boolean} isInteger
 * @return {string}
 */
export const formatFigure = (num, isInteger) => {
    if (isNumber(num) && Number(num) !== 0) {
        return formatNumber(num, isInteger)
    } else {
        return '--'
    }
}

/**
 * @description 获取清空数据
*/
export const getClearVal = () => {
    return {
        val: '--',
        color: DEFAULT,
    }
}

/**
 * @description 金融字段处理
 * @param {number} num
 * @param {boolean} isInteger
 * @return {string}
 */
export const formatNumber = (num, isInteger) => {
    const BASE_NUM = 10;
    const THOUSAND_HUNDRED_MILLION = Math.pow(BASE_NUM, 11); // 1000亿
    const TEN_BILLION = Math.pow(BASE_NUM, 10); // 100亿
    const ONE_HUNDRED_BILLION = Math.pow(BASE_NUM, 8); // 1亿
    const BILLION_1000 = Math.pow(BASE_NUM, 7); // 1000万
    const MILLION = Math.pow(BASE_NUM, 6); // 100万
    const HUNDRED_THOUSAND = Math.pow(BASE_NUM, 5); // 10万
    const TEN_THOUSAND = Math.pow(BASE_NUM, 4); // 1万
    const THOUSAND = Math.pow(BASE_NUM, 3); // 1千
    num = Number(num)
    let abs_num = Math.abs(num);

    if (abs_num >= THOUSAND_HUNDRED_MILLION) {
        return (num / ONE_HUNDRED_BILLION).toFixed(0) + "亿";
    } else if (abs_num >= TEN_BILLION) {
        return (num / ONE_HUNDRED_BILLION).toFixed(1) + "亿";
    } else if (abs_num >= ONE_HUNDRED_BILLION) {
        return (num / ONE_HUNDRED_BILLION).toFixed(2) + "亿";
    } else if (abs_num >= BILLION_1000) {
        return (num / TEN_THOUSAND).toFixed(0) + "万";
    } else if (abs_num >= MILLION) {
        return (num / TEN_THOUSAND).toFixed(1) + "万";
    } else if (abs_num >= HUNDRED_THOUSAND) {
        return (num / TEN_THOUSAND).toFixed(2) + "万";
    } else if (abs_num >= THOUSAND) {
        return num.toFixed(0);
    } else {
        // 小于1000
        if (isInteger) {
            // 整数
            return num.toFixed(0);
        } else {
            // 浮点型
            if (abs_num < 100) {
                return num.toFixed(2);
            } else if (num < THOUSAND) {
                return num.toFixed(1);
            }
        }
    }
}
