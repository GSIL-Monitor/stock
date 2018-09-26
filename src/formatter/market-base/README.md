行情相关字段.vue文件
=========================
# 公共字段
    `mark` 清空字段，清空时间传 1
    `current_type` 股票类型
    `stock_type` A股、B股必传
    `source`
    `symbol_type`

# 股票类型的确定
   ## 方法一: 传 current_type
   ## 方法二: 同时传 source 与 symbol_type

# 不清空字段

## 昨收(close_price)
    `ClosePrice.vue`
## 名称(stock_name)
    `StockName.vue`
## 代码(stock_code)
    `StockCode.vue`
## 一致预期相关字段
    `ConsensusFields.vue`
## 市值相关字段
    `MarketValue.vue`
=============================
# 清空字段

## 最新(price)
    `Price.vue`
## 涨跌(price_change)
    `PriceChange.vue`
## 涨幅(price_change_rate)
    `PriceChangeRate.vue`
## 均价(avg_price) 开盘(open_price) 最高(high_price) 最低(low_price)
    `CompareClose.vue`
## 换手(turnover_rate)
    `TurnoverRate.vue`
## 量比(quantity_ratio)
    `QuantityRatio.vue`
## 内盘(volume_inner)
    `VolumeInner.vue`
## 外盘(volume_outer)
    `VolumeOuter.vue`
## 总手(volume)
    `Volume.vue`
## 金额(turnover)
    `Turnover.vue`
## 振幅(amplitude)
    `Amplitude.vue`
## 委比(commission_rate)
    `CommissionRate.vue`
## 涨停(传close_price计算)
    `HighLimit.vue`
## 跌停(传close_price计算)
    `LowLimit.vue`
## 平盘(flat)
    `Flat.vue`
## 上涨(rose)
    `Rose.vue`
## 下跌(fall)
    `Fall.vue`
