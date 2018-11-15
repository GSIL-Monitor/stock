<template>
    <div class="other_index">
        <div class="view_title">
            <span>其他指数</span>
        </div>
        <ht-table
            :fields="fields"
            :config="config"
            :tableData="dataStore || []"
            :sortParams="sortOBJ"
            @clickTheadCell="sortChange"
        >
            <template slot="code" slot-scope="scope">
                <StockCode
                    :val="scope.rowData.code"
                    :source="scope.rowData.source"
                />
            </template>
            <template slot="name" slot-scope="scope">
                <StockName
                    :val="scope.rowData.name"
                    :is_defined="scope.rowData.is_defined"
                    :current_type="current_type"
                />
            </template>
            <template slot="price" slot-scope="scope">
                <Price
                    :val="scope.rowData.price"
                    :price_change="scope.rowData.price_change"
                    :current_type="current_type"
                />
            </template>
            <template slot="price_change_rate" slot-scope="scope">
                <PriceChangeRate
                    :val="scope.rowData.price_change_rate"
                    :price_change="scope.rowData.price_change"
                    :current_type="current_type"
                />
            </template>
        </ht-table>
    </div>
</template>

<script>
import {
    mapState,
} from 'vuex'
import {
    getOtherIndicators,
} from '@service/index.js'
import {
    FRAME_OTHER_INDEXS,
} from '../storage.js'
import {
    pushData,
    UnSubscriptSockets,
} from '@c/utils/callQt'

import htTable from '@c/htTable/index.vue'
import StockCode from '@formatter/market-base/StockCode.vue'
import StockName from '@formatter/market-base/StockName.vue'
import Price from '@formatter/market-base/Price.vue'
import PriceChangeRate from '@formatter/market-base/PriceChangeRate.vue'

const configData = () => {
    return {
        code: {
            title: '代码',
            field: 'code',
            align: 'left',
            width: 80,
            canSort: true,
        },
        name: {
            title: '名称',
            field: 'name',
            align: 'left',
            width: 80,
            canSort: true,
        },
        price: {
            title: '最新价',
            field: 'price',
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
        'code',
        'name',
        'price',
        'price_change_rate',
    ]
}

export default {
    name: 'OtherIndex',
    created() {
        goGoal.event.listen(FRAME_OTHER_INDEXS, this.receiveFrameData)
        this.fetchData()
    },
    data() {
        return {
            dataStore: [],
            sortOBJ: {
                order: 'price_change_rate',
                order_type: -1,
            },
            config: configData(),
            fields: fieldData(),
            ROWS: 21,
        }
    },
    computed: {
        ...mapState([
            'full_code',
            'current_type',
        ]),
        ...mapState({
            hsIndexCategory: state => state.moduleMarket.hsIndexCategory,
        }),
    },
    components: {
        htTable,
        StockCode,
        StockName,
        Price,
        PriceChangeRate,
    },
    methods: {
        findSameCodeIndex(data) {
            return data.findIndex((element) => {
                return Object.is(`${element.source}${element.code}`, this.full_code)
            })
        },
        fetchData() {
            const param = {
                options: {
                    full_codes: this.full_code,
                    order: this.sortOBJ.order,
                    order_type: this.sortOBJ.order_type,
                    rows: this.ROWS,
                    get_index: this.hsIndexCategory[0],
                },
                callback0: (data) => {
                    // 找出相同的股票
                    let index = this.findSameCodeIndex(data)
                    if (index > -1) {
                        data.splice(index, 1)
                    }
                    data.forEach((element) => {
                        Reflect.set(element, 'price_change', element.change_value)
                        Reflect.set(element, 'price_change_rate', element.change_rate)

                        Reflect.deleteProperty(element, 'change_value')
                        Reflect.deleteProperty(element, 'change_rate')
                        Reflect.deleteProperty(element, 'stock_type')
                    })
                    this.dataStore = data
                    this.$nextTick(() => {
                        pushData(FRAME_OTHER_INDEXS, {
                            index: '0;' + (this.dataStore.length - 1),
                            field: 'code;price_change;price_change_rate;price;name;source',
                            sort: this.sortOBJ.order,
                            sortType: this.sortOBJ.order_type,
                            pool: 'pushIndex_' + (this.hsIndexCategory[0] - 1),
                        })
                    })
                },
            }

            getOtherIndicators(param)
        },
        stockPool() {
            return this.dataStore.map((element) => {
                return `${element.source}${element.code}`
            })
        },
        sortChange(...args) {
            let { field, canSort} = args[1]
            if (canSort) {
                UnSubscriptSockets(FRAME_OTHER_INDEXS)
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
        receiveFrameData(args) {
            const data = JSON.parse(args)

            data.forEach((element) => {
                element.code = element.code.replace(element.source, '')
            })

            // 找出相同的股票
            let index = this.findSameCodeIndex(data)

            if (index > -1) {
                data.splice(index, 1)
            }

            this.dataStore = data
        },
        resetState() {
            this.noData = false
            this.dataStore = []
        },
    },
    beforeDestroy() {
        goGoal.event.remove(FRAME_OTHER_INDEXS, this.receiveFrameData)
        UnSubscriptSockets(FRAME_OTHER_INDEXS)
    },
    watch: {
        full_code() {
            UnSubscriptSockets(FRAME_OTHER_INDEXS)
            this.resetState()
            this.fetchData()
        },
    },
}
</script>
