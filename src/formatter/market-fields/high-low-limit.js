/**
 * @file 涨停、跌停
 * @see Interface::formatHighLimit()、formatLowLimit()
 * @return {object}
*/
import {
    toType,
    stockToType,
    isClearCase,
    getClearVal,
} from "../utility";
import {
    ASTOCK,
    SHBSTOCK,
    SZBSTOCK,
    FUND,
} from '../config/stock-type-config'
import {
    RED,
    GREEN,
} from "../config/color-config"

const isABStock = type => {
    return [
        ASTOCK,
        SHBSTOCK,
        SZBSTOCK,
    ].includes(type)
}

const getABStockCoefficient = (stock_name) => {
    if (toType(stock_name) === 'string') {
        if (stock_name.substr(0,1) === 'N') {
            return 0.44
        } else if (stock_name.includes('S')) {
            return 0.05
        } else {
            return 0.1
        }
    } else {
        return 0.1
    }
}

const toFixed = (value, num = 2) => {
    return Number(value).toFixed(num)
}

const getCoefficient = (type, list) => {
    if (isABStock(type)) {
        const name = Reflect.get(list, 'stock_name')
        return getABStockCoefficient(name)
    } else if (type === FUND) {
        return 0.1
    }
}

const getVal = (val, type) => {
    if (type === FUND) {
        return toFixed(val, 3)
    } else {
        return toFixed(val)
    }
}

export const formatHighLimit = (value, list, current_type) => {
    if (isClearCase(value, list)) {
        return getClearVal()
    } else {
        const type = current_type || stockToType(
            list.source,
            list.symbol_type,
        )
        let coefficient = getCoefficient(type, list)
        let val = value * (1 + coefficient)
        val = getVal(val, type)

        return {
            val,
            color: RED,
        }
    }
}

export const formatLowLimit = (value, list, current_type) => {
    if (isClearCase(value, list)) {
        return getClearVal()
    } else {
        const type = current_type || stockToType(
            list.source,
            list.symbol_type,
        )
        let coefficient = getCoefficient(type, list)
        let val = value * (1 - coefficient)
        val = getVal(val, type)

        return {
            val,
            color: GREEN,
        }
    }
}
