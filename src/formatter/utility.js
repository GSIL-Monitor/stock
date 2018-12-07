import {
    ASTOCK,
    SHBSTOCK,
    SZBSTOCK,
    FUND,
    BOND,
    INDEX,
    HKSTOCK,
    HKFUND,
    HKBOND,
    HKWARRANT,
    HKCBBC,
    HKINDEX,
    FUTURES,
} from './config/stock-type-config.js'
import {
    RED,
    GREEN,
    DEFAULT,
} from './config/color-config.js'

/**
 * @description 判断类型，返回一个有效的、全小写字符串
 * @return { string }
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
 * @return { boolean }
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
        if (Object.is(type, '1')) { return ASTOCK }
        else if (Object.is(type, '2')) { return INDEX }
        else if (Object.is(type, '3')) { return FUND }
        else if (Object.is(type, '4')) { return BOND }
        else if (Object.is(type, '5')) {
            if (Object.is(source, 'sh')) { return SHBSTOCK }
            else if (Object.is(source, 'sz')) { return SZBSTOCK }
        }
    } else if (Object.is(source, 'hk')) {
        // 港股
        if (Object.is(type, '1')) { return HKSTOCK }
        else if (Object.is(type, '2')) { return HKINDEX }
        else if (Object.is(type, '3')) { return HKFUND }
        else if (Object.is(type, '4')) { return HKBOND }
        else if (Object.is(type, '5')) { return HKWARRANT }
        else if (Object.is(type, '6')) { return HKCBBC }
    } else if (/qh_/.test(source)) {
        // 期货
        return FUTURES
    }
}

/**
 * @description 获取该类型股票部分字段需要保留位数
 * @param { string } type
 */
export const getRetainBits = type => {
    if ([ASTOCK, INDEX, SZBSTOCK, HKINDEX].includes(type)) {
        return 2
    } else if ([SHBSTOCK, FUND, BOND, HKSTOCK, HKFUND, HKBOND, HKWARRANT, HKCBBC].includes(type)) {
        return 3
    } else if ([FUTURES].includes(type)) {
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
        !['1', '3'].includes(String(Reflect.get(list, 'stock_type')))
        // String(Reflect.get(list, 'stock_type')) !== '1'
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
 * @description 获取清空数据
*/
export const getClearVal = () => {
    return {
        val: '--',
        color: DEFAULT,
    }
}

/**
 * @description 金融字段处理(包含异常处理)
 * @param { number } num
 * @param { boolean } isInteger
 * @return { string }
 */
export const formatFigure = (num, isInteger) => {
    if (isNumber(num) && Number(num) !== 0) {
        return formatNumber(num, isInteger)
    } else {
        return '--'
    }
}

/**
 * @description 金融字段处理(正常数字)
 * @param { number } num 第一个参数
 * @param { boolean } isInteger 第二个参数
 * @return { string }
 */
export const formatNumber = (...args) => {
    // 金融字段区间
    const financialRange = () => {
        const BASE_NUM = 10
        const THOUSAND_HUNDRED_MILLION = Math.pow(BASE_NUM, 11) // 1000亿
        const TEN_BILLION = Math.pow(BASE_NUM, 10) // 100亿
        const ONE_HUNDRED_BILLION = Math.pow(BASE_NUM, 8); // 1亿
        const BILLION_1000 = Math.pow(BASE_NUM, 7) // 1000万
        const MILLION = Math.pow(BASE_NUM, 6) // 100万
        const HUNDRED_THOUSAND = Math.pow(BASE_NUM, 5) // 10万
        const TEN_THOUSAND = Math.pow(BASE_NUM, 4) // 1万
        const THOUSAND = Math.pow(BASE_NUM, 3) // 1千
        const SUFFIX_ONE_HANDRED_MILLION = '亿'
        const SUFFIX_TEN_THOUSAND = '万'

        return [
            {
                min: THOUSAND_HUNDRED_MILLION, max: Infinity, suffix: SUFFIX_ONE_HANDRED_MILLION,
                divider: ONE_HUNDRED_BILLION, fixed: 0,
            },
            {
                min: TEN_BILLION, max: THOUSAND_HUNDRED_MILLION, suffix: SUFFIX_ONE_HANDRED_MILLION,
                divider: ONE_HUNDRED_BILLION, fixed: 1,
            },
            {
                min: ONE_HUNDRED_BILLION, max: TEN_BILLION, suffix: SUFFIX_ONE_HANDRED_MILLION,
                divider: ONE_HUNDRED_BILLION, fixed: 2,
            },
            {
                min: BILLION_1000, max: ONE_HUNDRED_BILLION, suffix: SUFFIX_TEN_THOUSAND,
                divider: TEN_THOUSAND, fixed: 0,
            },
            {
                min: MILLION, max: BILLION_1000, suffix: SUFFIX_TEN_THOUSAND,
                divider: TEN_THOUSAND, fixed: 1,
            },
            {
                min: HUNDRED_THOUSAND, max: MILLION, suffix: SUFFIX_TEN_THOUSAND,
                divider: TEN_THOUSAND, fixed: 2,
            },
            {
                min: THOUSAND, max: HUNDRED_THOUSAND, suffix: '',
                divider: 1, fixed: 0,
            },
        ]
    }

    // 格式化方法
    const format = (num, isInteger) => {
        const BASE_NUM = 10
        const THOUSAND = Math.pow(BASE_NUM, 3) // 1千
        num = Number(num)
        let absNumber = Math.abs(num)
        if (absNumber < THOUSAND) {
            if (isInteger) {
                // 整数
                return num.toFixed(0)
            } else {
                // 浮点型
                const ONE_HUNDRED = Math.pow(BASE_NUM, 2) // 1百
                if (absNumber < ONE_HUNDRED) {
                    return num.toFixed(2)
                } else if (num < THOUSAND) {
                    return num.toFixed(1)
                }
            }
        } else {
            let index = 0
            const range = financialRange()
            let rangeItem
            while (rangeItem = range[index++]) {
                if (absNumber >= rangeItem.min && absNumber < rangeItem.max) { break }
            }
            if (rangeItem) {
                let result = (num / rangeItem.divider).toFixed(rangeItem.fixed)
                return `${result}${rangeItem.suffix}`
            }
        }
    }

    return format(...args)
}
