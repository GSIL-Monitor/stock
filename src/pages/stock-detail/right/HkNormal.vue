<template>
<div
    class="detail detail_HkNormal"
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
                    v-if="canLoadF10"
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
        :current_type="current_type"
    />
    <AssociatedStock
        v-if="isHkStock"
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
    mapGetters,
    mapMutations,
} from 'vuex'
import {
    getHkStockData,
} from '@service/index.js'
import {
    pushData,
    UnSubscriptSockets,
} from '@c/utils/callQt.js'
import {
    FRAME_HK_STOCK,
} from '../storage.js'
import {
    STOCK_NAME,
} from '@store/stock-detail-store/config/mutation-types.js'

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
        rightResizeMixin,
    ],
    created() {
        goGoal.event.listen(FRAME_HK_STOCK, this.receiveSocketData)
        this.getInfoData()
    },
    data() {
        return {
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
            'canLoadF10',
        ]),
        canLoadSelfIdentify() {
            return this.loadIdentify && this.isHkStock
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

                    data.price_change = data.change_value
                    data.price_change_rate = data.change_rate
                    data.turnover && (data.turnover = data.turnover * 10000)
                    data.hk_tcap && (data.hk_tcap = data.hk_tcap * 10000)
                    data.tcap && (data.tcap = data.tcap * 10000)
                    data.turnover_rate && (data.turnover_rate = data.turnover_rate * 100)
                    Reflect.deleteProperty(data, 'change_value')
                    Reflect.deleteProperty(data, 'change_rate')

                    this.close_price = data.close_price
                    this.symbol_type  = data.symbol_type

                    this.socketData = Object.assign({}, data)

                    pushData(FRAME_HK_STOCK, {
                        code: this.full_code,
                        request_name: 'hq/list_info',
                    })
                    this.loadIdentify = true
                },
            }

            getHkStockData(params)
        },
        receiveSocketData(args) {
            const { receive_content } = JSON.parse(args)
            const data = receive_content[0]

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
            if (transferData.hk_tcap) {
                transferData.hk_tcap = transferData.hk_tcap * 10000
            }
            if (transferData.tcap) {
                transferData.tcap = transferData.tcap * 10000
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
        resetComponent() {
            this.loadIdentify = false
            UnSubscriptSockets(FRAME_HK_STOCK)
            this.socketData = {}
            this.close_price = null
            this.symbol_type = null

            this.$_nextResizeWindow()
        },
    },
    beforeDestroy() {
        goGoal.event.remove(FRAME_HK_STOCK, this.receiveSocketData)
        UnSubscriptSockets(FRAME_HK_STOCK)
        this.socketData = {}
    },
    watch: {
        full_code() {
            this.resetComponent()
            this.getInfoData()
        },
    },
}
</script>

<style lang="less">
    .detail_HkNormal {
        .detail_head {
            padding-left: 6px;
            padding-right: 6px;
        }
    }
</style>
