
<script>
import {
    getSameIndustryStock,
    getHKSameIndustryStock,
} from '@service/index.js'
import {
    FRAME_TRADE_STOCK,
} from '../storage.js'
import {
    pushData,
    UnSubscriptSockets,
} from '@c/utils/callQt.js'

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
    },
    watch: {
        full_code() {
            this.resetState()
            this.fetchData()
        },
    },
    methods: {
        loadMore() {

        },
        sortChange(...args) {
            let { field, canSort} = args[1]
            if (canSort) {
                UnSubscriptSockets(FRAME_TRADE_STOCK)
                this.sortNormal()
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
            this.addLoadding()
            const params = {
                options: {
                    order: this.sortOBJ.order,
                    order_type: this.sortOBJ.order_type,
                    page: this.page,
                    stock_code: this.stock_code,
                    rows: this.ROWS,
                    fields: this.isAStock ? 'fullcode;plate_code' : 'fullcode',
                },
                callback0: (data) => {
                    this.apiData = Object.freeze(data)
                    if (this.isAStock) {
                        this.$eventBus.$emit('tradeCode', {
                            plate_code: data[0].plate_code,
                        })
                    }

                    this.dataStore = data.map((element, index) => {
                        return {
                            index: index,
                        }
                    })
                },
                callback1001: () => {
                    if (this.isAStock) {
                        this.$eventBus.$emit('tradeCode', {
                            plate_code: null,
                        })
                    }
                },
                afterResponse: () => {
                    this.removeLoadding()
                },
            }

            api(params)
        },
    },
    created() {
        goGoal.event.listen(FRAME_TRADE_STOCK, this.receiveFrameData)
    },
    beforeDestroy() {
        goGoal.event.remove(FRAME_TRADE_STOCK, this.receiveFrameData)
        UnSubscriptSockets(FRAME_TRADE_STOCK)
    },
}
</script>

<style lang="less">
.ht_table-fixed-head-container {
    z-index: 2;
}
</style>
