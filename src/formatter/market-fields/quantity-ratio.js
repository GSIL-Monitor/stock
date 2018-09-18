/**
 * @description 量比(quantity_ratio)
 * @see Interface::formatQuantityRatio()
 * @return {function}
*/
import {
    RED,
    GREEN,
} from '../config/color-config'
import {
    isClearCase,
    getClearVal,
} from '../utility'
import { dataFixed } from '@c/utils/util'
const getColor = (val) => {
    if (val > 1) {
        return RED
    } else {
        return GREEN
    }
}

const formatQuantityRatio = (value, list) => {
    if (isClearCase(value, list) || Object.is(value, 0)) {
        return getClearVal()
    } else {
        let val = dataFixed(value)
        const color = getColor(val)
        return {
            val,
            color
        }
    }
}

export default formatQuantityRatio
