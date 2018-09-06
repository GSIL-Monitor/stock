
/**
 * @description 今开(open_price)、最高(high_price)、最低(low_price)、均价(average_price)、买入价(buy_price)、卖出价(sell_price)
 * @see Interface::formatCompareClose()
 * @return {function}
*/
import { stockToType, getRetainBits, isClearCase } from '../utility'
import {
    RED,
    GREEN,
    DEFAULT,
} from '../config/color-config'

const getColor = (value, close_price) => {
    return value > close_price ? RED :
           value < close_price ? GREEN :
                                 DEFAULT
}

const formatNum = (value, num = 2) => {
    return Number(value).toFixed(num)
}

const formatNormal = (value, list, bit) => {
    let color = getColor(value, Reflect.get(list, 'close_price'))
    let val = formatNum(value, bit)

    return {
        val,
        color,
    }
}

const formatCompareClose = (value, list, current_type) => {
    if (isClearCase(value, list)) {
        return { val: '--', color: DEFAULT }
    } else {
        const type = current_type || stockToType(
            list.source,
            list.symbol_type,
        )
        const bit = getRetainBits(type)
        return formatNormal(value, list, bit)
    }
}

export default formatCompareClose
