
<script>
import {
    getRelatedStock
} from '@service/index.js'
import {
    pushData,
    UnSubscriptSockets,
} from '@c/utils/callQt.js'
import {
    FRAME_RELATED_STOCK,
} from '../storage.js'
import {
    JUMP_FROM_TRADE,
} from '@store/stock-detail-store/config/mutation-types.js'

import tradeRelatedMixin from '../mixins/trade-related-mixin.js'

export default {
    name: 'RelatedStocks',
    mixins: [
        tradeRelatedMixin,
    ],
    watch: {
        full_code() {
            if (this.isTradeStock) {
                this[JUMP_FROM_TRADE](false)
                return false
            }
            this.$_resetState()
            this.fetchData()
        },
    },
    computed: {
        subFullCode() {
            return this.apiData.map((element) => {
                return element.full_code
            })
        },
        tableClasses() {
            return [
                'related-stock-table'
            ]
        },
    },
    methods: {
        sortChange(...args) {
            let { field, canSort} = args[1]
            if (canSort) {
                UnSubscriptSockets(FRAME_RELATED_STOCK)
                this.$_sortNormal(field)
            }
        },
        indexChanged(start, end) {
            pushData(FRAME_RELATED_STOCK, {
                index: `${start};${end}`,
                stockPool: this.subFullCode.join(';'),
                field: this.subFields,
                sort: this.sortOBJ.order,
                sortType: this.sortOBJ.order_type,
            })
        },
        fetchData() {
            this.$_addLoadding()
            const params = {
                options: {
                    order: this.sortOBJ.order,
                    order_type: this.sortOBJ.order_type,
                    page: this.page,
                    full_code: this.full_code,
                    rows: this.ROWS,
                    fields: 'full_code',
                },
                callback0: (data) => {
                    this.apiData = data
                    this.dataStore = data.map((element, index) => {
                        return {
                            index: index,
                        }
                    })
                },
                callback1001: () => {

                },
                afterResponse: () => {
                    this.$_removeLoadding()
                },
            }

            getRelatedStock(params)
        },
    },
    created() {
        goGoal.event.listen(FRAME_RELATED_STOCK, this.$_receiveFrameData)
    },
    beforeDestroy() {
        goGoal.event.remove(FRAME_RELATED_STOCK, this.$_receiveFrameData)
        UnSubscriptSockets(FRAME_RELATED_STOCK)
    },
}
</script>

<style lang="less">
.related-stock-table {
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
        content: '暂无关联品种';
        margin-top: 0;
    }
}
</style>
