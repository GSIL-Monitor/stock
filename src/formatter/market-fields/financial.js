/**
 * @file
 * @see Interface::getReportDate()、formatClosePrice()
 * @return {object}
*/
import {
    DEFAULT,
    RED,
    GREEN,
    BLUE,
    YELLOW,
} from '../config/color-config.js'
import {
    formatFigure,
    formatNumber,
    isNumber,
    toType,
} from '../utility.js'

const getColor = val => {
    return val > 0 ? RED :
           val < 0 ? GREEN :
                     DEFAULT
}

export const getMoneyFormat = value => {
    if (isNumber(value)) {
        let val = formatNumber(Number(value))
        return `${val}元`
    } else {
        return '--'
    }
}

const switchNumToPercent = value => {
    let val = Number(value * 100).toFixed(2)
    return `${val}%`
}

const getReportPeriod = report_show => {
    report_show = String(report_show)
    if (Object.is(report_show, '1')) {
        return '一季报'
    } else if (Object.is(report_show, '2')) {
        return '中报'
    } else if (Object.is(report_show, '3')) {
        return '三季报'
    } else if (Object.is(report_show, '4')) {
        return '年报'
    } else {
        return '--'
    }
}

const getYear = report_date => {
    if (Object.is(toType(report_date), 'string')) {
        return report_date.substr(0, 4)
    } else {
        return ''
    }
}

// 报告期(不含时间) (report_show)
export const getReportDate = report_show => {
    let val = getReportPeriod(report_show)
    const color = BLUE

    return {
        val,
        color,
    }
}

// 获取报告期(含时间)
export const getReportShow = (report_show, report_date) => {
    let period = getReportPeriod(report_show)
    let year = getYear(report_date)
    const color = BLUE
    let val = `${year}${period}`

    return {
        val,
        color,
    }
}

// 流通股本 (tradable_stock) | 总股本 (stock_total)
export const getCapitalStock = value => {
    const color = BLUE
    let val
    if (isNumber(value)) {
        val = formatNumber(Number(value), true)
        val = `${val}股`
    } else {
        val = '--'
    }

    return {
        val,
        color,
    }
}

export const getYellowNumber = value => {
    const color = YELLOW
    let val = isNumber(value) ?  Number(value).toFixed(2) : '--'

    return {
        val,
        color,
    }
}

// 十大流通股东占比 | 净资产收益率
export const getYellowPercent = value => {
    const color = YELLOW
    let val = isNumber(value) ? switchNumToPercent(value) : '--'

    return {
        val,
        color,
    }
}

export const getMixedPercent = value => {
    const color = getColor(value)
    let val = isNumber(value) ? switchNumToPercent(value) : '--'

    return {
        val,
        color,
    }
}

// 主营收入 | 每股净资产 | 总资产 | 流动资产 | 总负债 | 流动负债 | 经营现金流量 | 现金增加额
export const getBlueYen = (value) => {
    const color = BLUE
    let val = getMoneyFormat(value)

    return {
        val,
        color,
    }
}

// 股东人数
export const getShareHolder = value => {
    const color = YELLOW
    let val = formatFigure(value, true)

    return {
        val,
        color,
    }
}

// 净利润 | 每股盈利 | 每股公积金 | 每股未分配利润 |
export const getMixedYen = value => {
    const color = getColor(value)
    let val = getMoneyFormat(value)

    return {
        val,
        color,
    }
}
