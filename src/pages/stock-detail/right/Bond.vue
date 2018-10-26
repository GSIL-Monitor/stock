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
            <div class="detail_head_btn">
                <div class="detail_head_btn_skip">
                    <ButtonF10/>
                </div>
                <IsMyStock/>
            </div>
        </div>
        <div class="detail_info">
            <MarketInfo class="detail_table_Bond">
                <tbody>
                    <tr>
                        <td class="two-letters">总手</td>
                        <td>
                            <Volume
                                :val="socketData.volume"
                                :current_type="current_type"
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
                        <td class="two-letters">外盘</td>
                        <td>
                            <VolumeOuter
                                :val="socketData.volume_outer"
                                :current_type="current_type"
                            ></VolumeOuter>
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
                        <td class="two-letters" v-if="!is_buy_back">均价</td>
                        <td v-if="!is_buy_back">
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
                </tbody>
            </MarketInfo>
        </div>
        <OldFiveOrder
            :orderData="orderData"
            :close_price="close_price"
            :current_type="current_type"
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
    getBondData,
} from '@service/index.js'
import {
    pushData,
    UnSubscriptSockets,
} from '@c/utils/callQt.js'
import {
    FRAME_BOND_MARKET,
} from '../storage.js'
import {
    STOCK_NAME,
} from '@store/stock-detail-store/config/mutation-types.js'

import fiveOrderMixin from '../mixins/five-order-mixin.js'
import rightResizeMixin from '../mixins/right-resize-mixin.js'

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
import VolumeOuter from '@formatter/market-base/VolumeOuter.vue'
import VolumeInner from '@formatter/market-base/VolumeInner.vue'

export default {
    name: 'BondTemp',
    mixins: [
        fiveOrderMixin,
        rightResizeMixin,
    ],
    created() {
        goGoal.event.listen(FRAME_BOND_MARKET, this.receiveSocketData)
        this.getInfoData()
    },
    data() {
        return {
            socketData: {},
            is_buy_back: false, // 是否是回购 (回购无均价字段)

            symbol_type: null,
            close_price: null,
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
        VolumeOuter,
        VolumeInner,
    },
    computed: {
        ...mapState([
            'source',
            'stock_code',
            'full_code',
            'stock_name',
            'current_type',
        ]),
    },
    methods: {
        ...mapMutations([
            STOCK_NAME,
        ]),
        $_volumeDiff(val, oldVal) {
            return Math.floor((val - oldVal))
        },
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
                    Reflect.deleteProperty(data, 'change_value')
                    Reflect.deleteProperty(data, 'change_rate')

                    this.close_price = data.close_price
                    this.symbol_type = data.symbol_type

                    this.$_setFiveOrderFields('buy', data)
                    this.$_setFiveOrderFields('sell', data)
                    this.$_resetDiff()

                    this.socketData = Object.assign({}, data)

                    // 回购
                    this.is_buy_back =  Array.isArray(data.category) ? data.category.includes(3) : false

                    pushData(FRAME_BOND_MARKET, {
                        code: this.full_code,
                        request_name: 'hq/list_info',
                    })
                },
            }

            getBondData(params)
        },
        receiveSocketData(args) {
            const { receive_content } = JSON.parse(args)
            const data = receive_content[0]

            // 清空
            if (Object.is(data.mark, 1)) {
                this.socketData = {}
                this.$_clearFiveOrder()
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
                    deal_count: this.socketData.deal_count,
                }
                this.$refs.transactionComponent.pushData(one)
            }
        },
        resetComponent() {
            UnSubscriptSockets(FRAME_BOND_MARKET)
            this.socketData = {}
            this.close_price = null
            this.$_clearFiveOrder()
        },
    },
    beforeDestroy() {
        goGoal.event.remove(FRAME_BOND_MARKET, this.receiveSocketData)
        UnSubscriptSockets(FRAME_BOND_MARKET)
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
