// 代码 (stock_code | code)
import formatShowCode from './market-fields/stock-code.js'
// 名称 (stock_name | name)
import formatStockName from './market-fields/stock-name.js'
// 最新价 (price)
import formatPrice from './market-fields/price.js'
// 涨跌额 (price_change | change_value)
import formatPriceChange from './market-fields/price-change.js'
// 涨跌幅 (price_change_rate | change_rate)
import formatPriceChangeRate from './market-fields/price-change-rate.js'
// 今开、最高、最低、均价、买入价、卖出价
import formatCompareClose from './market-fields/compare-close.js'
// 金额 (turnover)、总手 (volume)、换手率 (turnover_rate)
import {
    formatTurnover,
    formatVolume,
    formatTurnoverRate,
} from './market-fields/neutral-normal.js'
// 量比 (quantity_ratio)
import formatQuantityRatio from './market-fields/quantity-ratio.js'
// 内盘 (volume_inner)、外盘 (volume_outer)
import {
    formatVolumeInner,
    formatVolumeOuter,
} from './market-fields/inner-outer.js'
// 流通市值 (mcap)、总市值 (tcap)、市盈 (pe_y1)、市净 (pb_y1)
import {
    formatMarketValue,
    formatConsensusFields,
} from './market-fields/neutral-focus.js'
// 涨停、跌停
import {
    formatHighLimit,
    formatLowLimit,
} from './market-fields/high-low-limit.js'
// 振幅 (amplitude)、昨收 (close_price)、一致预期(eps、pe)
import {
    formatClosePrice,
    formatAmplitude,
} from './market-fields/default-fields.js'

// 平盘(flat) 上涨(rose) 下跌(fall)
import {
    formatFlat,
    formatFall,
    formatRose,
} from './market-fields/index-fields.js'

export {
    formatPrice,
    formatPriceChange,
    formatPriceChangeRate,
    formatShowCode,
    formatStockName,
    formatCompareClose,
    formatTurnover,
    formatVolume,
    formatTurnoverRate,
    formatVolumeInner,
    formatVolumeOuter,
    formatQuantityRatio,
    formatMarketValue,
    formatConsensusFields,
    formatHighLimit,
    formatLowLimit,
    formatClosePrice,
    formatAmplitude,
    formatFlat,
    formatFall,
    formatRose,
}
