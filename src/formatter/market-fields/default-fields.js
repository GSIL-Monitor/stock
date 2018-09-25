/**
 * @file 振幅(amplitude)昨收(close_price)
 * @see Interface::formatAmplitude()、formatClosePrice()
 * @return {object}
*/
import {
    DEFAULT,
} from '../config/color-config.js'
import {
    getRetainBits,
    stockToType,
    isClearCase,
    getClearVal,
    isNumber,
} from '../utility.js'

// 振幅
export const formatAmplitude = (amplitude, list) => {
    if (isClearCase(amplitude, list)) {
        return getClearVal()
    } else {
        const color = DEFAULT
        let val = Number(amplitude).toFixed(2) + '%'
        return {
            val,
            color,
        }
    }
}

// 昨收
export const formatClosePrice = (close_price, list, current_type) => {
    const type = current_type || stockToType(
        list.source,
        list.symbol_type,
    )
    let val
    if (isNumber(close_price)) {
        let bit = getRetainBits(type)
        val = Number(close_price).toFixed(bit)
    } else {
        val = '--'
    }

    return {
        val,
        color: DEFAULT,
    }
}
