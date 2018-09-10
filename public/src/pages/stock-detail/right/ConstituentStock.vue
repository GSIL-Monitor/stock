<template>
    <div class="index_constituent">
        <div class="constituent_title">
            <span>成分股</span>
        </div>
        <sunTable
            :data="tableData"
            v-if="tableData.length"
            style="width: 100%;"
            @needMoreData="loadMore"
            @cell-dblclick="dblclick"
            ref="sunTableRef"
            class="constituent_table"
        >
            <sunTableColumn
                prop="name"
                label="名称"
                width="100"
            >
                <template scope="scope">
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
            >
                <template scope="scope">
                    <MarketValue
                        :val="scope.row.mcap"
                    ></MarketValue>
                </template>
            </sunTableColumn>
            <sunTableColumn
                prop="price_change_rate"
                label="涨跌幅"
                width="100"
            >
                <template scope="scope">
                    <PriceChangeRate
                        :val="scope.row.price_change_rate"
                        :price_change="scope.row.price_change"
                        :current_type="current_type"
                    ></PriceChangeRate>
                </template>
            </sunTableColumn>
        </sunTable>
    </div>
</template>
<script>
import StockName from '@formatter/market-base/StockName.vue'
import MarketValue from '@formatter/market-base/MarketValue.vue'
import PriceChangeRate from '@formatter/market-base/PriceChangeRate.vue'

import {
    sunTable,
    sunTableColumn
} from '@c/table'
import { getIndexStocks } from '@service/index'

export default {
    name: 'ConstituentStock',
    mounted() {
        window.addEventListener('resize', this.resizeTable)
        if (this.plate_code) {
            this.getTableData()
        }
    },
    updated() {
        this.resizeTable()
    },
    data() {
        return {
            sort_fields: 'price_change_rate',
            order_type: -1,
            page: 1,
            tableData: [],
        }
    },
    props: {
        plate_code: {
            type: String
        },
        current_type: {
            default: null,
        }
    },
    methods: {
        getTableData(number) {
            const fields = ['source', 'symbol_type', 'name', 'mcap', 'price_change', 'price_change_rate', 'code']
            const param = {
                options: {
                    rows: 30,
                    type: 9,
                    order: 'price_change_rate',
                    order_type: -1,
                    first_flag: 0,
                    plate_code: 'sh000001',
                    fields: fields.join(';'),
                    page: 1,
                },
                callback0: data => {
                    data.forEach((n) => {
                        n.mcap = n.mcap ? n.mcap * 10000 : n.mcap
                    })
                    this.tableData = this.tableData.concat(data)
                }
            }

            getIndexStocks(param)
        },
        loadMore() {
            console.log(1)
        },
        dblclick(args) {
            console.log(args)
            console.log('dblclick')
        },
        resizeTable() {
            this.$eventBus.$emit('resizeChange', this.$refs.sunTableRef.$refs.bodyWrapper)
        },
    },

    watch: {
        plate_code() {
            this.getTableData(1)
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeTable)
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

.constituent_title {
    flex: 0 0 26px;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
