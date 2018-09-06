<template>
    <div class="detail">
        <!-- 顶部信息 -->
        <div class="detail_head">
            <div class="detail_head_title">
                <div class="title_left">
                    <span class="title_left_name">{{formatName}}</span>
                    <span class="title_left_code">{{formatCode}}</span>
                </div>
                <SetIco
                    class="title_right_set"
                    @click="tapeSettings"
                />
            </div>
            <TitleTopMarket
                class="detail_head_market"
                :source="source"
                :symbol_type="symbol_type"
                :stock_type="stock_type"
                :price="price"
                :price_change="price_change"
                :price_change_rate="price_change_rate"
            />
            <div class="detail_head_btn">
                <div class="detail_head_btn_skip">
                    <DefaultBtn text="F10" className="btn-content" @click="skipF10"/>
                </div>
            </div>
        </div>
        <!-- 买卖五档 -->
        <FiveOrder
            class="detail_order"
            :orderData="orderData"
            :close_price="close_price"
            :stockType="current_type"
            :row="row"
        />
         <div
            class="detail_info"
            :class="[detailInfoClass]"
         >
            <div
                class="detail_info_table"
                @click="detailInfoToggleHeight"
            >
                <MarketInfo
                    class="detail_table_B"
                >
                    <tbody>
                        <tr>
                            <td class="two-letters">金额</td>
                            <td>
                                <Turnover :val="turnover"/>
                            </td>
                            <td class="two-letters">换手</td>
                            <td>
                                <TurnoverRate
                                    :val="turnover_rate"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">总手</td>
                            <td>
                                <Volume
                                    :val="volume"
                                />
                            </td>
                            <td class="two-letters">量比</td>
                            <td>
                                <QuantityRatio
                                    :val="quantity_ratio"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>流通股</td>
                            <td>
                                <MarketValue
                                    :val="negotiable_capital"
                                />
                            </td>
                            <td>流通市值</td>
                            <td>
                                <MarketValue
                                    :val="mcap"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>总股本</td>
                            <td>
                                <MarketValue
                                    :val="capital"
                                />
                            </td>
                            <td>总市值</td>
                            <td>
                                <MarketValue
                                    :val="tcap"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">均价</td>
                            <td>
                                <CompareClose
                                    :val="avg_price"
                                    :close_price="close_price"
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">振幅</td>
                            <td>
                                <Amplitude
                                    :val="amplitude"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">今开</td>
                            <td>
                                <CompareClose
                                    :val="open_price"
                                    :close_price="close_price"
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">昨收</td>
                            <td>
                                <ClosePrice
                                    :val="close_price"
                                    :current_type="current_type"
                                ></ClosePrice>
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">最高</td>
                            <td>
                                <CompareClose
                                    :val="high_price"
                                    :close_price="close_price"
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">最低</td>
                            <td>
                                <CompareClose
                                    :val="low_price"
                                    :close_price="close_price"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">外盘</td>
                            <td>
                                <VolumeOuter
                                    :val="volume_outer"
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">内盘</td>
                            <td>
                                <VolumeInner
                                    :val="volume_inner"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">涨停</td>
                            <td>
                                <HighLimit
                                    :val="close_price"
                                    :stock_name="stock_name"
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">跌停</td>
                            <td>
                                <LowLimit
                                    :val="close_price"
                                    :stock_name="stock_name"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                    </tbody>
                </MarketInfo>
            </div>
        </div>
        <div class="detail_extend" :style="extendStyles" ref="detailExtend">
            <StockTransaction ref="transactionComponent"/>
        </div>
    </div>
</template>

<script>
import {
    mapState,
} from 'vuex'

import SetIco from '../components/SetIco'
import TitleTopMarket from './TitleTopMarket'
import DefaultBtn from './DefaultBtn'
import FiveOrder from './FiveOrder'
import StockTransaction from './Transaction'
import {
    formatStockName,
    formatShowCode,
} from '@formatter/format-data'
import {
    TAPE_ROWS,
    TAPE_STYLE,
} from '../tape/tape-set-config'
import {
    initTapeDefault,
} from '../tape/tape-public-func'
import {
    getLimitStockData,
} from '@service/index'

import {
    SOCKET_B_MARKET,
} from '../storage'
import socketMixin from './socket-mixin'
import fiveOrderMixin from './five-order-mixin'
import rightResizeMixin from './right-resize-mixin'

// 盘口内容
import MarketInfo from './MarketInfo'
// 盘口内容 -- 字段详情
import Turnover from '@formatter/market-base/Turnover'
import TurnoverRate from '@formatter/market-base/TurnoverRate'
import Volume from '@formatter/market-base/Volume'
import QuantityRatio from '@formatter/market-base/QuantityRatio'
import MarketValue from '@formatter/market-base/MarketValue'
import CompareClose from '@formatter/market-base/CompareClose'
import Amplitude from '@formatter/market-base/Amplitude'
import ClosePrice from '@formatter/market-base/ClosePrice'
import VolumeOuter from '@formatter/market-base/VolumeOuter'
import VolumeInner from '@formatter/market-base/VolumeInner'
import HighLimit from '@formatter/market-base/HighLimit'
import LowLimit from '@formatter/market-base/LowLimit'

export default {
    name: 'StockBTemp',
    mixins: [
        socketMixin,
        fiveOrderMixin,
        rightResizeMixin,
    ],
    created() {
        this.initState()

        this.$eventBus.$on(SOCKET_B_MARKET, this.receiveSocketData)
        this.$eventBus.$on('tapeDefaultChanged', this.tapeDefaultChanged)

        this.getInfoData()
    },
    data() {
        return {
            [TAPE_ROWS]: '5',
            [TAPE_STYLE]: 'off',
            socketData: {},
            linkIndex: 0,
            symbol_type: null,
            stock_type: null,
            stock_name: null,

            price: null,
            price_change: null,
            price_change_rate: null,
            mark: false,
            close_price: null,

            turnover: null,
            turnover_rate: null,
            volume: null,
            quantity_ratio: null,

            negotiable_capital: null,
            mcap: null,
            capital: null,
            tcap: null,

            avg_price: null,
            amplitude: null,
            open_price: null,
            high_price: null,
            low_price: null,
            volume_outer: null,
            volume_inner: null,
        }
    },
    components: {
        SetIco,
        TitleTopMarket,
        DefaultBtn,
        FiveOrder,
        StockTransaction,

        MarketInfo,
        Turnover,
        TurnoverRate,
        Volume,
        QuantityRatio,
        MarketValue,
        CompareClose,
        Amplitude,
        ClosePrice,
        VolumeOuter,
        VolumeInner,
        HighLimit,
        LowLimit,
    },
    computed: {
        ...mapState([
            'source',
            'stock_code',
            'full_code',
            'current_type',
        ]),
        row() {
            return this[TAPE_ROWS]
        },
        formatName() {
            return formatStockName(this.stock_name, {
                source: this.source,
                symbol_type: this.symbol_type,
            })
        },
        formatCode() {
            return formatShowCode(this.stock_code, {
                source: this.source,
            })
        },
        detailInfoClass() {
            return this[TAPE_STYLE] === 'off' ? 'detail_info_Limit' :
                   this[TAPE_STYLE] === 'on' ? 'detail_info_Full' :
                   ''
        },
        linkAddress() {
            return `request_name:push/hq/list_info|request_param:fullcodes=${this.full_code}|request_id:${SOCKET_B_MARKET}|first_push:true`
        },
    },
    methods: {
        initState() {
            initTapeDefault((key, val) => {
                if ([TAPE_ROWS, TAPE_STYLE].includes(key)) {
                    this[key] = val
                }
            })
        },
        tapeDefaultChanged(key, val) {
            this[key] = val
        },
        skipF10() {

        },
        tapeSettings() {
            this.$eventBus.$emit('tapeSet')
        },
        emitDataChange(parentType, type) {
            this.$eventBus.$emit('dataChanged', {
                parentType: parentType,
                type,
                changed: {
                    activeType: type,
                },
            })
        },
        detailInfoToggleHeight() {
            let type = Object.is(this[TAPE_STYLE], 'on') ? 'off' : 'on'
            this.emitDataChange(TAPE_STYLE, type)
        },
        getInfoData() {
            const params = {
                options: {
                    stock_code: this.stock_code,
                },
                callback0: data => {
                    this.symbol_type = data.symbol_type
                    this.stock_type = data.stock_type
                    this.stock_name = data.stock_name

                    this.price = data.price
                    this.price_change = data.change_value
                    this.price_change_rate = data.change_rate

                    this.close_price = data.close_price

                    this.setFiveOrderFields('buy', data)
                    this.setFiveOrderFields('sell', data)

                    this.buy1_diff = 0
                    this.buy2_diff = 0
                    this.buy3_diff = 0
                    this.buy4_diff = 0
                    this.buy5_diff = 0
                    this.sell1_diff = 0
                    this.sell2_diff = 0
                    this.sell3_diff = 0
                    this.sell4_diff = 0
                    this.sell5_diff = 0

                    this.turnover = data.turnover ? data.turnover * 10000 : data.turnover
                    this.turnover_rate = data.turnover_rate ? data.turnover_rate * 100 : data.turnover_rate
                    this.volume = data.volume ? data.volume / 100 : data.volume
                    this.quantity_ratio = data.quantity_ratio

                    this.negotiable_capital = data.negotiable_capital ? data.negotiable_capital * 10000 : data.negotiable_capital
                    this.mcap = data.mcap ? data.mcap * 10000 : data.mcap
                    this.capital = data.capital ? data.capital * 10000 : data.capital
                    this.tcap = data.tcap ? data.tcap * 10000 : data.tcap

                    this.avg_price = data.avg_price
                    this.amplitude = data.amplitude
                    this.open_price = data.open_price
                    this.high_price = data.high_price
                    this.low_price = data.low_price
                    this.volume_outer = data.volume_outer ? data.volume_outer / 100 : data.volume_outer
                    this.volume_inner = data.volume_inner ? data.volume_inner / 100 : data.volume_inner
                },
                afterResponse: () => {
                    this.sendLink(this.linkAddress)
                    this.rememberLink(this.linkAddress, this.linkIndex)
                },
            }

            getLimitStockData(params)
        },
        receiveSocketData(...args) {
            let data = args[0][0]
            // 清空
            this.mark = Object.is(data.mark, 1) ? true : false
            // 继承推送数据
            this.socketData = Object.assign({}, this.socketData, data)
            let socketData = this.socketData

            // 计算五档 volume 差值
            this.setDiffValue('buy')
            this.setDiffValue('sell')

            this.price = socketData.price
            this.price_change = socketData.price_change
            this.price_change_rate = socketData.price_change_rate

            this.close_price = socketData.close_price

            this.setFiveOrderFields('buy', socketData)
            this.setFiveOrderFields('sell', socketData)

            this.turnover = socketData.turnover ? socketData.turnover * 10000 : socketData.turnover
            this.turnover_rate = socketData.turnover_rate
            this.volume = socketData.volume ? socketData.volume / 100 : socketData.volume
            this.quantity_ratio = socketData.quantity_ratio

            this.negotiable_capital = socketData.negotiable_capital ? socketData.negotiable_capital * 10000 : socketData.negotiable_capital
            this.mcap = socketData.mcap ? socketData.mcap * 10000 : socketData.mcap
            this.capital = socketData.capital ? socketData.capital * 10000 : socketData.capital
            this.tcap = socketData.tcap ? socketData.tcap * 10000 : socketData.tcap

            this.avg_price = socketData.avg_price
            this.amplitude = socketData.amplitude
            this.open_price = socketData.open_price
            this.high_price = socketData.high_price
            this.low_price = socketData.low_price
            this.volume_outer = socketData.volume_outer ? socketData.volume_outer / 100 : socketData.volume_outer
            this.volume_inner = socketData.volume_inner ? socketData.volume_inner / 100 : socketData.volume_inner

            if (data.transaction_type && data.transaction_volume) {
                let one = {
                    update_time: data.date,
                    price: socketData.price,
                    price_change: socketData.price_change,
                    volume: Math.floor(Math.round(data.transaction_volume / 100)),
                    transaction_type: data.transaction_type,
                    deal_count: socketData.deal_count,
                }
                this.$refs.transactionComponent.pushData(one)
            }
        },
    },
    beforeDestroy() {
        this.$eventBus.$off(SOCKET_B_MARKET, this.receiveSocketData)
        this.cancleSocket(this.linkIndex)
        this.socketData = {}

        this.$eventBus.$off('tapeDefaultChanged', this.tapeDefaultChanged)
    },
    watch: {
        full_code() {
            if (this.$parent.isBStock) {
                this.cancleSocket(this.linkIndex)
                this.socketData = {}
                this.getInfoData()
            }
        },
    },
}
</script>

<style lang="less">
.detail_table_B {
    cursor: pointer;
}
</style>
