import {
    mapState,
    mapGetters,
} from 'vuex'

import loaddingStyleMixin from './loadding-style-mixin.js'

import htTable from '@c/htTable/index.vue'
import StockCode from '@formatter/market-base/StockCode.vue'
import StockName from '@formatter/market-base/StockName.vue'
import Price from '@formatter/market-base/Price.vue'
import PriceChange from '@formatter/market-base/PriceChange.vue'
import PriceChangeRate from '@formatter/market-base/PriceChangeRate.vue'
import Volume from '@formatter/market-base/Volume.vue'
import Turnover from '@formatter/market-base/Turnover.vue'
import TurnoverRate from '@formatter/market-base/TurnoverRate.vue'
import Amplitude from '@formatter/market-base/Amplitude.vue'
import QuantityRatio from '@formatter/market-base/QuantityRatio.vue'
import CommissionRate from '@formatter/market-base/CommissionRate.vue'

const template = `<div
    class="info_wrap"
    :class="wrapClasses"
>
    <ht-table
        :fields="fields"
        :config="config"
        :tableData="dataStore || []"
        :sortParams="sortOBJ"
        :fixedColCount="3"
        @loadmore="loadMore"
        @clickTheadCell="sortChange"
        @indexChanged="indexChanged"

    >
        <span slot="index" slot-scope="scope">{{ scope.index + 1 }}</span>
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
                :source="scope.rowData.source"
                :symbol_type="scope.rowData.symbol_type"
            />
        </template>
        <template slot="price" slot-scope="scope">
            <Price
                :val="scope.rowData.price"
                :source="scope.rowData.source"
                :symbol_type="scope.rowData.symbol_type"
                :stock_type="scope.rowData.stock_type"
                :price_change="scope.rowData.price_change"
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
        <template slot="price_change" slot-scope="scope">
            <PriceChange
                :val="scope.rowData.price_change"
                :source="scope.rowData.source"
                :symbol_type="scope.rowData.symbol_type"
                :stock_type="scope.rowData.stock_type"
            />
        </template>
        <template slot="volume" slot-scope="scope">
            <Volume
                :val="scope.rowData.volume"
            />
        </template>
        <template slot="turnover" slot-scope="scope">
            <Turnover
                :val="scope.rowData.turnover"
            />
        </template>
        <template slot="turnover_rate" slot-scope="scope">
            <TurnoverRate
                :val="scope.rowData.turnover_rate"
            />
        </template>
        <template slot="amplitude" slot-scope="scope">
            <Amplitude
                :val="scope.rowData.amplitude"
            />
        </template>
        <template slot="quantity_ratio" slot-scope="scope">
            <QuantityRatio
                :val="scope.rowData.quantity_ratio"
            />
        </template>
        <template slot="commission_rate" slot-scope="scope">
            <CommissionRate
                :val="scope.rowData.commission_rate"
            />
        </template>
    </ht-table>
</div>`

const configData = () => {
    return {
        index: {
            title: '序号',
            field: 'index',
            align: 'right',
            width: 80,
        },
        code: {
            title: '代码',
            field: 'code',
            align: 'right',
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
            align: 'right',
            width: 80,
            canSort: true,
        },
        price_change_rate: {
            title: '涨跌幅',
            field: 'price_change_rate',
            align: 'right',
            width: 80,
            canSort: true,
        },
        price_change: {
            title: '涨跌额',
            field: 'price_change',
            align: 'right',
            width: 80,
            canSort: true,
        },
        volume: {
            title: '成交量',
            field: 'volume',
            align: 'right',
            width: 80,
            canSort: true,
        },
        turnover: {
            title: '成交额',
            field: 'turnover',
            align: 'right',
            width: 80,
            canSort: true,
        },
        turnover_rate: {
            title: '换手率',
            field: 'turnover_rate',
            align: 'right',
            width: 80,
            canSort: true,
        },
        amplitude: {
            title: '振幅',
            field: 'amplitude',
            align: 'right',
            width: 80,
            canSort: true,
        },
        quantity_ratio: {
            title: '量比',
            field: 'quantity_ratio',
            align: 'right',
            width: 80,
            canSort: true,
        },
        commission_rate: {
            title: '委比',
            field: 'commission_rate',
            align: 'right',
            width: 80,
            canSort: true,
        },
    }
}

const fieldData = () => {
    return [
        'index',
        'code',
        'name',
        'price',
        'price_change_rate',
        'price_change',
        'volume',
        'turnover',
        'turnover_rate',
        'amplitude',
        'quantity_ratio',
        'commission_rate',
    ]
}

export default {
    mixins: [
        loaddingStyleMixin,
    ],
    template,
    computed: {
        ...mapState([
            'stock_code',
            'full_code',
            'current_type',
        ]),
        ...mapGetters([
            'isAStock',
            'isHkStock',
        ]),
    },
    watch: {
        // full_code() {
        //     this.resetState()
        //     this.fetchData()
        // },
    },
    data() {
        return {
            dataStore: [],
            apiData: [],
            config: configData(),
            fields: fieldData(),
            sortOBJ: {
                order: 'price_change_rate',
                order_type: -1,
            },
            // 为了少调用 api 这里写死
            ROWS: 5000,
            subFields: [
                'name',
                'full_code',
                'stock_type',
                'close_price',
                'source',
                'symbol_type',
                'price',
                'price_change_rate',
                'price_change',
                'volume',
                'turnover',
                'turnover_rate',
                'amplitude',
                'quantity_ratio',
                'commission_rate',
            ].join(';'),
        }
    },
    components: {
        htTable,
        StockCode,
        StockName,
        Price,
        PriceChange,
        PriceChangeRate,
        Volume,
        Turnover,
        TurnoverRate,
        Amplitude,
        QuantityRatio,
        CommissionRate,
    },
    methods: {
        loadMore() {

        },
        resetState() {
            this.page = 1
            this.noData = false
            this.dataStore = []
            this.apiData = []
        },
        sortNormal(field) {
            if (Object.is(field, this.sortOBJ.order)) {
                this.sortOBJ.order_type = Object.is(this.sortOBJ.order_type, 1) ? -1 : 1
            } else {
                this.sortOBJ.order_type = -1
                this.sortOBJ.order = field
            }
            this.resetState()
            this.fetchData()
        },
        receiveFrameData(args) {
            const data = JSON.parse(args)
            data.forEach((element) => {
                let index = element.index
                if (element.volume) {
                    element.volume = element.volume / 100
                }
                element.code = element.full_code.replace(element.source, '')
                if (element.turnover) {
                    element.turnover = element.turnover * 10000
                }
                this.dataStore.splice(index, 1, element)
            })
        },
    },
    created() {
        this.fetchData()
    },
}
