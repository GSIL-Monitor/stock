/**
 * @file 涨跌额(price_change|change_value)
 * @see Interface::formatPriceChange()
 * @return {function}
*/
import * as TYPE from '../config/stock-type-config.js'
import {
    DEFAULT,
} from '../config/color-config.js'
import {
    stockToType,
    isNumber,
    getColor,
    getRetainBits,
    isClearCase,
    getClearVal,
} from '../utility.js'

const addSymbol = (value) => {
    if (value > 0) {
        return `+${value}`
    } else {
        return value
    }
}

const formatNum = (value, num = 2) => {
    return Number(value).toFixed(num)
}

const normal = (price_change, num = 2) => {
    let val = formatNum(price_change, num)
    const color = getColor(val, num)
    val = addSymbol(val)

    return {
        val,
        color,
    }
}

const formatNormal = (price_change, bit) => {
    return normal(price_change, bit)
}

const formatHKStock = (price_change, list) => {
    let price = list.price

    if (
        price_change === '' ||
        !isNumber(price) ||
        Object.is(String(price), '0') ||
        (Reflect.has(list, 'mark') && String(Reflect.get(list, 'mark')) === '1')
    ) {
        return getClearVal()
    } else if (!isNumber(price_change)) {
        return {
            val: '0.000',
            color: DEFAULT,
        }
    } else {
        return normal(price_change, 3)
    }
}

const formatFutures = (price_change) => {
    let num, color, val
    if (Number.isInteger(price_change)) {
        num = 0
    } else {
        num = 2
    }
    val = formatNum(price_change, num)
    color = getColor(val)
    val = addSymbol(Number(val))

    return {
        val,
        color,
    }
}

const formatPriceChange = (price_change, list, current_type) => {
    const type = current_type || stockToType(
        list.source,
        list.symbol_type,
    )

    if ([TYPE.HKSTOCK, TYPE.HKFUND, TYPE.HKBOND, TYPE.HKWARRANT, TYPE.HKCBBC].includes(type)) {
        // 港股股票，港股基金，港股债券，港股涡轮，港股牛熊证
        return formatHKStock(price_change, list)
    } else if (isClearCase(price_change, list)) {
        return getClearVal()
    }
    else if (type === TYPE.FUTURES) {
        return formatFutures(price_change, list)
    } else {
        const bit = getRetainBits(type)
        return formatNormal(price_change, bit)
    }
}

export default formatPriceChange
