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
                    @click="tapeSettings"
                />
            </div>
            <TitleTopMarket
                class="detail_head_market"
                :source="source"
                :symbol_type="symbol_type"
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
                                <Turnover
                                    :val="socketData.turnover"
                                />
                            </td>
                            <td class="two-letters">换手</td>
                            <td>
                                <TurnoverRate
                                    :val="socketData.turnover_rate"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">总手</td>
                            <td>
                                <Volume
                                    :val="socketData.volume"
                                />
                            </td>
                            <td class="two-letters">量比</td>
                            <td>
                                <QuantityRatio
                                    :val="socketData.quantity_ratio"
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
                                />
                            </td>
                            <td class="two-letters">振幅</td>
                            <td>
                                <Amplitude
                                    :val="socketData.amplitude"
                                    :current_type="current_type"
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
                                />
                            </td>
                            <td class="two-letters">最低</td>
                            <td>
                                <CompareClose
                                    :val="socketData.low_price"
                                    :close_price="close_price"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">外盘</td>
                            <td>
                                <VolumeOuter
                                    :val="socketData.volume_outer"
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">内盘</td>
                            <td>
                                <VolumeInner
                                    :val="socketData.volume_inner"
                                    :current_type="current_type"
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
        <AssociatedStock/>
        <div
            class="detail_extend"
            :style="extendStyles"
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
} from '@service/index'
import {
    initTapeDefault,
} from '../tape/tape-public-func'
import {
    TAPE_ROWS,
    TAPE_STYLE,
} from '../tape/tape-set-config'
import {
    SOCKET_B_MARKET,
} from '../storage'
import {
    STOCK_NAME,
} from '@store/stock-detail-store/config/mutation-types'

import socketMixin from '../mixins/socket-mixin'
import fiveOrderMixin from '../mixins/five-order-mixin'
import rightResizeMixin from '../mixins/right-resize-mixin'

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
            'current_type',
        ]),
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
        ]),
        initState() {
            initTapeDefault((key, val) => {
                if ([TAPE_ROWS, TAPE_STYLE].includes(key)) {
                    this[key] = val
                }
            })
        },
        tapeDefaultChanged(key, val) {
            this[key] = val
            this.nextResizeWindow()
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
                    this[STOCK_NAME](data.stock_name)
                    this.symbol_type = data.symbol_type
                    this.stock_type = data.stock_type
                    this.stock_name = data.stock_name
                    this.close_price = data.close_price
                    this.negotiable_capital = data.negotiable_capital ? data.negotiable_capital * 10000 : data.negotiable_capital
                    this.mcap = data.mcap ? data.mcap * 10000 : data.mcap
                    this.capital = data.capital ? data.capital * 10000 : data.capital
                    this.tcap = data.tcap ? data.tcap * 10000 : data.tcap

                    this.setFiveOrderFields('buy', data)
                    this.setFiveOrderFields('sell', data)

                    this.resetDiff()

                    this.socketData.price = data.price
                    this.socketData.price_change = data.change_value
                    this.socketData.price_change_rate = data.change_rate

                    this.socketData.turnover = data.turnover ? data.turnover * 10000 : data.turnover
                    this.socketData.turnover_rate = data.turnover_rate ? data.turnover_rate * 100 : data.turnover_rate
                    this.socketData.volume = data.volume ? data.volume / 100 : data.volume
                    this.socketData.quantity_ratio = data.quantity_ratio

                    this.socketData.avg_price = data.avg_price
                    this.socketData.amplitude = data.amplitude
                    this.socketData.open_price = data.open_price
                    this.socketData.high_price = data.high_price
                    this.socketData.low_price = data.low_price
                    this.socketData.volume_outer = data.volume_outer ? data.volume_outer / 100 : data.volume_outer
                    this.socketData.volume_inner = data.volume_inner ? data.volume_inner / 100 : data.volume_inner
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
            if (Object.is(data.mark, 1)) {
                this.socketData = {}
                this.mark = true
                this.clearFiveOrder()
                // 清空成交明细
                this.$refs.transactionComponent.clear()
                return false
            }

            this.mark = false
            const transferData = Object.assign({}, data)
            // 处理推送数据单位
            if (transferData.turnover) {
                transferData.turnover = transferData.turnover * 10000
            }
            if (transferData.volume) {
                transferData.volume = transferData.volume / 100
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
            if (transferData.volume_outer) {
                transferData.volume_outer = transferData.volume_outer / 100
            }
            if (transferData.volume_inner) {
                transferData.volume_inner = transferData.volume_inner / 100
            }
            // 继承推送数据
            this.socketData = Object.assign({}, this.socketData, transferData)

            this.negotiable_capital = this.socketData.negotiable_capital
            this.mcap = this.socketData.mcap
            this.capital = this.socketData.capital
            this.tcap = this.socketData.tcap
            this.close_price = this.socketData.close_price

            // 计算五档 volume 差值
            this.setDiffValue('buy')
            this.setDiffValue('sell')

            this.setFiveOrderFields('buy', this.socketData)
            this.setFiveOrderFields('sell', this.socketData)

            if (data.transaction_type && data.transaction_volume) {
                let one = {
                    update_time: data.date,
                    price: this.socketData.price,
                    price_change: this.socketData.price_change,
                    volume: Math.floor(Math.round(data.transaction_volume / 100)),
                    transaction_type: data.transaction_type,
                    deal_count: this.socketData.deal_count,
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
                this.nextResizeWindow()
                this.getInfoData()
            }
        },
    },
}
</script>

<style lang="less" scoped>
.detail_table_B {
    cursor: pointer;
}
</style>
