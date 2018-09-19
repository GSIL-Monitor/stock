/**
 * @file 涨幅(price_change_rate|change_rate)
 * @see Interface::formatPriceChangeRate()
 * @return {function}
*/
import * as TYPE from '../config/stock-type-config'
import {
    DEFAULT,
} from '../config/color-config'
import {
    stockToType,
    isNumber,
    getColor,
    isClearCase,
    getClearVal,
    getRetainBits,
} from '../utility'

const addSymbol = (value) => {
    if (value > 0) {
        return `+${value}%`
    } else {
        return `${value}%`
    }
}

const formatNum = (value) => {
    return Number(value).toFixed(2)
}

const formatNormal = (price_change_rate, num, list) => {
    const color = getColor(
        list.price_change || list.change_value,
        num
    )
    let val = formatNum(price_change_rate)
    val = addSymbol(val)

    return {
        val,
        color,
    }
}

const formatHKStock = (price_change_rate, list) => {
    let price = list.price
    if (
        // 空字符串为框架清空
        price_change_rate === '' ||
        !isNumber(price) ||
        Object.is(String(price), '0') ||
        (Reflect.has(list, 'mark') && String(Reflect.get(list, 'mark')) === '1')
    ) {
        return getClearVal()
    } else if (!isNumber(price_change_rate)) {
        return {
            val: '0.00%',
            color: DEFAULT,
        }
    } else {
        return formatNormal(price_change_rate, 3, list)
    }
}

const formatPriceChangeRate = (price_change_rate, list, current_type) => {
    const type = current_type || stockToType(
        list.source,
        list.symbol_type,
    )
    if ([TYPE.HKSTOCK, TYPE.HKFUND, TYPE.HKBOND, TYPE.HKWARRANT, TYPE.HKCBBC].includes(type)) {
        // 港股股票，港股基金，港股债券，港股涡轮，港股牛熊证
        return formatHKStock(price_change_rate, list)
    } else if (isClearCase(price_change_rate, list)) {
        return getClearVal()
    } else {
        const bit = getRetainBits(type)

        return formatNormal(price_change_rate, bit, list)
    }
}

export default formatPriceChangeRate
