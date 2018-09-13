/**
 * @description 平盘(flat) 上涨(rose) 下跌(fall)
 * @see Interface::formatFlat()||formatFall()||formatRose()
 * @return {object}
*/
import {
    isClearCase,
} from '../utility'
import {
    RED,
    GREEN,
    DEFAULT,
} from '../config/color-config'

const normal = (val, color) => {
    return {
        val,
        color,
    }
}

export const formatFlat = (val, list) => {
    const color = DEFAULT
    if (isClearCase(val, list)) {
        return {
            val: '--',
            color,
        }
    } else {
        return normal(val, color)
    }
}

export const formatFall = (val, list) => {
    const color = GREEN
    if (isClearCase(val, list)) {
        return {
            val: '--',
            color,
        }
    } else {
        return normal(val, color)
    }
}

export const formatRose = (val, list) => {
    const color = RED
    if (isClearCase(val, list)) {
        return {
            val: '--',
            color,
        }
    } else {
        return normal(val, color)
    }
}