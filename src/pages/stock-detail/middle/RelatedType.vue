
<script>
import {
    getRelatedStock
} from '@service/index.js'
import {
    FRAME_RELATED_STOCK,
} from '../storage.js'
import {
    pushData,
    UnSubscriptSockets,
} from '@c/utils/callQt.js'

import tradeRelatedMixin from '../mixins/trade-related-mixin.js'

export default {
    name: 'RelatedStocks',
    mixins: [
        tradeRelatedMixin,
    ],
    watch: {
        full_code() {
            this.resetState()
            this.fetchData()
        },
    },
    computed: {
        subFullCode() {
            return this.apiData.map((element) => {
                return element.full_code
            })
        },
    },
    methods: {
        loadMore() {

        },
        sortChange(...args) {
            let { field, canSort} = args[1]
            if (canSort) {
                UnSubscriptSockets(FRAME_RELATED_STOCK)
                this.sortNormal()
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
            this.addLoadding()
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
                    this.removeLoadding()
                },
            }

            getRelatedStock(params)
        },
    },
    created() {
        goGoal.event.listen(FRAME_RELATED_STOCK, this.receiveFrameData)
    },
    beforeDestroy() {
        goGoal.event.remove(FRAME_RELATED_STOCK, this.receiveFrameData)
        UnSubscriptSockets(FRAME_RELATED_STOCK)
    },
}
</script>

<style lang="less">
.ht_table-fixed-head-container {
    z-index: 2;
}
</style>
