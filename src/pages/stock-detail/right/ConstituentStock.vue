<template>
    <div class="index_constituent">
        <div class="view_title">
            <span>成分股</span>
            <LoadMore
                v-if="dataStore.length"
                @on-click="moduleJump"
            />
        </div>
        <ht-table
            :fields="fields"
            :config="config"
            :tableData="dataStore || []"
            :sortParams="sortOBJ"
            @loadmore="loadMore"
            @clickTheadCell="sortChange"
            @indexChanged="indexChanged"
        >
            <template slot="name" slot-scope="scope">
                <StockName
                    :val="scope.rowData.name"
                    :is_defined="scope.rowData.is_defined"
                    :source="scope.rowData.source"
                    :symbol_type="scope.rowData.symbol_type"
                />
            </template>
            <template slot="mcap" slot-scope="scope">
                <MarketValue
                    :val="scope.rowData.mcap"
                />
            </template>
            <template slot="price_change_rate" slot-scope="scope">
                <PriceChangeRate
                    :val="scope.rowData.price_change_rate"
                    :price_change="scope.rowData.price_change"
                    :source="scope.rowData.source"
                    :symbol_type="scope.rowData.symbol_type"
                    :stock_type="scope.rowData.stock_type"
                />
            </template>
        </ht-table>
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
    FRAME_CONSTITUENT_STOCK,
} from '../storage.js'
import {
    pushData,
    UnSubscriptSockets,
    JsToQtEventInterface,
} from '@c/utils/callQt.js'

import LoadMore from '../components/LoadMore.vue'
import htTable from '@c/htTable/index.vue'
import StockName from '@formatter/market-base/StockName.vue'
import MarketValue from '@formatter/market-base/MarketValue.vue'
import PriceChangeRate from '@formatter/market-base/PriceChangeRate.vue'

const configData = () => {
    return {
        name: {
            title: '名称',
            field: 'name',
            align: 'left',
            width: 80,
            canSort: true,
        },
        mcap: {
            title: '总市值',
            field: 'mcap',
            align: 'left',
            width: 80,
            canSort: true,
        },
        price_change_rate: {
            title: '涨跌幅',
            field: 'price_change_rate',
            align: 'left',
            width: 80,
            canSort: true,
        },
    }
}

const fieldData = () => {
    return [
        'name',
        'mcap',
        'price_change_rate',
    ]
}

let subTimer = null

export default {
    name: 'ConstituentStock',
    created() {
        goGoal.event.listen(FRAME_CONSTITUENT_STOCK, this.receiveFrameData)
        if (this.full_code) {
            this.fetchData()
        }
    },
    data() {
        return {
            page: 1,
            busy: true,
            dataStore: [],
            noData: false,
            ROWS: 30,
            sortOBJ: {
                order: 'price_change_rate',
                order_type: -1,
            },
            config: configData(),
            fields: fieldData(),
            subFields: [
                'source', 'symbol_type', 'name', 'code',
                'price_change', 'price_change_rate', 'mcap',
                'stock_type',
            ],
        }
    },
    computed: {
        ...mapState([
            'current_type',
            'full_code',
            'source',
            'stock_name',
        ]),
        ...mapState({
            hsIndexCategory: state => state.moduleMarket.hsIndexCategory,
        }),
        paramType() {
            return Object.is(this.source, 'BK') ? 3 : 9
        },
        subType() {
            return Object.is(this.source, 'BK') ? 3 : 5
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
            const param = {
                options: {
                    rows: this.ROWS,
                    first_flag: 0,
                    type: this.paramType,
                    order: this.sortOBJ.order,
                    order_type: this.sortOBJ.order_type,
                    plate_code: this.full_code,
                    fields: this.subFields.join(';'),
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
            if (this.busy) {
                return false
            }
            this.busy = true
            this.page++
            // 加载数据
            this.fetchData()
        },
        dblClick(args) {
            console.log(args)
            console.log('dblclick')
        },
        sortChange(...args) {
            let { field, canSort} = args[1]
            if (canSort) {
                UnSubscriptSockets(FRAME_CONSTITUENT_STOCK)
                if (Object.is(field, this.sortOBJ.order)) {
                    this.sortOBJ.order_type = Object.is(this.sortOBJ.order_type, 1) ? -1 : 1
                } else {
                    this.sortOBJ.order_type = -1
                    this.sortOBJ.order = field
                }
                this.resetState()
                this.fetchData()
            }
        },
        resetState() {
            this.page = 1
            this.busy = true
            this.noData = false
            this.dataStore = []
        },
        receiveFrameData(args) {
            const data = JSON.parse(args)
            let start = data[0].index
            let len = data.length
            data.forEach((element) => {
                if (element.mcap) {
                    element.mcap = element.mcap * 10000
                }
            })

            this.dataStore.splice(start, len, ...data)
        },
        indexChanged(start, end) {
            const STEP = 1000
            if (subTimer) {
                clearTimeout(subTimer)
                subTimer = null
            }
            subTimer = setTimeout(() => {
                pushData(FRAME_CONSTITUENT_STOCK, {
                    group_code: this.full_code,
                    group_type: this.subType,
                    index: `${start};${end}`,
                    field: this.subFields.join(';'),
                    sort: this.sortOBJ.order,
                    sortType: this.sortOBJ.order_type,
                })
            }, STEP)
        },
        moduleJump() {
            let type
            if (Array.isArray(this.hsIndexCategory)) {
                type = this.hsIndexCategory.includes(1) ? 'index' :
                       this.hsIndexCategory.includes(7) ? 'gn_index' :
                       this.hsIndexCategory.some((element) => {
                           return [6, 8, 9].includes(element)
                       }) ? 'hy_index' : 'index'
            }
            const params = {
                code: `LB${this.full_code}`,
                name: encodeURIComponent(this.stock_name),
                type,
            }
            JsToQtEventInterface(JSON.stringify({
                fun:'SendwebTowebEvent',
                data: {
                    destID: 'stockMarket',//目的webid
                    eventName: 'plateSelected',//事件名
                    eventContent: JSON.stringify(params)//事件参数
                }
            }))
        },
    },
    watch: {
        full_code(val, oldVal) {
            UnSubscriptSockets(FRAME_CONSTITUENT_STOCK)
            this.resetState()
            this.fetchData()
        },
    },
    beforeDestroy() {
        goGoal.event.remove(FRAME_CONSTITUENT_STOCK, this.receiveFrameData)
        UnSubscriptSockets(FRAME_CONSTITUENT_STOCK)
    },
    components: {
        LoadMore,
        htTable,
        StockName,
        MarketValue,
        PriceChangeRate,
    },
}
</script>

<style lang="less" scoped>
.index_constituent {
    display: flex;
    flex-direction: column;
    height: 100%;
}
</style>
