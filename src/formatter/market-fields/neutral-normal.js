/**
 * @description 金额(turnover)、总手(volume)、换手(turnover_rate)
 * @see Interface::formatTurnover()、formatVolume()、formatTurnoverRate()
 * @return {object}
 */
import { BLUE } from '../config/color-config'
import {
    formatNumber,
    isClearCase,
} from '../utility'
import { dataFixed } from '@c/utils/util';

const normal = (value, list, isInteger) => {
    if (isClearCase(value, list)) {
        return {
            color: BLUE,
            val: '--'
        }
    } else {
        let val = formatNumber(value, isInteger)
        return {
            val,
            color: BLUE,
        }
    }
}

// 金额
export const formatTurnover = (value, list) => {
    return normal(value, list, false)
}

// 总手
export const formatVolume = (value, list) => {
    return normal(value, list, true)
}

// 换手
export const formatTurnoverRate = (value, list) => {
    const color = BLUE
    if (isClearCase(value, list)) {
        return {
            val: '--',
            color,
        }
    } else {
        let val = dataFixed(value, '%2f')
        return {
            val,
            color,
        }
    }
}
