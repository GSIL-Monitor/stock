/**
 * @file 委比(commission_rate)
 * @see Interface::formatCommissionRate()
 * @return {function}
 */
import {
    RED,
    GREEN,
    DEFAULT,
} from '../config/color-config.js'
import {
    isClearCase,
    getClearVal,
} from '../utility.js'
import { dataFixed } from '@c/utils/util.js';

const getColor = (val) => {
    return val > 0 ? RED :
           val < 0 ? GREEN :
           DEFAULT
}

const formatCommissionRate = (value, list) => {
    if (isClearCase(value, list)) {
        return getClearVal()
    } else {
        const color = getColor(value)
        let val = dataFixed(value, '%2f')

        return {
            val,
            color,
        }
    }
}

export default formatCommissionRate
