<template>
    <div class="detail">
        <!-- 顶部信息 -->
        <div class="detail_head">
            <div class="detail_head_title">
                <div class="title_left">
                    <StockName
                        class="title_left_name"
                        :val="stock_name"
                        :current_type="current_type"
                    ></StockName>
                    <StockCode
                        class="title_left_code"
                        :val="stock_code"
                    ></StockCode>
                </div>
            </div>
            <TitleTopMarket
                class="detail_head_market"
                :source="source"
                :symbol_type="symbol_type"
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
        <div class="detail_info">
            <MarketInfo class="detail_table_Fund">
                <tbody>
                    <tr>
                        <td class="two-letters">均价</td>
                        <td>
                            <CompareClose
                                :close_price="close_price"
                                :val="socketData.avg_price"
                                :current_type="current_type"
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
                        <td class="two-letters">总手</td>
                        <td>
                            <Volume
                                :val="socketData.volume"
                            />
                        </td>
                        <td class="two-letters">金额</td>
                        <td>
                            <Turnover
                                :val="socketData.turnover"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td class="two-letters">最高</td>
                        <td>
                            <CompareClose
                                :close_price="close_price"
                                :val="socketData.high_price"
                                :current_type="current_type"
                            />
                        </td>
                        <td class="two-letters">最低</td>
                        <td>
                            <CompareClose
                                :close_price="close_price"
                                :val="socketData.low_price"
                                :current_type="current_type"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td class="two-letters">开盘</td>
                        <td>
                            <CompareClose
                                :close_price="close_price"
                                :val="socketData.open_price"
                                :current_type="current_type"
                            />
                        </td>
                        <td class="two-letters">昨收</td>
                        <td>
                            <ClosePrice
                                :val="close_price"
                                :current_type="current_type"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td class="two-letters">涨停</td>
                        <td>
                            <HighLimit
                                :val="close_price"
                                :current_type="current_type"
                            />
                        </td>
                        <td class="two-letters">跌停</td>
                        <td>
                            <LowLimit
                                :val="close_price"
                                :current_type="current_type"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td class="two-letters">外盘</td>
                        <td>
                            <VolumeOuter
                                :val="socketData.volume_outer"
                            />
                        </td>
                        <td class="two-letters">内盘</td>
                        <td>
                            <VolumeInner
                                :val="socketData.volume_inner"
                            />
                        </td>
                    </tr>
                </tbody>
            </MarketInfo>
        </div>
        <OldFiveOrder
            :orderData="orderData"
            :close_price="close_price"
            :stockType="current_type"
        />
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
    mapState
} from 'vuex'
import {
    getFundData,
} from '@service/index'
import {
    SOCKET_FUND_MARKET,
} from '../storage'

import socketMixin from '../mixins/socket-mixin'
import fiveOrderMixin from '../mixins/five-order-mixin'
import rightResizeMixin from '../mixins/right-resize-mixin'

import ButtonF10 from '../components/ButtonF10.vue'
import IsMyStock from './IsMyStock.vue'
import TitleTopMarket from './TitleTopMarket.vue'
import OldFiveOrder from './OldFiveOrder.vue'
import StockTransaction from './Transaction.vue'
import MarketInfo from './MarketInfo.vue'
import StockName from '@formatter/market-base/StockName.vue'
import StockCode from '@formatter/market-base/StockCode.vue'
import CompareClose from '@formatter/market-base/CompareClose.vue'
import QuantityRatio from '@formatter/market-base/QuantityRatio.vue'
import Volume from '@formatter/market-base/Volume.vue'
import Turnover from '@formatter/market-base/Turnover.vue'
import ClosePrice from '@formatter/market-base/ClosePrice.vue'
import HighLimit from '@formatter/market-base/HighLimit.vue'
import LowLimit from '@formatter/market-base/LowLimit.vue'
import VolumeOuter from '@formatter/market-base/VolumeOuter.vue'
import VolumeInner from '@formatter/market-base/VolumeInner.vue'

export default {
    name: 'FundTemp',
    mixins: [
        socketMixin,
        fiveOrderMixin,
        rightResizeMixin,
    ],
    created() {
        this.$eventBus.$on(SOCKET_FUND_MARKET, this.receiveSocketData)
        this.getInfoData()
    },
    data() {
        return {
            linkIndex: 0,
            socketData: {},
            symbol_type: null,
            stock_name: null,
            close_price: null,
            mark: false,
        }
    },
    components: {
        TitleTopMarket,
        ButtonF10,
        IsMyStock,
        OldFiveOrder,
        StockTransaction,
        MarketInfo,
        StockName,
        StockCode,
        CompareClose,
        QuantityRatio,
        Volume,
        Turnover,
        ClosePrice,
        HighLimit,
        LowLimit,
        VolumeOuter,
        VolumeInner,
    },
    computed: {
        ...mapState([
            'source',
            'stock_code',
            'full_code',
            'current_type',
        ]),
        linkAddress() {
            return `request_name:push/hq/list_info|request_param:fullcodes=${this.full_code}|request_id:${SOCKET_FUND_MARKET}|first_push:true`
        },
    },
    methods: {
        getInfoData() {
            const params = {
                options: {
                    fullcode: this.full_code
                },
                callback0: data => {
                    this.stock_name = data.stock_name
                    this.close_price = data.close_price
                    this.symbol_type = data.symbol_type

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

                    this.socketData.price = data.price
                    this.socketData.price_change = data.change_value
                    this.socketData.price_change_rate = data.change_rate

                    this.socketData.avg_price = data.avg_price
                    this.socketData.quantity_ratio = data.quantity_ratio
                    this.socketData.volume = data.volume ? data.volume / 100 : data.volume
                    this.socketData.turnover = data.turnover ? data.turnover * 10000 : data.turnover
                    this.socketData.high_price = data.high_price
                    this.socketData.low_price = data.low_price
                    this.socketData.open_price = data.open_price
                    this.socketData.volume_outer = data.volume_outer ? data.volume_outer / 100 : data.volume_outer
                    this.socketData.volume_inner = data.volume_inner ? data.volume_inner / 100 : data.volume_inner
                },
                afterResponse: () => {
                    this.sendLink(this.linkAddress)
                    this.rememberLink(this.linkAddress, this.linkIndex)
                },
            }
            getFundData(params)
        },
        receiveSocketData(...args) {
            let data = args[0][0]
            // 清空
            if (Object.is(data.mark, 1)) {
                this.socketData = {}
                this.clearFiveOrder()
                // 清空成交明细
                this.$refs.transactionComponent.clear()
                return false
            }
            const transferData = Object.assign({}, data)
            if (transferData.turnover) {
                transferData.turnover = transferData.turnover * 10000
            }
            if (transferData.volume) {
                transferData.volume = transferData.volume / 100
            }
            if (transferData.volume_outer) {
                transferData.volume_outer = transferData.volume_outer / 100
            }
            if (transferData.volume_inner) {
                transferData.volume_inner = transferData.volume_inner / 100
            }

            // 继承推送数据
            this.socketData = Object.assign({}, this.socketData, transferData)
            // 不清空数据
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
        this.$eventBus.$off(SOCKET_FUND_MARKET, this.receiveSocketData)
        this.cancleSocket(this.linkIndex)
        this.socketData = {}
    },
    watch: {
        full_code() {
            this.cancleSocket(this.linkIndex)
            this.socketData = {}
            this.getInfoData()
        },
    },
}
</script>

<style lang="less">

</style>
