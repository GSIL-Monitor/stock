import {
    RED,
    GREEN,
} from '../config/color-config'
import shortLineType from '../config/short-line-config'
import {
    dataFixed,
} from '@c/utils/util'

export const getColor = type => {
    if ([1, 2, 5, 7, 9, 10].includes(type)) {
        return RED
    } else if ([3, 4, 6, 8, 11, 12].includes(type)) {
        return GREEN
    }
}

export const formatNumber = (type, number) => {
    if ([1, 2, 3, 4].includes(type)) {
        return dataFixed(number)
    } else if ([5, 6, 7, 8].includes(type)) {
        return (number / 100).toFixed(0)
    } else if ([9, 10, 11, 12].includes(type)) {
        return dataFixed(number / 100, '%')
    } else {
        return '--'
    }
}

export const formatDate = date => {
    return date.substr(11, 5)
}

export const formatStockName = (val = '--') => {
    return val
}

export const formatType = (type) => {
    return shortLineType.get(type)
}
