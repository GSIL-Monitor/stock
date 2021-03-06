<template>
<div class="detail detail_HkIndex">
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
                        />
                    </td>
                </tr>
                <tr>
                    <td class="two-letters">总量</td>
                    <td>--</td>
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
            </tbody>
        </MarketInfo>
    </div>
    <div
        :style="$_extendStyles"
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
    mapState,
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
    FRAME_HK_INDEX,
} from '../storage.js'
import {
    STOCK_NAME,
} from '@store/stock-detail-store/config/mutation-types.js'

import rightResizeMixin from '../mixins/right-resize-mixin.js'

import IsMyStock from './IsMyStock.vue'
import HkTimeBox from './HkTimeBox.vue'
import TitleTopMarket from './TitleTopMarket.vue'
import MarketInfo from './MarketInfo.vue'
import StockTransaction from './Transaction.vue'
import StockName from '@formatter/market-base/StockName.vue'
import StockCode from '@formatter/market-base/StockCode.vue'
import CompareClose from '@formatter/market-base/CompareClose.vue'
import ClosePrice from '@formatter/market-base/ClosePrice.vue'
import Turnover from '@formatter/market-base/Turnover.vue'

export default {
    name: 'HkIndex',
    created() {
        goGoal.event.listen(FRAME_HK_INDEX, this.receiveSocketData)
        this.getInfoData()
    },
    mixins: [
        rightResizeMixin,
    ],
    data() {
        return {
            socketData: {},

            symbol_type: null,
            close_price: null,
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
            'stock_name',
            'current_type',
        ]),
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
                    Reflect.deleteProperty(data, 'change_value')
                    Reflect.deleteProperty(data, 'change_rate')

                    this.close_price = data.close_price
                    this.symbol_type = data.symbol_type

                    this.socketData = Object.assign({}, data)

                    pushData(FRAME_HK_INDEX, {
                        code: this.full_code,
                        request_name: 'hq/list_info',
                    })
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
            // 继承推送数据
            this.socketData = Object.assign({}, this.socketData, transferData)
            // 不清空数据
            this.close_price = this.socketData.close_price

            if (data.transaction_type && !Object.is(data.transaction_type, 3) && Object.is(data.transaction_volume, 0)) {
                let one = {
                    update_time: data.date,
                    price: this.socketData.price,
                    price_change: this.socketData.price_change,
                    volume: data.transaction_volume,
                    transaction_type: data.transaction_type,
                }
                this.$refs.transactionComponent.pushData(one)
            }
        },
        resetComponent() {
            UnSubscriptSockets(FRAME_HK_INDEX)
            this.socketData = {}
            this.close_price = null
        },
    },
    beforeDestroy() {
        goGoal.event.remove(FRAME_HK_INDEX, this.receiveSocketData)
        UnSubscriptSockets(FRAME_HK_INDEX)
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

<style lang="less" scoped>
    .detail_head_btn {
        justify-content: flex-end;
    }
    .detail_HkIndex {
        .detail_head {
            padding-left: 6px;
            padding-right: 6px;
        }
    }
</style>
