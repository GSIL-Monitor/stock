<template>
    <div class="detail">
        <!-- 顶部信息 -->
        <div class="detail_head">
            <div class="detail_head_title">
                <div class="title_left">
                    <StockName
                        :val="stock_name"
                        :current_type="current_type"
                        class="title_left_name"
                    />
                    <StockCode
                        :val="stock_code"
                        :source="source"
                        class="title_left_code"
                    />
                    <CompanyHonorBtn
                        :stock_code="stock_code"
                    />
                    <BelongIndustry
                        v-if="industry_name"
                        :industry_name="industry_name"
                    />
                </div>
                <SetIco
                    class="title_right_set"
                    @click="$_changeTapeDisplay"
                />
            </div>
            <TitleTopMarket
                class="detail_head_market"
                :stock_type="stock_type"
                :price="socketData.price"
                :price_change="socketData.price_change"
                :price_change_rate="socketData.price_change_rate"
            />
            <div class="detail_head_btn">
                <div class="detail_head_btn_skip">
                    <default-btn
                        class="btn-content"
                        @on-click="skipDiagnose"
                    >
                        诊股
                    </default-btn>
                    <default-btn
                        class="btn-content"
                        @on-click="skipReport"
                    >
                        研报
                    </default-btn>
                    <ButtonF10/>
                </div>
                <div class="detail_head_btn_right">
                    <StockIdentify
                        v-if="loadIdentify"
                        :full_code="full_code"
                    />
                    <IsMyStock/>
                </div>
            </div>
        </div>
        <!-- 买卖五档 -->
        <FiveOrder
            class="detail_order"
            :orderData="orderData"
            :close_price="close_price"
            :current_type="current_type"
            :row="row"
        />
        <!-- 字段详情 -->
        <div class="detail_info" :class="[detailInfoClass]">
            <div
                class="detail_info_table"
                @click="detailInfoToggleHeight"
            >
                <MarketInfo
                    class="detail_table_A"
                    v-show="detailInfo === 'market'"
                >
                    <tbody>
                        <tr>
                            <td class="two-letters">金额</td>
                            <td>
                                <Turnover
                                    :val="socketData.turnover"
                                    :stock_type="stock_type"
                                />
                            </td>
                            <td class="two-letters">换手</td>
                            <td>
                                <TurnoverRate
                                    :val="socketData.turnover_rate"
                                    :stock_type="stock_type"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">总手</td>
                            <td>
                                <Volume
                                    :val="socketData.volume"
                                    :stock_type="stock_type"
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">量比</td>
                            <td>
                                <QuantityRatio
                                    :val="socketData.quantity_ratio"
                                    :stock_type="stock_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>市盈E</td>
                            <td>
                                <ConsensusFields
                                    :val="pe_y1"
                                />
                            </td>
                            <td>流通市值</td>
                            <td>
                                <MarketValue
                                    :val="mcap"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>市净E</td>
                            <td>
                                <ConsensusFields
                                    :val="pb_y1"
                                />
                            </td>
                            <td>总市值</td>
                            <td>
                                <MarketValue
                                    :val="tcap"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">均价</td>
                            <td>
                                <CompareClose
                                    :val="socketData.avg_price"
                                    :close_price="close_price"
                                    :stock_type="stock_type"
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">振幅</td>
                            <td>
                                <Amplitude
                                    :val="socketData.amplitude"
                                    :stock_type="stock_type"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">今开</td>
                            <td>
                                <CompareClose
                                    :val="socketData.open_price"
                                    :close_price="close_price"
                                    :stock_type="stock_type"
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">昨收</td>
                            <td>
                                <ClosePrice
                                    :val="close_price"
                                    :current_type="current_type"
                                ></ClosePrice>
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">最高</td>
                            <td>
                                <CompareClose
                                    :val="socketData.high_price"
                                    :close_price="close_price"
                                    :stock_type="stock_type"
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">最低</td>
                            <td>
                                <CompareClose
                                    :val="socketData.low_price"
                                    :close_price="close_price"
                                    :stock_type="stock_type"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">外盘</td>
                            <td>
                                <VolumeOuter
                                    :val="socketData.volume_outer"
                                    :stock_type="stock_type"
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">内盘</td>
                            <td>
                                <VolumeInner
                                    :val="socketData.volume_inner"
                                    :stock_type="stock_type"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">涨停</td>
                            <td>
                                <HighLimit
                                    :val="close_price"
                                    :mark="mark"
                                    :stock_name="stock_name"
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">跌停</td>
                            <td>
                                <LowLimit
                                    :val="close_price"
                                    :mark="mark"
                                    :stock_name="stock_name"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                    </tbody>
                </MarketInfo>
                <ConsensusTable
                    v-if="detailInfo === 'entrust'"
                    :stock_code="stock_code"
                />
            </div>
            <ToggleBtn
                :rowToRight="arrowDirection"
                @toggleArrow="toggle"
            />
        </div>
        <AssociatedStock
            @resize-window="$_resizeWindow"
        />
        <!-- 分笔、分价表、资金流向、短线精灵、简易财务 -->
        <div class="detail_extend" :style="$_extendStyles" ref="detailExtend">
            <StockTransaction
                v-if="isTransationShow"
                ref="transactionComponent"
            />
            <PricePoint
                v-if="bottomTabConfig.activeType === 'price_table'"
            />
            <FundFlow
                v-if="bottomTabConfig.activeType === 'fund_flow'"
            />
            <ShortElves
                v-if="bottomTabConfig.activeType === 'short_line'"
            />
            <SimpleFinancial
                v-if="bottomTabConfig.activeType === 'simple_finance'"
            />
        </div>
        <TabSwitch
            :config-arr="tabSwitchList.list"
            :active-type="tabSwitchList.activeType"
            @on-click="changeBottomActiveTab"
            ref="tabs"
        />
    </div>
</template>

<script>
import {
    mapState,
    mapGetters,
    mapMutations,
} from 'vuex'
import {
    getLimitStockData,
} from '@service/index.js'
import {
    sendEvent,
    pushData,
    UnSubscriptSockets,
} from '@c/utils/callQt.js'
import {
    TAPE_ROWS,
    TAPE_CONTENT,
    TAPE_STYLE,
    FUNC_PERFORMANCE,
} from '../tape/tape-set-config.js'
import {
    SESSION_ASTOCK_FUNC_TAB,
    FRAME_A_MARKET,
} from '../storage.js'
import {
    STOCK_NAME,
    CHANGE_TAPE_SET,
    CHANGE_STOCK_A_ACTIVE_TAB,
} from '@store/stock-detail-store/config/mutation-types.js'

import fiveOrderMixin from '../mixins/five-order-mixin.js'
import rightResizeMixin from '../mixins/right-resize-mixin.js'
import tapeDisplayMixin from '../mixins/tape-display-mixin.js'

import CompanyHonorBtn from './CompanyHonorBtn.vue'
import BelongIndustry from './BelongIndustry.vue'
import TitleTopMarket from './TitleTopMarket.vue'
import DefaultBtn from '../components/DefaultBtn.vue'
import ButtonF10 from '../components/ButtonF10.vue'
import IsMyStock from './IsMyStock.vue'
import IdentifyIco from './IdentifyIco.vue'
import FiveOrder from './FiveOrder.vue'
import ToggleBtn from './ToggleBtn.vue'
import TabSwitch from './TabSwitch.vue'
import SetIco from '../components/SetIco.vue'
import StockIdentify from './StockIdentify.vue'
// 底部 tab
import StockTransaction from './StockATransation.vue'
import PricePoint from './PricePoint.vue'
import FundFlow from './FundFlow.vue'
import ShortElves from './ShortElves.vue'
import SimpleFinancial from './SimpleFinancial.vue'
// 盘口一致预期
import ConsensusTable from './ConsensusTable.vue'
import AssociatedStock from './AssociatedStock.vue'
// 盘口内容
import MarketInfo from './MarketInfo.vue'
// 盘口内容 -- 字段详情
import StockCode from '@formatter/market-base/StockCode.vue'
import StockName from '@formatter/market-base/StockName.vue'
import Turnover from '@formatter/market-base/Turnover.vue'
import TurnoverRate from '@formatter/market-base/TurnoverRate.vue'
import Volume from '@formatter/market-base/Volume.vue'
import QuantityRatio from '@formatter/market-base/QuantityRatio.vue'
import ConsensusFields from '@formatter/market-base/ConsensusFields.vue'
import MarketValue from '@formatter/market-base/MarketValue.vue'
import CompareClose from '@formatter/market-base/CompareClose.vue'
import Amplitude from '@formatter/market-base/Amplitude.vue'
import ClosePrice from '@formatter/market-base/ClosePrice.vue'
import VolumeOuter from '@formatter/market-base/VolumeOuter.vue'
import VolumeInner from '@formatter/market-base/VolumeInner.vue'
import HighLimit from '@formatter/market-base/HighLimit.vue'
import LowLimit from '@formatter/market-base/LowLimit.vue'

const apiFields = [
    'symbol_type',
    'stock_type',
    'close_price',
    'pe_y1',
    'mcap',
    'pb_y1',
    'tcap',
    'price',
    'turnover',
    'turnover_rate',
    'volume',
    'quantity_ratio',
    'avg_price',
    'amplitude',
    'open_price',
    'high_price',
    'low_price',
    'volume_outer',
    'volume_inner',
    'fullcode',
]

const fiveFields = [
    'buy1_price',
    'buy2_price',
    'buy3_price',
    'buy4_price',
    'buy5_price',
    'sell1_price',
    'sell2_price',
    'sell3_price',
    'sell4_price',
    'sell5_price',
    'buy1_volume',
    'buy2_volume',
    'buy3_volume',
    'buy4_volume',
    'buy5_volume',
    'sell1_volume',
    'sell2_volume',
    'sell3_volume',
    'sell4_volume',
    'sell5_volume',
]

export default {
    name: 'StockATemp',
    mixins: [
        fiveOrderMixin,
        rightResizeMixin,
        tapeDisplayMixin,
    ],
    created() {
        // this.initState()
        goGoal.event.listen(FRAME_A_MARKET, this.receiveSocketData)

        if (this.stock_code) {
            this.getInfoData()
        }
    },
    data() {
        return {
            industry_name: '',
            loadIdentify: false,
            socketData: {},

            symbol_type: null,
            close_price: null,
            stock_type: null,

            pe_y1: null,
            mcap: null,
            pb_y1: null,
            tcap: null,

            mark: false,

            showFilterPopUp: true,
            bottomHideList: [],
        }
    },
    components: {
        CompanyHonorBtn,
        BelongIndustry,
        TitleTopMarket,
        DefaultBtn,
        ButtonF10,
        IsMyStock,
        IdentifyIco,
        FiveOrder,
        ToggleBtn,
        TabSwitch,
        SetIco,
        StockIdentify,
        AssociatedStock,

        SimpleFinancial,
        StockTransaction,
        PricePoint,
        FundFlow,
        ShortElves,

        ConsensusTable,
        MarketInfo,

        StockCode,
        StockName,
        Turnover,
        TurnoverRate,
        Volume,
        QuantityRatio,
        ConsensusFields,
        MarketValue,
        CompareClose,
        Amplitude,
        ClosePrice,
        VolumeOuter,
        VolumeInner,
        HighLimit,
        LowLimit,
    },
    computed: {
        ...mapState([
            'source',
            'stock_code',
            'full_code',
            'current_type',
            'stock_name',
        ]),
        ...mapState({
            [TAPE_ROWS]: state => state.moduleTape[TAPE_ROWS].activeType,
            [TAPE_CONTENT]: state => state.moduleTape[TAPE_CONTENT].activeType,
            [TAPE_STYLE]: state => state.moduleTape[TAPE_STYLE].activeType,
            bottomTabConfig: state => state.moduleStockA.bottomTabConfig,
        }),
        ...mapGetters([
            'tabSwitchList',
            'isAllTabsFalse',
            'filterList',
        ]),
        row() {
            return this[TAPE_ROWS]
        },
        detailInfoClass() {
            return Object.is(this[TAPE_STYLE], 'off') ? 'detail_info_Limit' :
                   Object.is(this[TAPE_STYLE], 'on') ? 'detail_info_Full' :
                   ''
        },
        detailInfo() {
            return this[TAPE_CONTENT]
        },
        isTransationShow() {
            return Object.is(this.bottomTabConfig.activeType, 'transaction')
        },
        arrowDirection() {
            return Object.is(this[TAPE_CONTENT], 'market')
        },
    },
    methods: {
        ...mapMutations([
            STOCK_NAME,
            CHANGE_TAPE_SET,
            CHANGE_STOCK_A_ACTIVE_TAB,
        ]),
        getInfoData() {
            let param = {
                options: {
                    stock_code: this.stock_code,
                    get_industry: 1,
                    fields: ['stock_name', 'industry_name', 'change_value', 'change_rate', ...apiFields, ...fiveFields].join(';'),
                },
                callback0: data => {
                    if (data.fullcode !== this.full_code) {
                        return false
                    }

                    this[STOCK_NAME](data.stock_name)
                    this.industry_name = data.industry_name

                    data.name = data.stock_name
                    data.price_change = data.change_value
                    data.price_change_rate = data.change_rate
                    data.mcap && (data.mcap = data.mcap * 10000)
                    data.tcap && (data.tcap = data.tcap * 10000)
                    data.turnover && (data.turnover = data.turnover * 10000)
                    data.turnover_rate && (data.turnover_rate = data.turnover_rate * 100)
                    Reflect.deleteProperty(data, 'stock_name')
                    Reflect.deleteProperty(data, 'change_value')
                    Reflect.deleteProperty(data, 'change_rate')
                    Reflect.deleteProperty(data, 'industry_name')

                    this.symbol_type = data.symbol_type
                    this.stock_type = data.stock_type
                    this.close_price = data.close_price
                    this.pe_y1 = data.pe_y1
                    this.mcap = data.mcap
                    this.pb_y1 = data.pb_y1
                    this.tcap = data.tcap

                    this.$_setFiveOrderFields('buy', data)
                    this.$_setFiveOrderFields('sell', data)
                    this.$_resetDiff()

                    this.socketData = Object.assign({}, data)

                    pushData(FRAME_A_MARKET, {
                        code: this.full_code,
                        request_name: 'hq/list_info',
                    })

                    // 获取基础属性信息
                    this.loadIdentify = true
                },
            }

            getLimitStockData(param)
        },
        receiveSocketData(args) {
            const { receive_content } = JSON.parse(args)
            const data = receive_content[0]
            // 清空
            if (Object.is(data.mark, 1)) {
                this.socketData = {}
                this.mark = true
                this.$_clearFiveOrder()
                // 清空成交明细
                if (this.isTransationShow) {
                    this.$refs.transactionComponent.clear()
                }
                return false
            }

            const transferData = ['name', 'price_change', 'price_change_rate', ...apiFields, ...fiveFields].reduce(
                (obj, element) => {
                    if (Reflect.has(data, element)) {
                        obj[element] = Reflect.get(data, element)
                    }

                    return obj
                },
                {}
            )

            this.mark = false
            // 处理推送数据单位
            if (transferData.turnover) {
                transferData.turnover = transferData.turnover * 10000
            }
            if (transferData.mcap) {
                transferData.mcap = transferData.mcap * 10000
            }
            if (transferData.tcap) {
                transferData.tcap = transferData.tcap * 10000
            }
            // 继承推送数据
            this.socketData = Object.assign({}, this.socketData, transferData)

            // 不清空的数据
            this.pe_y1 = this.socketData.pe_y1
            this.mcap = this.socketData.mcap
            this.pb_y1 = this.socketData.pb_y1
            this.tcap = this.socketData.tcap
            this.close_price = this.socketData.close_price
            this.stock_type = this.socketData.stock_type
            // A股除权除息名字变更
            if (this.socketData.name) {
                this[STOCK_NAME](this.socketData.name)
            }

            // 计算五档 volume 差值
            this.$_setDiffValue('buy')
            this.$_setDiffValue('sell')

            this.$_setFiveOrderFields('buy', this.socketData)
            this.$_setFiveOrderFields('sell', this.socketData)

            // 成交明细
            if (this.isTransationShow && data.transaction_type && data.transaction_volume) {
                const one = {
                    update_time: data.date,
                    price: this.socketData.price,
                    price_change: this.socketData.price_change,
                    volume: Math.floor(Math.round(data.transaction_volume / 100)),
                    transaction_type: data.transaction_type,
                    deal_count: data.deal_count,
                }
                this.$refs.transactionComponent.pushData(one)
            }
       },
        // initState() {
        //     this.initBottomTabState()
        // },
        // getTabSession() {
        //     return sessionStorage.getItem(SESSION_ASTOCK_FUNC_TAB)
        // },
        // setTabSession(type) {
        //     sessionStorage.setItem(SESSION_ASTOCK_FUNC_TAB, type)
        // },
        // initBottomTabState() {
        //     const latest = this.getTabSession()
        //     if (latest) {
        //         this[CHANGE_STOCK_A_ACTIVE_TAB](latest)
        //     }
        // },
        detailInfoToggleHeight() {
            let val = this[TAPE_STYLE] === 'on' ? 'off' : 'on'
            this[CHANGE_TAPE_SET]([{
                type: TAPE_STYLE,
                val,
            }])
        },
        toggle() {
            let val = this[TAPE_CONTENT] === 'market' ? 'entrust' : 'market'
            this[CHANGE_TAPE_SET]([{
                type: TAPE_CONTENT,
                val,
            }])
        },
        changeBottomActiveTab(type) {
            // 单击改变选中的左下侧的底部tab
            this[CHANGE_STOCK_A_ACTIVE_TAB](type)
        },
        skipDiagnose() {
            const params = JSON.stringify({
                stock_code: this.stock_code,
                stock_name: encodeURIComponent(this.stock_name)
            })

            sendEvent('diagnose', 'diagnoseStockCode', params, true)
        },
        skipReport() {
            let hash = location.hash.substr(1)
            const params = JSON.stringify({
                moduleName: "reportCenter_/reportClassify",
                stock_code: hash,
                stock_name: encodeURIComponent(this.stock_name)
            })

            sendEvent('reportCenter', 'searchReport', params, true)
        },
        $_resizeWindow() {
            let ele = this.$refs.detailExtend
            let tabs = this.$refs.tabs
            let top = ele.getBoundingClientRect().top
            let height = tabs.$el.offsetHeight
            let residue = window.innerHeight - top - height

            this.extendHeight = residue
        },
        resetComponent() {
            UnSubscriptSockets(FRAME_A_MARKET)
            this.socketData = {}
            this.stock_type = null
            this.close_price = null
            this.pe_y1 = null
            this.mcap = null
            this.pb_y1 = null
            this.tcap = null
            this.$_clearFiveOrder()
            this.loadIdentify = false
            this.$_nextResizeWindow()
        },
    },
    beforeDestroy() {
        goGoal.event.remove(FRAME_A_MARKET, this.receiveSocketData)
        UnSubscriptSockets(FRAME_A_MARKET)
        this.socketData = {}
    },
    watch: {
        full_code() {
            this.resetComponent()
            this.getInfoData()
        },
        isAllTabsFalse(val, oldValue) {
            if (Object.is(oldValue, false)
                && Object.is(val, true)
            ) {
                this[CHANGE_STOCK_A_ACTIVE_TAB]('transaction')
            }
        },
        [TAPE_ROWS]() {
            this.$_nextResizeWindow()
        },
        [TAPE_STYLE]() {
            this.$_nextResizeWindow()
        },
        filterList(val, oldValue) {
            if (Object.is(val.length, 1) || Object.is(oldValue.length, 1)) {
                this.$_nextResizeWindow()
            }
        },
    },
}
</script>

<style lang="less" scoped>
.title_right_set {
    align-self: flex-start;
}

.belong_industry {
    margin-left: 5px;
}

.btn-content {
    margin-left: 8px;
    &:first-child {
        margin-left: 0;
    }
}

.detail_info_toggle {
    flex: 0 0 12px;
}

.detail_table_A {
    cursor: pointer;
}
</style>
