/**
 * @file 最新价(price)
 * @see Interface::formatPrice()
 * @return {function}
*/
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
} from '../config/stock-type-config.js'
import {
    DEFAULT,
} from '../config/color-config.js'
import {
    stockToType,
    isNumber,
    formatNum,
    getColor,
    getRetainBits,
    getClearVal,
} from '../utility.js'

const getValAndColor = (value, price_change, num = 2) => {
    const val = formatNum(value, num)
    const color = getColor(price_change, num)

    return {
        val,
        color,
    }
}

const formatAStock = (value, price_change, list, num = 2) => {
    const stock_type = String(Reflect.get(list, 'stock_type'))
    if (
        Object.is(stock_type, 'undefined') ||
        Object.is(stock_type, '1')
    ) {
        return getValAndColor(value, price_change, num)
    } else {
        const val = Object.is(stock_type, '0') ? '停牌' :
                    Object.is(stock_type, '-1') ? '退市' :
                    Object.is(stock_type, '-2') ? '未上市' :
                    Object.is(stock_type, '2') ? '暂停上市' :
                    Object.is(stock_type, '3') ? '临停' : '--'
        return {
            val,
            color: DEFAULT,
        }
    }
}

const formatNormal = (value, price_change, list, bit) => {
    return getValAndColor(value, price_change, bit)
}

const formatBStock = (value, price_change, list, bit) => {
    return formatAStock(value, price_change, list, bit)
}

const formatFutures = (value, price_change) => {
    var result = getValAndColor(value, price_change)
    // 期货舍去末尾为零的位数
    result.val = Number(result.val)

    return result
}

/**
 * @description 建立映射关系，不同品种可能对应同一个处理方法
 */
const format = {
    // 沪深 A 股
    [ASTOCK]: formatAStock,
    // 沪深指数
    [INDEX]: formatNormal,
    // 基金
    [FUND]: formatNormal,
    // 债券
    [BOND]: formatNormal,
    // 沪深 B 股 (上海)
    [SHBSTOCK]: formatBStock,
    // 沪深 B 股 (深圳)
    [SZBSTOCK]: formatBStock,
    // 港股股票
    [HKSTOCK]: formatNormal,
    // 港股基金
    [HKFUND]: formatNormal,
    // 港股债券
    [HKBOND]: formatNormal,
    // 港股涡轮
    [HKWARRANT]: formatNormal,
    // 港股牛熊证
    [HKCBBC]: formatNormal,
    // 港股指数
    [HKINDEX]: formatNormal,
    // 期货
    [FUTURES]: formatFutures,
}

const formatTypePrice = (type, price, list) => {
    const bit = getRetainBits(type)
    const price_change = list.price_change || list.change_value

    return format[type](price, price_change, list, bit)
}

const formatPrice = (price, list, current_type) => {
    if (!isNumber(price) || Object.is(Number(price), 0) || Object.is(String(list.mark), '1')) {
        return getClearVal()
    } else {
        let type = current_type || stockToType(
            list.source,
            list.symbol_type,
        )

        return formatTypePrice(type, price, list)
    }
}

export default formatPrice
