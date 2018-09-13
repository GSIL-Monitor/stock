/**
 * @description 内盘(volume_inner)、外盘(volume_outer)
 * @see Interface::formatVolumeInner()、formatVolumeOuter()
 * @return {object}
*/
import {
    DEFAULT,
    RED,
    GREEN,
} from '../config/color-config'
import {
    formatNumber,
    isClearCase,
} from '../utility'

const normal = (value, list, color) => {
    if (isClearCase(value, list)) {
        return {
            val: '--',
            color: DEFAULT,
        }
    } else {
        let val = formatNumber(value, true)
        return {
            val,
            color,
        }
    }
}

export const formatVolumeInner = (volume_inner, list) => {
    const color = GREEN
    return normal(volume_inner, list, color)
}

export const formatVolumeOuter = (volume_outer, list) => {
    const color = RED
    return normal(volume_outer, list, color)
}