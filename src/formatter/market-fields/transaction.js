/**
 * @description 成交明细相关字段处理
 * @return {object}
*/

import {
    RED,
    GREEN,
    DEFAULT,
} from '../config/color-config'
import {
    toType,
    isNumber,
} from '../utility'

export const formatTime = time => {
    if (Object.is(toType(time), 'string')) {
        return time.split(' ')[1]
    } else {
        return '--'
    }
}

export const getArrow = (type, volume) => {
    if (isNumber(volume)) {
        return type == 1 ? 'down' :
               type == 2 ? 'up' :
                       'mid'
    } else {
        return ''
    }
}

export const getColor = type => {
    return type == 1 ? GREEN :
           type == 2 ? RED :
                       DEFAULT
}

export const formatNormalVolume = (type, value) => {
    let val
    let color
    if (isNumber(value)) {
        val = Math.round(value)
        color = getColor(type)
    } else {
        val = '--'
        color = DEFAULT
    }

    return {
        val,
        color,
    }
}

export const formatCount = (value) => {
    const color = DEFAULT
    if (isNumber(value) && value !== 0) {
        return {
            val: Math.round(value),
            color,
        }
    } else {
        return {
            val: ' ',
            color,
        }
    }
}
