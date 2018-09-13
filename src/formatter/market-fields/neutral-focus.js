/**
 * @description 流通市值(mcap)、总市值(tcap)、一致预期相关字段 市盈(pe_y1)、市净(pb_y1)
 * @see Interface::formatMarketValue()、formatConsensusFields()
 * @return {function}
*/
import {
    YELLOW,
} from '../config/color-config'
import {
    formatFigure,
    isNumber,
} from '../utility'

/**
 * @description 流通市值(mcap)、总市值(tcap)
*/
export const formatMarketValue = value => {
    let val = formatFigure(value)

    return {
        val,
        color: YELLOW,
    }
}

/**
 * @description 市盈(pe_y1)、市净(pb_y1)、pe、eps
*/
// 一致预期字段
export const formatConsensusFields = value => {
    const color = YELLOW
    const val = isNumber(value) ? Number(value).toFixed(2) : '--'

    return {
        val,
        color,
    }
}
