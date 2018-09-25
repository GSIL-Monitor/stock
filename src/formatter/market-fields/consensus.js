/**
 * @file 一致预期相关字段
 * @see Interface::
 * @return {object}
*/
import {
    DEFAULT,
} from '../config/color-config.js'
import {
    isNumber,
} from '../utility.js'
import {
    dataFixed,
} from '@c/utils/util.js'

export const getYearSuffix = () => {
    let nowMonth = new Date().getMonth()
    let AE = nowMonth < 4 ? 'A/E' : 'E'

    return AE;
}


export const getFixedNum = (num) => {
    const color = DEFAULT
    if (isNumber(num)) {
        return {
            val: dataFixed(Number(num)),
            color
        }
    } else {
        return {
            val: '--',
            color,
        }
    }
}

export const getPercentNum = (num) => {
    const color = DEFAULT
    if (isNumber(num)) {
        return {
            val: dataFixed(Number(num), '%2f'),
            color
        }
    } else {
        return {
            val: '--',
            color,
        }
    }
}
