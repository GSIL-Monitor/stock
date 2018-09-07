<template>
<div
    class="detail"
>
    <div
        class="detail_head"
    >
        <div
            class="detail_head_title"
        >
            <div
                class="title_left"
            >
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
        <div
            class="detail_head_btn"
        >
            <div
                class="detail_head_btn_skip"
            >
                <DefaultBtn
                    text="F10"
                    className="btn-content"
                    @click="skipF10"
                />
            </div>
        </div>
        <HkTimeBox/>
    </div>
    <div
        class="detail_info"
    >
        <MarketInfo
            class="detail_table_HkNormal"
        >
            <tbody>
                <tr>
                    <td
                        class="two-letters"
                    >均价</td>
                    <td>
                        <CompareClose
                            :close_price="close_price"
                            :val="avg_price"
                            :current_type="current_type"
                        />
                    </td>
                    <td
                        class="two-letters"
                    >换手</td>
                    <td>
                        <TurnoverRate
                            :val="turnover_rate"
                            :current_type="current_type"
                        />
                    </td>
                </tr>
                <tr>
                    <td
                        class="two-letters"
                    >总量</td>
                    <td>
                        <Volume
                            :val="volume"
                        />
                    </td>
                    <td
                        class="two-letters"
                    >金额</td>
                    <td>
                        <Turnover
                            :val="turnover"
                        />
                    </td>
                </tr>
                <tr>
                    <td
                        class="two-letters"
                    >港值</td>
                    <td>
                        <MarketValue
                            :val="hk_tcap"
                        />
                    </td>

                    <td
                        class="two-letters"
                    >总值</td>
                    <td>
                        <MarketValue
                            :val="tcap"
                        />
                    </td>
                </tr>
                <tr>
                    <td
                        class="two-letters"
                    >最高</td>
                    <td>
                        <CompareClose
                            :val="high_price"
                            :close_price="close_price"
                            :current_type="current_type"
                        />
                    </td>
                    <td
                        class="two-letters"
                    >最低</td>
                    <td>
                        <CompareClose
                            :val="low_price"
                            :close_price="close_price"
                            :current_type="current_type"
                        />
                    </td>
                </tr>
                <tr>
                    <td
                        class="two-letters"
                    >今开</td>
                    <td>
                        <CompareClose
                            :val="open_price"
                            :close_price="close_price"
                            :current_type="current_type"
                        />
                    </td>
                    <td
                        class="two-letters"
                    >昨收</td>
                    <td>
                        <ClosePrice
                            :val="close_price"
                            :current_type="current_type"
                        />
                    </td>
                </tr>
            </tbody>
        </MarketInfo>
    </div>
    <div
        class="detail_extend"
        :style="extendStyles"
        ref="detailExtend"
    >

    </div>
</div>
</template>

<script>
import {
    mapState,
} from 'vuex'
import socketMixin from './socket-mixin'
import rightResizeMixin from './right-resize-mixin'
import {
    getHkStockData,
} from '@service/'
import {
    SOCKET_HKSTOCK_MARKET,
} from '../storage'

import HkTimeBox from './HkTimeBox'
import DefaultBtn from './DefaultBtn'
import TitleTopMarket from './TitleTopMarket'
import MarketInfo from './MarketInfo'
import StockTransaction from './Transaction'

import StockName from '@formatter/market-base/StockName'
import StockCode from '@formatter/market-base/StockCode'
import CompareClose from '@formatter/market-base/CompareClose'
import TurnoverRate from '@formatter/market-base/TurnoverRate'
import Volume from '@formatter/market-base/Volume'
import Turnover from '@formatter/market-base/Turnover'
import MarketValue from '@formatter/market-base/MarketValue'
import ClosePrice from '@formatter/market-base/ClosePrice'

export default {
    name: 'HkNormal',
    mixins: [
        socketMixin,
        rightResizeMixin,
    ],
    created() {
        this.$eventBus.$on(SOCKET_HKSTOCK_MARKET, this.receiveSocketData)
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

            close_price: null,
            avg_price: null,
            turnover_rate: null,
            volume: null,
            turnover: null,
            hk_tcap: null,
            tcap: null,
            high_price: null,
            low_price: null,
            open_price: null,
        }
    },
    components: {
        HkTimeBox,
        DefaultBtn,
        TitleTopMarket,
        MarketInfo,
        StockTransaction,
        StockName,
        StockCode,
        CompareClose,
        TurnoverRate,
        Volume,
        Turnover,
        MarketValue,
        ClosePrice,
    },
    computed: {
        ...mapState([
            'source',
            'stock_code',
            'full_code',
            'current_type',
        ]),
        linkAddress() {
            return `request_name:push/hq/list_info|request_param:fullcodes=${this.full_code}|request_id:${SOCKET_HKSTOCK_MARKET}|first_push:true`
        },
    },
    methods: {
        skipF10() {

        },
        getInfoData() {
            const params = {
                options: {
                    fullcode: this.full_code
                },
                callback0: data => {
                    this.stock_name = data.stock_name
                    this.close_price = data.close_price
                    this.symbol_type  = data.symbol_type

                    this.price = data.price
                    this.price_change = data.change_value
                    this.price_change_rate = data.change_rate

                    this.close_price = data.close_price
                    this.avg_price = data.avg_price
                    this.turnover_rate = data.turnover_rate ? data.turnover_rate * 100 : data.turnover_rate
                    this.volume = data.volume
                    this.turnover = data.turnover ? data.turnover * 10000 : data.turnover
                    this.hk_tcap = data.hk_tcap
                    this.tcap = data.tcap
                    this.high_price = data.high_price
                    this.low_price = data.low_price
                    this.open_price = data.open_price
                },
                afterResponse: () => {
                    // this.sendLink(this.linkAddress)
                    // this.rememberLink(this.linkAddress, this.linkIndex)
                },
            }

            getHkStockData(params)
        },
        receiveSocketData(...args) {

        },
    },
    beforeDestroy() {
        this.$eventBus.$off(SOCKET_HKSTOCK_MARKET, this.receiveSocketData)
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
