/**
 * @file 折溢价
*/
import {
    RED,
    GREEN,
    DEFAULT,
} from '../config/color-config.js'
import {
    isNumber,
} from '../utility.js'

const addSymbol = (value) => {
    if (value > 0) {
        return `+${value}%`
    } else {
        return `${value}%`
    }
}

const getColor = (num) => {
    return num > 0 ? RED :
           num < 0 ? GREEN :
           DEFAULT
}

const formatDiscountPremium = (value) => {
    let color = getColor(value)
    let val
    if (isNumber(value)) {
        val = addSymbol((value * 100).toFixed(2))
    } else {
        val = '--'
    }

    return {
        color,
        val,
    }
}

export default formatDiscountPremium
