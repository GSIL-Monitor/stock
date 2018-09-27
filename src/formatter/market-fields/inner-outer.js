/**
 * @file 内盘(volume_inner)、外盘(volume_outer)
 * @see Interface::formatVolumeInner()、formatVolumeOuter()
 * @return {object}
*/
import {
    formatNumber,
    isClearCase,
    getClearVal,
    stockToType,
} from '../utility.js'
import {
    RED,
    GREEN,
} from '../config/color-config.js'
import {
    ASTOCK,
    SHBSTOCK,
    SZBSTOCK,
    FUND,
    BOND,
    INDEX,
} from '../config/stock-type-config.js'

const normal = (value, list, color) => {
    if (isClearCase(value, list)) {
        return getClearVal()
    } else {
        let val = formatNumber(value, true)
        return {
            val,
            color,
        }
    }
}

export const formatVolumeInner = (volume_inner, list, current_type) => {
    const color = GREEN
    let type = current_type || stockToType(
        list.source,
        list.symbol_type,
    )
    if ([ASTOCK, SHBSTOCK, SZBSTOCK, FUND, BOND, INDEX].includes(type)) {
        volume_inner = volume_inner / 100
    }

    return normal(volume_inner, list, color)
}

export const formatVolumeOuter = (volume_outer, list, current_type) => {
    const color = RED
    let type = current_type || stockToType(
        list.source,
        list.symbol_type,
    )
    if ([ASTOCK, SHBSTOCK, SZBSTOCK, FUND, BOND, INDEX].includes(type)) {
        volume_outer = volume_outer / 100
    }
    return normal(volume_outer, list, color)
}
