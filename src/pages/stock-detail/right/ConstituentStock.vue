<template>
    <div class="index_constituent">
        <div class="view_title">
            <span>成分股</span>
        </div>
        <!-- <sunTable
            :data="dataStore"
            style="width: 100%;"
            @needMoreData="loadMore"
            @cell-dblclick="dblClick"
            @sort-change="sortChange"
            :default-sort="{
                prop: 'price_change_rate',
                order: 'descending',
            }"
            :isInfiniteScrollDisabled="disableInfiniteScroll"
            class="constituent_table"
            ref="sunTableRef"
        > -->
         <sunTable
            v-if="dataStore.length"
            :data="dataStore"
            style="width: 100%;"
            @needMoreData="loadMore"
            @cell-dblclick="dblClick"
            @sort-change="sortChange"
            :isInfiniteScrollDisabled="disableInfiniteScroll"
            class="constituent_table"
            ref="sunTableRef"
        >
            <template slot="empty">
                <div class="loading"></div>
            </template>
            <sunTableColumn
                prop="name"
                label="名称"
                width="100"
                sortable="custom"
                :sort-orders="['descending', 'ascending']"
            >
                <template slot-scope="scope">
                    <StockName
                        :val="scope.row.name"
                        :current_type="current_type"
                    ></StockName>
                </template>
            </sunTableColumn>
            <sunTableColumn
                prop="mcap"
                label="总市值"
                width="100"
                sortable="custom"
                :sort-orders="['descending', 'ascending']"
            >
                <template slot-scope="scope">
                    <MarketValue
                        :val="scope.row.mcap"
                    ></MarketValue>
                </template>
            </sunTableColumn>
            <sunTableColumn
                prop="price_change_rate"
                label="涨跌幅"
                width="100"
                sortable="custom"
                :sort-orders="['descending', 'ascending']"
            >
                <template slot-scope="scope">
                    <PriceChangeRate
                        :val="scope.row.price_change_rate"
                        :price_change="scope.row.price_change"
                        :current_type="current_type"
                    ></PriceChangeRate>
                </template>
            </sunTableColumn>
        </sunTable>
        <div
            v-if="noData"
            class="extend_nodata"
        >
            暂无成分股
        </div>
    </div>
</template>
<script>
import {
    mapState,
    mapActions,
} from 'vuex'
import {
    GET_HS_INDEX_CONSTITUENT_LIST,
} from '@store/stock-detail-store/config/action-types.js'

import {
    sunTable,
    sunTableColumn
} from '@c/table'
import StockName from '@formatter/market-base/StockName.vue'
import MarketValue from '@formatter/market-base/MarketValue.vue'
import PriceChangeRate from '@formatter/market-base/PriceChangeRate.vue'

export default {
    name: 'ConstituentStock',
    created() {
        if (this.full_code) {
            this.fetchData()
        }
    },
    data() {
        return {
            sortFields: 'price_change_rate',
            orderType: -1,
            page: 1,
            busy: true,
            dataStore: [],
            noData: false,
            ROWS: 30,
        }
    },
    computed: {
        ...mapState([
            'current_type',
            'full_code',
            'source',
        ]),
        paramType() {
            return Object.is(this.source, 'BK') ? 3 : 9
        },
        disableInfiniteScroll() {
            return this.busy
        },
    },
    methods: {
        ...mapActions({
            getIndexStocks: GET_HS_INDEX_CONSTITUENT_LIST,
        }),
        fetchData() {
            const fields = [
                'source', 'symbol_type', 'name', 'code',
                'price_change', 'price_change_rate', 'mcap',
            ]
            const param = {
                options: {
                    rows: this.ROWS,
                    first_flag: 0,
                    type: this.paramType,
                    order: this.sortFields,
                    order_type: this.orderType,
                    plate_code: this.full_code,
                    fields: fields.join(';'),
                    page: this.page,
                },
                callback0: data => {
                    data.forEach((n) => {
                        n.mcap = n.mcap ? n.mcap * 10000 : n.mcap
                    })
                    this.dataStore = this.dataStore.concat(data)

                    if (data.length < this.ROWS) {
                        this.busy = true
                    } else {
                        // 待 dom 状态更新之后，设回可加载
                        this.$nextTick(() => {
                            this.busy = false
                        })
                    }
                },
                callback1001: () => {
                    this.busy = true
                    // 无数据提示
                    if (Object.is(this.page, 1)) {
                        this.noData = true
                    }
                },
            }

            this.getIndexStocks(param)
        },
        loadMore() {
            this.busy = true
            this.page++
            // 加载数据
            this.fetchData()
        },
        dblClick(args) {
            console.log(args)
            console.log('dblclick')
        },
        sortChange(args) {
            let { order, prop } = args
            if (this.dataStore.length !== 0) {
                this.resetState()
            }
            this.sortFields = prop
            this.orderType = Object.is('ascending', order) ? 1 : -1
            this.fetchData()
        },
        resetState() {
            this.page = 1
            this.busy = true
            if (Object.is(this.noData, false)) {
                this.$refs.sunTableRef.$refs.bodyWrapper.scrollTop = 0
            }
            this.noData = false
            this.dataStore = []
        },
    },
    watch: {
        full_code() {
            this.resetState()
            this.fetchData()
        },
    },
    beforeDestroy() {

    },
    components: {
        sunTable,
        sunTableColumn,
        StockName,
        MarketValue,
        PriceChangeRate,
    },
}
</script>

<style lang="less">
.index_constituent {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.el-table {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.el-table__header-wrapper {
    flex-shrink: 0;
}

.el-table__body-wrapper {
    flex: 1;
}
</style>
