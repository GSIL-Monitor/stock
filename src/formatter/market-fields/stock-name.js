/**
 * @file 名称(stock_name|name)
 * @see Interface::formatStockName()
 * @return {function}
 */
import * as TYPE from '../config/stock-type-config'
import { stockToType } from '../utility'

const formatHK = name => {
    let reg = /\w{1}/,
        characterReg = /^[\u4e00-\u9fa5]/,
        splitStr,
        bytes = 0,
        str,
        j = 0,
        allLetter = true
    if (!name) return '--'
    splitStr = name.split('')
    for (var i = 0, len = splitStr.length; i < len; i += 1) {
        if (reg.test(splitStr[i])) {
            //字母，数字，下划线
            bytes += 1
        } else if (characterReg.test(splitStr[i])) {
            //汉字
            allLetter = false
            bytes += 2
        } else {
            //其他特殊字符
            bytes += 1
        }
        if (bytes < 16) {
            j += 1
        }
    }
    if ((allLetter && bytes <= 16) || (!allLetter && bytes <= 17)) {
        return decodeURIComponent(name)
    } else if ((allLetter && bytes > 16) || (!allLetter && bytes > 17)) {
        str = decodeURIComponent(splitStr.slice(0, j + 1).join(''))
        return str + '...'
    }
}

const formatNormal = name => {
    return name ? name : '--'
}

const formatStockName = (name, list, current_type) => {
    const type = current_type || stockToType(
        list.source,
        list.symbol_type,
    )
    if ([TYPE.HKSTOCK, TYPE.HKFUND, TYPE.HKBOND, TYPE.HKCBBC, TYPE.HKWARRANT].includes(type)) {
        return formatHK(name)
    } else {
        return formatNormal(name)
    }
}

export default formatStockName
