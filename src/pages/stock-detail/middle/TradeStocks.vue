<script>
import {
    getSameIndustryStock,
    getHKSameIndustryStock,
} from '@service/index.js'
import {
    pushData,
    UnSubscriptSockets,
} from '@c/utils/callQt.js'
import {
    FRAME_TRADE_STOCK,
} from '../storage.js'
import {
    JUMP_FROM_TRADE,
} from '@store/stock-detail-store/config/mutation-types.js'

import tradeRelatedMixin from '../mixins/trade-related-mixin.js'

export default {
    name: 'TradeStocks',
    mixins: [
        tradeRelatedMixin,
    ],
    computed: {
        listTradeApi() {
            if (this.isAStock) {
                return getSameIndustryStock
            } else if (this.isHkStock) {
                return getHKSameIndustryStock
            }
        },
        subFullCode() {
            return this.apiData.map((element) => {
                return element.fullcode
            })
        },
        tableClasses() {
            return [
                'trade-stock-table'
            ]
        },
    },
    watch: {
        full_code() {
            if (this.isJumpFromTradeStock) {
                this[JUMP_FROM_TRADE](false)
                return false
            }
            this.$_resetState()
            this.fetchData()
        },
    },
    methods: {
        sortChange(...args) {
            let { field, canSort} = args[1]
            if (canSort) {
                UnSubscriptSockets(FRAME_TRADE_STOCK)
                this.$_sortNormal(field)
            }
        },
        indexChanged(start, end) {
            pushData(FRAME_TRADE_STOCK, {
                index: `${start};${end}`,
                stockPool: this.subFullCode.join(';'),
                field: this.subFields,
                sort: this.sortOBJ.order,
                sortType: this.sortOBJ.order_type,
            })
        },
        fetchData() {
            let api = this.listTradeApi
            if (!api) { return false }

            this.$_addLoadding()
            const filterFields = ['code', 'symbol_type', 'source', 'fullcode', 'plate_code']

            const params = {
                options: {
                    order: this.sortOBJ.order,
                    order_type: this.sortOBJ.order_type,
                    page: this.page,
                    stock_code: this.stock_code,
                    rows: this.ROWS,
                    fields: filterFields.join(';'),
                },
                callback0: (data) => {
                    let code = data[0].code
                    let plate_code = data[0].plate_code

                    if (code === 200) {
                        // 无申万二级行业
                    } else if (code === 300) {
                        // 无同业股票
                    } else {
                        // 正常情况
                        this.apiData = Object.freeze(data)
                        this.dataStore = data.map((element, index) => {
                            return {
                                index: index,
                            }
                        })
                    }

                    if (this.isAStock) {
                        this.$_eventBus.$emit('tradeCode', {
                            plate_code: plate_code,
                        })
                    }
                },
                callback1001: () => {
                    if (this.isAStock) {
                        this.$_eventBus.$emit('tradeCode', {
                            plate_code: null,
                        })
                    }
                },
                afterResponse: () => {
                    this.$_removeLoadding()
                },
            }

            api(params)
        },
    },
    created() {
        goGoal.event.listen(FRAME_TRADE_STOCK, this.$_receiveFrameData)
    },
    beforeDestroy() {
        goGoal.event.remove(FRAME_TRADE_STOCK, this.$_receiveFrameData)
        UnSubscriptSockets(FRAME_TRADE_STOCK)
    },
}
</script>

<style lang="less">
.trade-stock-table {
    .ht_table-fixed-head-container {
        z-index: 2;
    }
    .trade_related_click {
        cursor: pointer;
    }
    .without-data:before{
        width: 0;
        height: 0;
    }
    .without-data:after{
        content: '暂无同业股票';
        margin-top: 0;
    }
}
</style>
