/**
 * @description 最新价(price)
 * @see Interface::formatPrice()
 * @return {function}
*/
import * as TYPE from '../config/stock-type-config'
import * as COLOR from '../config/color-config'
import {
    stockToType,
    isNumber,
    formatNum,
    getColor,
    getRetainBits,
} from '../utility'

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
                    Object.is(stock_type, '2') ? '暂停上市' : '--'
        return {
            val,
            color: COLOR.DEFAULT,
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
    // 舍去末尾为零的位数
    result.val = Number(result.val)

    return result
}

/**
 * @description 建立映射关系，不同品种可能对应同一个处理方法
 */
const format = {
    // 沪深 A 股
    [TYPE.ASTOCK]: formatAStock,
    // 沪深指数
    [TYPE.INDEX]: formatNormal,
    // 基金
    [TYPE.FUND]: formatNormal,
    // 债券
    [TYPE.BOND]: formatNormal,
    // 沪深 B 股 (上海)
    [TYPE.SHBSTOCK]: formatBStock,
    // 沪深 B 股 (深圳)
    [TYPE.SZBSTOCK]: formatBStock,
    // 港股股票
    [TYPE.HKSTOCK]: formatNormal,
    // 港股基金
    [TYPE.HKFUND]: formatNormal,
    // 港股债券
    [TYPE.HKBOND]: formatNormal,
    // 港股涡轮
    [TYPE.HKWARRANT]: formatNormal,
    // 港股牛熊证
    [TYPE.HKCBBC]: formatNormal,
    // 港股指数
    [TYPE.HKINDEX]: formatNormal,
    // 期货
    [TYPE.FUTURES]: formatFutures,
}

const formatTypePrice = (type, price, list) => {
    const bit = getRetainBits(type)
    const price_change = list.price_change || list.change_value

    return format[type](price, price_change, list, bit)
}

const formatPrice = (price, list, current_type) => {
    if (!isNumber(price) || Object.is(Number(price), 0)) {
        // 异常处理
        const price_change = list.price_change || list.change_value
        const color = price_change > 0 ? COLOR.RED :
                      price_change < 0 ? COLOR.GREEN :
                                         COLOR.DEFAULT

        return {
            val: '--',
            color
        }
    } else if (Object.is(String(list.mark), '1')) {
        // 清空
        return {
            val: '--',
            color: COLOR.DEFAULT
        }
    } else {
        let type = current_type || stockToType(
            list.source,
            list.symbol_type,
        )

        return formatTypePrice(type, price, list)
    }
}

export default formatPrice