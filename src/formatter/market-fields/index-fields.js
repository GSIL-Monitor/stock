/**
 * @file 平盘(flat) 上涨(rose) 下跌(fall)
 * @see Interface::formatFlat()||formatFall()||formatRose()
 * @return {object}
*/
import {
    isClearCase,
    getClearVal,
} from '../utility.js'
import {
    RED,
    GREEN,
    DEFAULT,
} from '../config/color-config.js'

const normal = (val, color) => {
    return {
        val,
        color,
    }
}

export const formatFlat = (val, list) => {
    if (isClearCase(val, list)) {
        return getClearVal()
    } else {
        const color = DEFAULT
        return normal(val, color)
    }
}

export const formatFall = (val, list) => {
    if (isClearCase(val, list)) {
        return getClearVal()
    } else {
        const color = GREEN
        return normal(val, color)
    }
}

export const formatRose = (val, list) => {
    if (isClearCase(val, list)) {
        return getClearVal()
    } else {
        const color = RED
        return normal(val, color)
    }
}