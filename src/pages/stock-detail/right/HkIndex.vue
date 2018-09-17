<template>
<div class="detail">
    <div class="detail_head">
        <div class="detail_head_title">
            <div class="title_left">
                <StockName
                    class="title_left_name"
                    :val="stock_name"
                    :current_type="current_type"
                />
                <StockCode
                    class="title_left_code"
                    :val="stock_code"
                />
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
            <IsMyStock/>
        </div>
        <HkTimeBox/>
    </div>
    <div class="detail_info">
        <MarketInfo
            class="detail_table_HkIndex"
        >
            <tbody>
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
                        />
                    </td>
                </tr>
                <tr>
                    <td class="two-letters">总量</td>
                    <td>--</td>
                    <td class="two-letters">金额</td>
                    <td>
                        <Turnover
                            :val="turnover"
                        />
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
            </tbody>
        </MarketInfo>
    </div>
    <div
        :style="extendStyles"
        class="detail_extend"
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
    getHkStockData,
} from '@service/index'
import {
    SOCKET_HKINDEX_MARKET,
} from '../storage'

import socketMixin from '../mixins/socket-mixin'
import rightResizeMixin from '../mixins/right-resize-mixin'

import IsMyStock from './IsMyStock'
import HkTimeBox from './HkTimeBox'
import TitleTopMarket from './TitleTopMarket'
import MarketInfo from './MarketInfo'
import StockTransaction from './Transaction'
import StockName from '@formatter/market-base/StockName'
import StockCode from '@formatter/market-base/StockCode'
import CompareClose from '@formatter/market-base/CompareClose'
import ClosePrice from '@formatter/market-base/ClosePrice'
import Turnover from '@formatter/market-base/Turnover'

export default {
    name: 'HkIndex',
    created() {
        this.$eventBus.$on(SOCKET_HKINDEX_MARKET, this.receiveSocketData)
        this.getInfoData()
    },
    mixins: [
        socketMixin,
        rightResizeMixin,
    ],
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
            open_price: null,
            close_price: null,
            turnover: null,
            high_price: null,
            low_price: null,
        }
    },
    components: {
        StockName,
        StockCode,
        CompareClose,
        ClosePrice,
        Turnover,
        TitleTopMarket,
        MarketInfo,
        StockTransaction,
        HkTimeBox,
        IsMyStock,
    },
    computed: {
        ...mapState([
            'source',
            'stock_code',
            'full_code',
            'current_type',
        ]),
        linkAddress() {
            return `request_name:push/hq/list_info|request_param:fullcodes=${this.full_code}|request_id:${SOCKET_HKINDEX_MARKET}|first_push:true`
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

                    this.price = data.price
                    this.price_change = data.change_value
                    this.price_change_rate = data.change_rate
                    this.high_price = data.high_price
                    this.low_price = data.low_price
                    this.open_price = data.open_price
                    this.turnover = data.turnover ? data.turnover * 10000 : data.turnover
                },
                afterResponse: () => {
                    this.sendLink(this.linkAddress)
                    this.rememberLink(this.linkAddress, this.linkIndex)
                },
            }

            getHkStockData(params)
        },
        receiveSocketData(...args) {
            let data = args[0][0]

            // 清空
            this.mark = Object.is(data.mark, 1) ? true : false
            // 继承推送数据
            this.socketData = Object.assign({}, this.socketData, data)
            let socketData = this.socketData

            this.price = socketData.price
            this.price_change = socketData.price_change
            this.price_change_rate = socketData.price_change_rate

            this.close_price = socketData.close_price
            this.high_price = socketData.high_price
            this.low_price = socketData.low_price
            this.open_price = socketData.open_price
            this.turnover = socketData.turnover ? socketData.turnover * 10000 : socketData.turnover

            if (data.transaction_type && !Object.is(data.transaction_type, 3) && Object.is(data.transaction_volume, 0)) {
                let one = {
                    update_time: data.date,
                    price: socketData.price,
                    price_change: socketData.price_change,
                    volume: data.transaction_volume,
                    transaction_type: data.transaction_type,
                }
                this.$refs.transactionComponent.pushData(one)
            }
        },
    },
    beforeDestroy() {
        this.$eventBus.$off(SOCKET_HKINDEX_MARKET, this.receiveSocketData)
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

<style lang="less" scoped>
    .detail_head_btn {
        justify-content: flex-end;
    }
</style>

