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
                        :stock_code="stock_code"
                    />
                </div>
                <SetIco
                    class="title_right_set"
                    @click="tapeSettings"
                />
            </div>
            <TitleTopMarket
                class="detail_head_market"
                :source="source"
                :symbol_type="symbol_type"
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
            :stockType="current_type"
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
                                />
                            </td>
                            <td class="two-letters">换手</td>
                            <td>
                                <TurnoverRate
                                    :val="socketData.turnover_rate"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">总手</td>
                            <td>
                                <Volume
                                    :val="socketData.volume"
                                />
                            </td>
                            <td class="two-letters">量比</td>
                            <td>
                                <QuantityRatio
                                    :val="socketData.quantity_ratio"
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
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">振幅</td>
                            <td>
                                <Amplitude
                                    :val="socketData.amplitude"
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
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">最低</td>
                            <td>
                                <CompareClose
                                    :val="socketData.low_price"
                                    :close_price="close_price"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">外盘</td>
                            <td>
                                <VolumeOuter
                                    :val="socketData.volume_outer"
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">内盘</td>
                            <td>
                                <VolumeInner
                                    :val="socketData.volume_inner"
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
        <!-- 分笔、分价表、资金流向、短线精灵、简易财务 -->
        <div class="detail_extend" :style="extendStyles" ref="detailExtend">
            <SimpleFinancial v-if="bottomTabConfig.activeType === 'simple_finance'"/>
            <StockTransaction v-if="isTransationShow" ref="transactionComponent"/>
            <PricePoint v-if="bottomTabConfig.activeType === 'price_table'"/>
            <FundFlow v-if="bottomTabConfig.activeType === 'fund_flow'"/>
            <ShortElves v-if="bottomTabConfig.activeType === 'short_line'"/>
        </div>
        <TabSwitch
            :configArr="tabSwitchList.list"
            :activeType="tabSwitchList.activeType"
            @tabClick="changeBottomActiveTab"
            ref="tabs"
        />
    </div>
</template>

<script>
import {
    mapState,
} from 'vuex'
import {
    getLimitStockData,
} from '@service/'
import {
    throttle,
} from '@c/utils/util'
import {
    initTapeDefault,
    initTapeFunc,
} from '../tape/tape-public-func'
import {
    TAPE_ROWS,
    TAPE_CONTENT,
    TAPE_STYLE,
    FUNC_PERFORMANCE,
} from '../tape/tape-set-config'
import {
    SESSION_ASTOCK_FUNC_TAB,
    SOCKET_A_MARKET,
} from '../storage'

import socketMixin from '../mixins/socket-mixin'
import fiveOrderMixin from '../mixins/five-order-mixin'
import rightResizeMixin from '../mixins/right-resize-mixin'

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

export default {
    name: 'StockATemp',
    mixins: [
        socketMixin,
        fiveOrderMixin,
        rightResizeMixin,
    ],
    created() {
        // 根据 localStorage 设置初始状态
        this.initState()

        this.$eventBus.$on(SOCKET_A_MARKET, this.receiveSocketData)
        this.$eventBus.$on('tapeDefaultChanged', this.tapeDefaultChanged)
        this.$eventBus.$on('bottomSwitch', this.bottomSwitch)
        this.$eventBus.$on('resetTapeState', this.resetTapeState)
        if (this.stock_code) {
            this.getInfoData()
        }
    },
    data() {
        return {
            [TAPE_ROWS]: '5',
            [TAPE_CONTENT]: 'market',
            [TAPE_STYLE]: 'off',
            linkIndex: 0,
            industry_name: '',
            loadIdentify: false,
            socketData: {},

            stock_name: '',
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
            bottomTabConfig: {
                activeType: 'transaction',
                list: [
                    {
                        text: '分笔',
                        type: 'transaction',
                    },
                    {
                        text: '分价表',
                        type: 'price_table',
                    },
                    {
                        text: '资金流向',
                        type: 'fund_flow',
                    },
                    {
                        text: '短线精灵',
                        type: 'short_line',
                    },
                    {
                        text: '简易财务',
                        type: 'simple_finance',
                    },
                ],
            }
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
        ]),
        row() {
            return this[TAPE_ROWS]
        },
        detailInfoClass() {
            return this[TAPE_STYLE] === 'off' ? 'detail_info_Limit' :
                   this[TAPE_STYLE] === 'on' ? 'detail_info_Full' :
                   ''
        },
        detailInfo() {
            return this[TAPE_CONTENT]
        },
        tabSwitchList() {
            let list = this.bottomTabConfig.list.filter((ele) => {
                return !this.bottomHideList.some((n) => {
                    return n === ele.type
                })
            })

            return {
                activeType: this.bottomTabConfig.activeType,
                list,
            }
        },
        isTransationShow() {
            return Object.is(this.bottomTabConfig.activeType, 'transaction')
        },
        arrowDirection() {
            return this[TAPE_CONTENT] === 'market'
        },
        linkAddress() {
            return `request_name:push/hq/list_info|request_param:fullcodes=${this.full_code}|request_id:${SOCKET_A_MARKET}|first_push:true`
        },
    },
    methods: {
        tapeDefaultChanged(key, val) {
            this[key] = val
            this.$nextTick(() => {
                this.resizeWindow()
            })
        },
        bottomSwitch(key, val) {
            if (val === false) {
                // 若它是激活状态，切换回分笔
                if (this.bottomTabConfig.activeType === key) {
                    let defaults = 'transaction'
                    this.bottomTabConfig.activeType = defaults
                    this.setTabSession(defaults)
                }
                // 删除 tab
                let index = this.bottomHideList.indexOf(key)
                if (index === -1) {
                    this.bottomHideList.push(key)
                }
            } else {
                let index = this.bottomHideList.indexOf(key)
                if (index > -1) {
                    this.bottomHideList.splice(index, 1)
                }
            }
            this.$nextTick(() => {
                this.resizeWindow()
            })
        },
        getInfoData() {
            let param = {
                options: {
                    stock_code: this.stock_code,
                    get_industry: 1,
                },
                callback0: data => {
                    this.industry_name = data.industry_name

                    this.symbol_type = data.symbol_type
                    this.stock_type = data.stock_type
                    this.stock_name = data.stock_name
                    this.close_price = data.close_price
                    this.pe_y1 = data.pe_y1
                    this.mcap = data.mcap * 10000
                    this.pb_y1 = data.pb_y1
                    this.tcap = data.tcap * 10000

                    this.setFiveOrderFields('buy', data)
                    this.setFiveOrderFields('sell', data)

                    this.resetDiff()

                    this.socketData.stock_name = data.stock_name
                    this.socketData.price = data.price
                    this.socketData.price_change = data.change_value
                    this.socketData.price_change_rate = data.change_rate

                    this.socketData.turnover = data.turnover ? data.turnover * 10000 : data.turnover
                    this.socketData.turnover_rate = data.turnover_rate ? data.turnover_rate * 100 : data.turnover_rate
                    this.socketData.volume = data.volume ? data.volume / 100 : data.volume
                    this.socketData.quantity_ratio = data.quantity_ratio
                    this.socketData.avg_price = data.avg_price
                    this.socketData.amplitude = data.amplitude
                    this.socketData.open_price = data.open_price
                    this.socketData.high_price = data.high_price
                    this.socketData.low_price = data.low_price
                    this.socketData.volume_outer = data.volume_outer ? data.volume_outer / 100 : data.volume_outer
                    this.socketData.volume_inner = data.volume_inner ? data.volume_inner / 100 :  data.volume_inner
                },
                afterResponse: () => {
                    this.sendLink(this.linkAddress)
                    this.rememberLink(this.linkAddress, this.linkIndex)
                    // TODO: 获取基础属性信息
                    this.loadIdentify = true
                },
            }

            getLimitStockData(param)
        },
        receiveSocketData(...args) {
            let data = args[0][0]
            // 清空
            if (Object.is(data.mark, 1)) {
                this.socketData = {}
                this.mark = true
                this.clearFiveOrder()
                // 清空成交明细
                if (this.isTransationShow) {
                    this.$refs.transactionComponent.clear()
                }
                return false
            }

            this.mark = false
            const transferData = Object.assign({}, data)
            // 处理推送数据单位
            if (transferData.turnover) {
                transferData.turnover = transferData.turnover * 10000
            }
            if (transferData.volume) {
                transferData.volume = transferData.volume / 100
            }
            if (transferData.mcap) {
                transferData.mcap = transferData.mcap * 10000
            }
            if (transferData.volume_outer) {
                transferData.volume_outer = transferData.volume_outer / 100
            }
            if (transferData.volume_inner) {
                transferData.volume_inner = transferData.volume_inner / 100
            }
            // 继承推送数据
            this.socketData = Object.assign({}, this.socketData, transferData)

            // 不清空的数据
            this.pe_y1 = this.socketData.pe_y1
            this.mcap = this.socketData.mcap
            this.pb_y1 = this.socketData.pb_y1
            this.tcap = this.socketData.tcap
            // A股除权除息名字变更
            this.name = this.socketData.name
            this.close_price = this.socketData.close_price

            // 计算五档 volume 差值
            this.setDiffValue('buy')
            this.setDiffValue('sell')

            this.setFiveOrderFields('buy', this.socketData)
            this.setFiveOrderFields('sell', this.socketData)

            // 成交明细
            if (this.isTransationShow && data.transaction_type && data.transaction_volume) {
                const one = {
                    update_time: data.date,
                    price: this.socketData.price,
                    price_change: this.socketData.price_change,
                    volume: Math.floor(Math.round(data.transaction_volume / 100)),
                    transaction_type: data.transaction_type,
                    deal_count: this.socketData.deal_count,
                }
                this.$refs.transactionComponent.pushData(one)
            }
       },
        initState() {
            initTapeDefault((key, val) => {
                this[key] = val
            })
            initTapeFunc((val) => {
                this.bottomHideList.push(val)
            })
            this.initBottomTabState()
        },
        getTabSession() {
            return sessionStorage.getItem(SESSION_ASTOCK_FUNC_TAB)
        },
        setTabSession(type) {
            sessionStorage.setItem(SESSION_ASTOCK_FUNC_TAB, type)
        },
        initBottomTabState() {
            const latest = this.getTabSession()
            if (latest) {
                this.bottomTabConfig.activeType = latest
            }
        },
        emitDataChange(parentType, type) {
            this.$eventBus.$emit('dataChanged', {
                parentType: parentType,
                type,
                changed: {
                    activeType: type,
                },
            })
        },
        detailInfoToggleHeight() {
            let type = this[TAPE_STYLE] === 'on' ? 'off' : 'on'
            this.emitDataChange(TAPE_STYLE, type)
        },
        toggle() {
            let type = this[TAPE_CONTENT] === 'market' ? 'entrust' : 'market'
            this.emitDataChange(TAPE_CONTENT, type)
        },
        changeBottomActiveTab(type) {
            // 单击改变选中的左下侧的底部tab
            this.bottomTabConfig.activeType = type
            this.setTabSession(type)
        },
        skipDiagnose() {
            console.log('skipDiagnose')
        },
        skipReport() {
            console.log('skipReport')
        },
        tapeSettings() {
            this.$eventBus.$emit('tapeSet')
        },
        resizeWindow() {
            let ele = this.$refs.detailExtend
            let tabs = this.$refs.tabs
            let top = ele.getBoundingClientRect().top
            let height = tabs.$el.offsetHeight
            let residue = window.innerHeight - top - height

            this.extendHeight = residue
        },
        resetTapeState() {
            this[TAPE_ROWS] = '5'
            this[TAPE_CONTENT] = 'market'
            this[TAPE_STYLE] = 'off'
            this.bottomHideList = []
            this.$nextTick(() => {
                this.resizeWindow()
            })
        },
    },
    beforeDestroy() {
        this.$eventBus.$off(SOCKET_A_MARKET, this.receiveSocketData)
        this.cancleSocket(this.linkIndex)
        this.socketData = {}

        this.$eventBus.$off('tapeDefaultChanged', this.tapeDefaultChanged)
        this.$eventBus.$off('bottomSwitch', this.bottomSwitch)
        this.$eventBus.$off('resetTapeState', this.resetTapeState)
    },
    watch: {
        full_code() {
            if (this.$parent.isAStock) {
                this.loadIdentify = false
                this.cancleSocket(this.linkIndex)
                this.socketData = {}
                this.getInfoData()
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

.detail_head_btn_identify {
    display: flex;
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