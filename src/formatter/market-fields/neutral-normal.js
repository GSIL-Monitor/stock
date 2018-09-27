/**
 * @file 金额(turnover)、总手(volume)、换手(turnover_rate)
 * @see Interface::formatTurnover()、formatVolume()、formatTurnoverRate()
 * @return {object}
 */
import {
    BLUE,
} from '../config/color-config.js'
import {
    ASTOCK,
    SHBSTOCK,
    SZBSTOCK,
    FUND,
    BOND,
    INDEX,
} from '../config/stock-type-config.js'
import {
    formatNumber,
    isClearCase,
    getClearVal,
    stockToType,
} from '../utility.js'
import { dataFixed } from '@c/utils/util.js';

const normal = (value, list, isInteger) => {
    if (isClearCase(value, list) || Object.is(value, 0)) {
        return getClearVal()
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
export const formatVolume = (value, list, current_type) => {
    let type = current_type || stockToType(
        list.source,
        list.symbol_type,
    )
    if ([ASTOCK, SHBSTOCK, SZBSTOCK, FUND, BOND, INDEX].includes(type)) {
        value = value / 100
    }
    return normal(value, list, true)
}

// 换手
export const formatTurnoverRate = (value, list) => {

    if (isClearCase(value, list) || Object.is(value, 0)) {
        return getClearVal()
    } else {
        const color = BLUE
        let val = dataFixed(value, '%2f')
        return {
            val,
            color,
        }
    }
}
