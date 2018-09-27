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
            :price="socketData.price"
            :price_change="socketData.price_change"
            :price_change_rate="socketData.price_change_rate"
        />
        <div
            class="detail_head_btn"
        >
            <div
                class="detail_head_btn_skip"
            >
                <ButtonF10
                    v-if="isShowF10"
                />
            </div>
            <div class="detail_head_btn_right">
                <StockIdentify
                    v-if="canLoadSelfIdentify"
                    :full_code="full_code"
                />
                <IsMyStock/>
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
                            :val="socketData.avg_price"
                            :current_type="current_type"
                        />
                    </td>
                    <td
                        class="two-letters"
                    >换手</td>
                    <td>
                        <TurnoverRate
                            :val="socketData.turnover_rate"
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
                            :val="socketData.volume"
                            :current_type="current_type"
                        />
                    </td>
                    <td
                        class="two-letters"
                    >金额</td>
                    <td>
                        <Turnover
                            :val="socketData.turnover"
                        />
                    </td>
                </tr>
                <tr>
                    <td
                        class="two-letters"
                    >港值</td>
                    <td>
                        <MarketValue
                            :val="socketData.hk_tcap"
                        />
                    </td>

                    <td
                        class="two-letters"
                    >总值</td>
                    <td>
                        <MarketValue
                            :val="socketData.tcap"
                        />
                    </td>
                </tr>
                <tr>
                    <td
                        class="two-letters"
                    >最高</td>
                    <td>
                        <CompareClose
                            :val="socketData.high_price"
                            :close_price="close_price"
                            :current_type="current_type"
                        />
                    </td>
                    <td
                        class="two-letters"
                    >最低</td>
                    <td>
                        <CompareClose
                            :val="socketData.low_price"
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
                            :val="socketData.open_price"
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
    <HkOrder
        class="detail_order"
        :orderData="orderData"
        :close_price="close_price"
        :stockType="current_type"
    />
    <AssociatedStock
        v-if="isHkStock"
        @resizeWindow="resizeWindow"
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
    mapState,
    mapGetters,
    mapMutations,
} from 'vuex'
import {
    getHkStockData,
} from '@service/index.js'
import {
    SOCKET_HKSTOCK_MARKET,
} from '../storage.js'
import {
    STOCK_NAME,
} from '@store/stock-detail-store/config/mutation-types.js'

import socketMixin from '../mixins/socket-mixin.js'
import rightResizeMixin from '../mixins/right-resize-mixin.js'

import HkTimeBox from './HkTimeBox.vue'
import ButtonF10 from '../components/ButtonF10.vue'
import IsMyStock from './IsMyStock.vue'
import TitleTopMarket from './TitleTopMarket.vue'
import MarketInfo from './MarketInfo.vue'
import StockIdentify from './StockIdentify.vue'
import AssociatedStock from './AssociatedStock.vue'
import HkOrder from './HkOrder.vue'
import StockTransaction from './Transaction.vue'
import StockName from '@formatter/market-base/StockName.vue'
import StockCode from '@formatter/market-base/StockCode.vue'
import CompareClose from '@formatter/market-base/CompareClose.vue'
import TurnoverRate from '@formatter/market-base/TurnoverRate.vue'
import Volume from '@formatter/market-base/Volume.vue'
import Turnover from '@formatter/market-base/Turnover.vue'
import MarketValue from '@formatter/market-base/MarketValue.vue'
import ClosePrice from '@formatter/market-base/ClosePrice.vue'

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
            close_price: null,

            loadIdentify: false,
        }
    },
    components: {
        HkTimeBox,
        ButtonF10,
        IsMyStock,
        StockIdentify,
        AssociatedStock,
        TitleTopMarket,
        MarketInfo,
        HkOrder,
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
            'stock_name',
            'current_type',
        ]),
        ...mapGetters([
            'isHkStock',
        ]),
        linkAddress() {
            return `request_name:push/hq/list_info|request_param:fullcodes=${this.full_code}|request_id:${SOCKET_HKSTOCK_MARKET}|first_push:true`
        },
        canLoadSelfIdentify() {
            return this.loadIdentify && this.isHkStock
        },
        isShowF10() {
            return this.isHkStock
        },
        orderData() {
            return {
                buy: [
                    {
                        now_price: this.socketData.buy1_price,
                        now_volume: this.socketData.buy1_volume,
                    },
                ],
                sell: [
                    {
                        now_price: this.socketData.sell1_price,
                        now_volume: this.socketData.sell1_volume,
                    },
                ],
            }
        },
    },
    methods: {
        ...mapMutations([
            STOCK_NAME,
        ]),
        getInfoData() {
            const params = {
                options: {
                    fullcode: this.full_code
                },
                callback0: data => {
                    if (data.fullcode !== this.full_code) {
                        return false
                    }
                    this[STOCK_NAME](data.stock_name)

                    this.close_price = data.close_price
                    this.symbol_type  = data.symbol_type

                    this.socketData.price = data.price
                    this.socketData.price_change = data.change_value
                    this.socketData.price_change_rate = data.change_rate

                    this.socketData.buy1_price = data.buy1_price
                    this.socketData.sell1_price = data.sell1_price
                    this.socketData.buy1_volume = data.buy1_volume
                    this.socketData.sell1_volume = data.sell1_volume

                    this.socketData.avg_price = data.avg_price
                    this.socketData.turnover_rate = data.turnover_rate ? data.turnover_rate * 100 : data.turnover_rate
                    this.socketData.volume = data.volume
                    this.socketData.turnover = data.turnover ? data.turnover * 10000 : data.turnover
                    this.socketData.hk_tcap = data.hk_tcap
                    this.socketData.tcap = data.tcap
                    this.socketData.high_price = data.high_price
                    this.socketData.low_price = data.low_price
                    this.socketData.open_price = data.open_price

                    this.sendLink(this.linkAddress)
                    this.rememberLink(this.linkAddress, this.linkIndex)
                    this.loadIdentify = true
                },
            }

            getHkStockData(params)
        },
        receiveSocketData(...args) {
            let data = args[0][0]
            // 清空
            if (Object.is(data.mark, 1)) {
                this.socketData = {}
                // 清空成交明细
                this.$refs.transactionComponent.clear()
                return false
            }
            const transferData = Object.assign({}, data)
            if (transferData.turnover) {
                transferData.turnover = transferData.turnover * 10000
            }
            // 继承推送数据
            this.socketData = Object.assign({}, this.socketData, transferData)
            // 不清空数据
            this.close_price = this.socketData.close_price

            if (data.transaction_type && data.transaction_volume) {
                let one = {
                    update_time: data.date,
                    price: this.socketData.price,
                    price_change: this.socketData.price_change,
                    volume: data.transaction_volume,
                    transaction_type: data.transaction_type,
                    deal_count: this.socketData.deal_count,
                }
                this.$refs.transactionComponent.pushData(one)
            }
        },
    },
    beforeDestroy() {
        this.$eventBus.$off(SOCKET_HKSTOCK_MARKET, this.receiveSocketData)
        this.cancleSocket(this.linkIndex)
        this.socketData = {}
    },
    watch: {
        full_code() {
            this.loadIdentify = false
            this.cancleSocket(this.linkIndex)
            this.socketData = {}
            this.nextResizeWindow()
            this.getInfoData()
        },
    },
}
</script>

<style lang="less">

</style>
