<template>
    <div class="detail">
        <!-- 顶部信息 -->
        <div class="detail_head">
            <div class="detail_head_title">
                <div class="title_left">
                    <StockName
                        :val="stock_name"
                        :current_type="current_type"
                        class="title_left_name"
                    />
                    <StockCode
                        :val="stock_code"
                        :source="source"
                        class="title_left_code"
                    />
                </div>
                <SetIco
                    class="title_right_set"
                    @click="$_changeTapeDisplay"
                />
            </div>
            <TitleTopMarket
                class="detail_head_market"
                :stock_type="stock_type"
                :price="socketData.price"
                :price_change="socketData.price_change"
                :price_change_rate="socketData.price_change_rate"
            />
            <div class="detail_head_btn">
                <div class="detail_head_btn_skip">
                    <ButtonF10/>
                </div>
                <IsMyStock/>
            </div>
        </div>
        <!-- 买卖五档 -->
        <FiveOrder
            class="detail_order"
            :orderData="orderData"
            :close_price="close_price"
            :current_type="current_type"
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
                                <Turnover
                                    :val="socketData.turnover"
                                    :stock_type="stock_type"
                                />
                            </td>
                            <td class="two-letters">换手</td>
                            <td>
                                <TurnoverRate
                                    :val="socketData.turnover_rate"
                                    :current_type="current_type"
                                    :stock_type="stock_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">总手</td>
                            <td>
                                <Volume
                                    :val="socketData.volume"
                                    :current_type="current_type"
                                    :stock_type="stock_type"
                                />
                            </td>
                            <td class="two-letters">量比</td>
                            <td>
                                <QuantityRatio
                                    :val="socketData.quantity_ratio"
                                    :stock_type="stock_type"
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
                                    :val="socketData.avg_price"
                                    :close_price="close_price"
                                    :current_type="current_type"
                                    :stock_type="stock_type"
                                />
                            </td>
                            <td class="two-letters">振幅</td>
                            <td>
                                <Amplitude
                                    :val="socketData.amplitude"
                                    :current_type="current_type"
                                    :stock_type="stock_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">今开</td>
                            <td>
                                <CompareClose
                                    :val="socketData.open_price"
                                    :close_price="close_price"
                                    :current_type="current_type"
                                    :stock_type="stock_type"
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
                                    :val="socketData.high_price"
                                    :close_price="close_price"
                                    :current_type="current_type"
                                    :stock_type="stock_type"
                                />
                            </td>
                            <td class="two-letters">最低</td>
                            <td>
                                <CompareClose
                                    :val="socketData.low_price"
                                    :close_price="close_price"
                                    :current_type="current_type"
                                    :stock_type="stock_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">外盘</td>
                            <td>
                                <VolumeOuter
                                    :val="socketData.volume_outer"
                                    :current_type="current_type"
                                    :stock_type="stock_type"
                                />
                            </td>
                            <td class="two-letters">内盘</td>
                            <td>
                                <VolumeInner
                                    :val="socketData.volume_inner"
                                    :current_type="current_type"
                                    :stock_type="stock_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">涨停</td>
                            <td>
                                <HighLimit
                                    :val="close_price"
                                    :mark="mark"
                                    :stock_name="stock_name"
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">跌停</td>
                            <td>
                                <LowLimit
                                    :val="close_price"
                                    :mark="mark"
                                    :stock_name="stock_name"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                    </tbody>
                </MarketInfo>
            </div>
        </div>
        <AssociatedStock
            @resize-window="$_resizeWindow"
        />
        <div
            class="detail_extend"
            :style="$_extendStyles"
            ref="detailExtend"
        >
            <StockTransaction
                ref="transactionComponent"
            />
        </div>
    </div>
</template>

<script>
import {
    mapState,
    mapMutations,
} from 'vuex'
import {
    getLimitStockData,
} from '@service/index.js'
import {
    pushData,
    UnSubscriptSockets,
} from '@c/utils/callQt.js'
import {
    TAPE_ROWS,
    TAPE_STYLE,
} from '../tape/tape-set-config.js'
import {
    FRAME_B_MARKET,
    SOCKET_B_MARKET,
} from '../storage.js'
import {
    STOCK_NAME,
    CHANGE_TAPE_SET,
} from '@store/stock-detail-store/config/mutation-types.js'

import socketMixin from '../mixins/socket-mixin.js'
import fiveOrderMixin from '../mixins/five-order-mixin.js'
import rightResizeMixin from '../mixins/right-resize-mixin.js'
import tapeDisplayMixin from '../mixins/tape-display-mixin.js'

import SetIco from '../components/SetIco.vue'
import TitleTopMarket from './TitleTopMarket.vue'
import ButtonF10 from '../components/ButtonF10.vue'
import IsMyStock from './IsMyStock.vue'
import FiveOrder from './FiveOrder.vue'
import AssociatedStock from './AssociatedStock.vue'
import StockTransaction from './Transaction.vue'
// 盘口内容
import MarketInfo from './MarketInfo.vue'
// 盘口内容 -- 字段详情
import StockCode from '@formatter/market-base/StockCode.vue'
import StockName from '@formatter/market-base/StockName.vue'
import Turnover from '@formatter/market-base/Turnover.vue'
import TurnoverRate from '@formatter/market-base/TurnoverRate.vue'
import Volume from '@formatter/market-base/Volume.vue'
import QuantityRatio from '@formatter/market-base/QuantityRatio.vue'
import MarketValue from '@formatter/market-base/MarketValue.vue'
import CompareClose from '@formatter/market-base/CompareClose.vue'
import Amplitude from '@formatter/market-base/Amplitude.vue'
import ClosePrice from '@formatter/market-base/ClosePrice.vue'
import VolumeOuter from '@formatter/market-base/VolumeOuter.vue'
import VolumeInner from '@formatter/market-base/VolumeInner.vue'
import HighLimit from '@formatter/market-base/HighLimit.vue'
import LowLimit from '@formatter/market-base/LowLimit.vue'

const apiFields = [
    'symbol_type',
    'stock_type',
    'close_price',
    'negotiable_capital',
    'mcap',
    'capital',
    'tcap',
    'price',
    'turnover',
    'turnover_rate',
    'volume',
    'quantity_ratio',
    'avg_price',
    'amplitude',
    'open_price',
    'high_price',
    'low_price',
    'volume_outer',
    'volume_inner',
    'fullcode',
]

const fiveFields = [
    'buy1_price',
    'buy2_price',
    'buy3_price',
    'buy4_price',
    'buy5_price',
    'sell1_price',
    'sell2_price',
    'sell3_price',
    'sell4_price',
    'sell5_price',
    'buy1_volume',
    'buy2_volume',
    'buy3_volume',
    'buy4_volume',
    'buy5_volume',
    'sell1_volume',
    'sell2_volume',
    'sell3_volume',
    'sell4_volume',
    'sell5_volume',
]

export default {
    name: 'StockBTemp',
    mixins: [
        socketMixin,
        fiveOrderMixin,
        rightResizeMixin,
        tapeDisplayMixin,
    ],
    created() {
        goGoal.event.listen(FRAME_B_MARKET, this.receiveSocketData)
        // this.$_eventBus.$on(SOCKET_B_MARKET, this.receiveSocketData)

        this.getInfoData()
    },
    data() {
        return {
            socketData: {},
            linkIndex: 0,
            symbol_type: null,
            stock_type: null,
            close_price: null,
            mark: false,
            negotiable_capital: null,
            mcap: null,
            capital: null,
            tcap: null,
        }
    },
    components: {
        SetIco,
        TitleTopMarket,
        ButtonF10,
        IsMyStock,
        FiveOrder,
        AssociatedStock,
        StockTransaction,

        MarketInfo,

        StockCode,
        StockName,
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
            'stock_name',
            'current_type',
        ]),
        ...mapState({
            [TAPE_ROWS]: state => state.moduleTape[TAPE_ROWS].activeType,
            [TAPE_STYLE]: state => state.moduleTape[TAPE_STYLE].activeType,
        }),
        row() {
            return this[TAPE_ROWS]
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
        ...mapMutations([
            STOCK_NAME,
            CHANGE_TAPE_SET,
        ]),
        detailInfoToggleHeight() {
            let val = this[TAPE_STYLE] === 'on' ? 'off' : 'on'
            this[CHANGE_TAPE_SET]([{
                type: TAPE_STYLE,
                val,
            }])
        },
        getInfoData() {
            const params = {
                options: {
                    stock_code: this.stock_code,
                    fields: ['stock_name', 'industry_name', 'change_value', 'change_rate', ...apiFields, ...fiveFields].join(';'),
                },
                callback0: data => {
                    if (data.fullcode !== this.full_code) {
                        return false
                    }

                    this[STOCK_NAME](data.stock_name)

                    data.name = data.stock_name
                    data.price_change = data.change_value
                    data.price_change_rate = data.change_rate
                    data.mcap && (data.mcap = data.mcap * 10000)
                    data.capital && (data.capital = data.capital * 10000)
                    data.tcap && (data.tcap = data.tcap * 10000)
                    data.negotiable_capital && (data.negotiable_capital = data.negotiable_capital * 10000)
                    data.turnover && (data.turnover = data.turnover * 10000)
                    data.turnover_rate && (data.turnover_rate = data.turnover_rate * 100)
                    Reflect.deleteProperty(data, 'stock_name')
                    Reflect.deleteProperty(data, 'change_value')
                    Reflect.deleteProperty(data, 'change_rate')

                    this.symbol_type = data.symbol_type
                    this.stock_type = data.stock_type
                    this.close_price = data.close_price
                    this.negotiable_capital = data.negotiable_capital
                    this.mcap = data.mcap
                    this.capital = data.capital
                    this.tcap = data.tcap

                    this.$_setFiveOrderFields('buy', data)
                    this.$_setFiveOrderFields('sell', data)
                    this.$_resetDiff()

                    this.socketData = Object.assign({}, data)

                    pushData(FRAME_B_MARKET, {
                        code: this.full_code,
                        request_name: 'list_info',
                    })
                    // this.$_sendLink(this.linkAddress)
                    // this.$_rememberLink(this.linkAddress, this.linkIndex)
                },
            }

            getLimitStockData(params)
        },
        receiveSocketData(args) {
            let data = JSON.parse(args)[0]
            // let data = args[0][0]
            if (Object.is(data.mark, 1)) {
                this.socketData = {}
                this.mark = true
                this.$_clearFiveOrder()
                // 清空成交明细
                this.$refs.transactionComponent.clear()
                return false
            }

            const transferData = ['name', 'price_change', 'price_change_rate', ...apiFields, ...fiveFields].reduce(
                (obj, element) => {
                    if (Reflect.has(data, element)) {
                        obj[element] = Reflect.get(data, element)
                    }

                    return obj
                },
                {}
            )

            this.mark = false
            // 处理推送数据单位
            if (transferData.turnover) {
                transferData.turnover = transferData.turnover * 10000
            }
            if (transferData.negotiable_capital) {
                transferData.negotiable_capital = transferData.negotiable_capital * 10000
            }
            if (transferData.mcap) {
                transferData.mcap = transferData.mcap * 10000
            }
            if (transferData.tcap) {
                transferData.tcap = transferData.tcap * 10000
            }
            if (transferData.capital) {
                transferData.capital = transferData.capital * 10000
            }
            // 继承推送数据
            this.socketData = Object.assign({}, this.socketData, transferData)

            this.negotiable_capital = this.socketData.negotiable_capital
            this.mcap = this.socketData.mcap
            this.capital = this.socketData.capital
            this.tcap = this.socketData.tcap
            this.close_price = this.socketData.close_price

            // 计算五档 volume 差值
            this.$_setDiffValue('buy')
            this.$_setDiffValue('sell')

            this.$_setFiveOrderFields('buy', this.socketData)
            this.$_setFiveOrderFields('sell', this.socketData)

            if (data.transaction_type && data.transaction_volume) {
                let one = {
                    update_time: data.date,
                    price: this.socketData.price,
                    price_change: this.socketData.price_change,
                    volume: Math.floor(Math.round(data.transaction_volume / 100)),
                    transaction_type: data.transaction_type,
                    deal_count: data.deal_count,
                }
                this.$refs.transactionComponent.pushData(one)
            }
        },
        resetComponent() {
            // this.$_cancleSocket(this.linkIndex)
            UnSubscriptSockets(FRAME_B_MARKET)
            this.socketData = {}
            this.stock_type = null
            this.close_price = null
            this.negotiable_capital = null
            this.mcap = null
            this.capital = null
            this.tcap = null
            this.$_clearFiveOrder()
            this.$_nextResizeWindow()
        },
    },
    beforeDestroy() {
        goGoal.event.remove(FRAME_B_MARKET, this.receiveSocketData)
        UnSubscriptSockets(FRAME_B_MARKET)
        // this.$_eventBus.$off(SOCKET_B_MARKET, this.receiveSocketData)
        // this.$_cancleSocket(this.linkIndex)
        this.socketData = {}
    },
    watch: {
        full_code() {
            this.resetComponent()
            this.getInfoData()
        },
        [TAPE_ROWS]() {
            this.$_nextResizeWindow()
        },
        [TAPE_STYLE]() {
            this.$_nextResizeWindow()
        },
    },
}
</script>

<style lang="less" scoped>
.detail_table_B {
    cursor: pointer;
}
</style>
