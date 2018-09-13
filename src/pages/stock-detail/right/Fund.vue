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
                :price="price"
                :price_change="price_change"
                :price_change_rate="price_change_rate"
            />
            <div class="detail_head_btn">
                <div class="detail_head_btn_skip">
                    <ButtonF10/>
                </div>
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
                                :val="avg_price"
                                :current_type="current_type"
                            ></CompareClose>
                        </td>
                        <td class="two-letters">量比</td>
                        <td>
                            <QuantityRatio :val="quantity_ratio"></QuantityRatio>
                        </td>
                    </tr>
                    <tr>
                        <td class="two-letters">总手</td>
                        <td>
                            <Volume :val="volume"></Volume>
                        </td>
                        <td class="two-letters">金额</td>
                        <td>
                            <Turnover :val="turnover"/>
                        </td>
                    </tr>
                    <tr>
                        <td class="two-letters">最高</td>
                        <td>
                            <CompareClose
                                :close_price="close_price"
                                :val="high_price"
                                :current_type="current_type"
                            ></CompareClose>
                        </td>
                        <td class="two-letters">最低</td>
                        <td>
                            <CompareClose
                                :close_price="close_price"
                                :val="low_price"
                                :current_type="current_type"
                            ></CompareClose>
                        </td>
                    </tr>
                    <tr>
                        <td class="two-letters">开盘</td>
                        <td>
                            <CompareClose
                                :close_price="close_price"
                                :val="open_price"
                                :current_type="current_type"
                            ></CompareClose>
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
                        <td class="two-letters">涨停</td>
                        <td>
                            <HighLimit
                                :val="close_price"
                                :current_type="current_type"
                            ></HighLimit>
                        </td>
                        <td class="two-letters">跌停</td>
                        <td>
                            <LowLimit
                                :val="close_price"
                                :current_type="current_type"
                            ></LowLimit>
                        </td>
                    </tr>
                    <tr>
                        <td class="two-letters">外盘</td>
                        <td>
                            <VolumeOuter
                                :val="volume_outer"
                            ></VolumeOuter>
                        </td>
                        <td class="two-letters">内盘</td>
                        <td>
                            <VolumeInner
                                :val="volume_inner"
                            ></VolumeInner>
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
        <div class="detail_extend" :style="extendStyles" ref="detailExtend">
            <StockTransaction ref="transactionComponent"/>
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

import ButtonF10 from '../components/ButtonF10'
import TitleTopMarket from './TitleTopMarket'
import OldFiveOrder from './OldFiveOrder'
import StockTransaction from './Transaction'
import MarketInfo from './MarketInfo'
import StockName from '@formatter/market-base/StockName'
import StockCode from '@formatter/market-base/StockCode'
import CompareClose from '@formatter/market-base/CompareClose'
import QuantityRatio from '@formatter/market-base/QuantityRatio'
import Volume from '@formatter/market-base/Volume'
import Turnover from '@formatter/market-base/Turnover'
import ClosePrice from '@formatter/market-base/ClosePrice'
import HighLimit from '@formatter/market-base/HighLimit'
import LowLimit from '@formatter/market-base/LowLimit'
import VolumeOuter from '@formatter/market-base/VolumeOuter'
import VolumeInner from '@formatter/market-base/VolumeInner'

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

            price: null,
            price_change: null,
            price_change_rate: null,
            mark: false,

            avg_price: null,
            quantity_ratio: null,
            volume: null,
            turnover: null,
            high_price: null,
            low_price: null,
            open_price: null,
            close_price: null,
            volume_outer: null,
            volume_inner: null,
        }
    },
    components: {
        TitleTopMarket,
        ButtonF10,
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

                    this.price = data.price
                    this.price_change = data.change_value
                    this.price_change_rate = data.change_rate

                    this.avg_price = data.avg_price
                    this.quantity_ratio = data.quantity_ratio
                    this.volume = data.volume ? data.volume / 100 : data.volume
                    this.turnover = data.turnover ? data.turnover * 10000 : data.turnover
                    this.high_price = data.high_price
                    this.low_price = data.low_price
                    this.open_price = data.open_price
                    this.volume_outer = data.volume_outer ? data.volume_outer / 100 : data.volume_outer
                    this.volume_inner = data.volume_inner ? data.volume_inner / 100 : data.volume_inner
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

            this.avg_price = socketData.avg_price
            this.quantity_ratio = socketData.quantity_ratio
            this.volume = socketData.volume ? socketData.volume / 100 : socketData.volume
            this.turnover = socketData.turnover ? socketData.turnover * 10000 : socketData.turnover
            this.high_price = socketData.high_price
            this.low_price = socketData.low_price
            this.open_price = socketData.open_price
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
