<template>
    <div class="detail">
        <!-- 顶部信息 -->
        <div class="detail_head">
            <div class="detail_head_title">
                <div class="title_left">
                    <span class="title_left_name">{{formatName}}</span>
                    <span class="title_left_code">{{formatCode}}</span>
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
                :price="price"
                :price_change="price_change"
                :price_change_rate="price_change_rate"
            />
            <div class="detail_head_btn">
                <div class="detail_head_btn_skip">
                    <DefaultBtn
                        text="诊股"
                        className="btn-content"
                        @click="skipDiagnose"
                    />
                    <DefaultBtn
                        text="研报"
                        className="btn-content"
                        @click="skipReport"
                    />
                    <DefaultBtn
                        text="F10"
                        className="btn-content"
                        @click="skipF10"
                    />
                </div>
                <div v-if="isNotEmpty" class="detail_head_btn_identify">
                    <IdentifyIco
                        v-for="(item, index) of identify_list"
                        v-if="identify_ico[item]"
                        :key="index"
                        :className="listIcoConfig[item].class_name"
                        :title="listIcoConfig[item].title"
                        :type="listIcoConfig[item].type"
                        :code="identify_ico[item]"
                    />
                </div>
            </div>
        </div>
        <!-- 买卖五档 -->
        <FiveOrder
            class="detail_order"
            :orderData="orderData"
            :close_price="close_price"
            :stockType="stockType"
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
                                <Turnover :val="turnover"/>
                            </td>
                            <td class="two-letters">换手</td>
                            <td>
                                <TurnoverRate
                                    :val="turnover_rate"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">总手</td>
                            <td>
                                <Volume
                                    :val="volume"
                                />
                            </td>
                            <td class="two-letters">量比</td>
                            <td>
                                <QuantityRatio
                                    :val="quantity_ratio"
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
                                    :val="avg_price"
                                    :close_price="close_price"
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">振幅</td>
                            <td>
                                <Amplitude
                                    :val="amplitude"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">今开</td>
                            <td>
                                <CompareClose
                                    :val="open_price"
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
                                    :val="high_price"
                                    :close_price="close_price"
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">最低</td>
                            <td>
                                <CompareClose
                                    :val="low_price"
                                    :close_price="close_price"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">外盘</td>
                            <td>
                                <VolumeOuter
                                    :val="volume_outer"
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">内盘</td>
                            <td>
                                <VolumeInner
                                    :val="volume_inner"
                                    :current_type="current_type"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="two-letters">涨停</td>
                            <td>
                                <HighLimit
                                    :val="close_price"
                                    :stock_name="stock_name"
                                    :current_type="current_type"
                                />
                            </td>
                            <td class="two-letters">跌停</td>
                            <td>
                                <LowLimit
                                    :val="close_price"
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
            class="tab_switch"
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
import CompanyHonorBtn from './CompanyHonorBtn'
import BelongIndustry from './BelongIndustry'
import TitleTopMarket from './TitleTopMarket'
import DefaultBtn from './DefaultBtn'
import IdentifyIco from './IdentifyIco'
import FiveOrder from './FiveOrder'
import ToggleBtn from './ToggleBtn'
import TabSwitch from './TabSwitch'
import SetIco from '../components/SetIco'

// 底部 tab
import StockTransaction from './StockATransation'
import PricePoint from './PricePoint'
import FundFlow from './FundFlow'
import ShortElves from './ShortElves'
import SimpleFinancial from './SimpleFinancial'

import {
    getLimitStockData,
    getStockIdentity,
} from '@service/'
import {
    formatStockName,
    formatShowCode,
} from '@formatter/format-data'

import listIcoConfig from './identify-config'
import { ASTOCK } from '@formatter/config/stock-type-config'
import {
    TAPE_ROWS,
    TAPE_CONTENT,
    TAPE_STYLE,
    FUNC_PERFORMANCE,
} from '../tape/tape-set-config'
import {
    initTapeDefault,
    initTapeFunc,
} from '../tape/tape-public-func'
import {
    SESSION_ASTOCK_FUNC_TAB,
    SOCKET_A_MARKET,
} from '../storage'
import {
    throttle
} from '@c/utils/util'
import socketMixin from './socket-mixin'
import fiveOrderMixin from './five-order-mixin'
import rightResizeMixin from './right-resize-mixin'

// 盘口一致预期
import ConsensusTable from './ConsensusTable'
// 盘口内容
import MarketInfo from './MarketInfo'
// 盘口内容 -- 字段详情
import Turnover from '@formatter/market-base/Turnover'
import TurnoverRate from '@formatter/market-base/TurnoverRate'
import Volume from '@formatter/market-base/Volume'
import QuantityRatio from '@formatter/market-base/QuantityRatio'
import ConsensusFields from '@formatter/market-base/ConsensusFields'
import MarketValue from '@formatter/market-base/MarketValue'
import CompareClose from '@formatter/market-base/CompareClose'
import Amplitude from '@formatter/market-base/Amplitude'
import ClosePrice from '@formatter/market-base/ClosePrice'
import VolumeOuter from '@formatter/market-base/VolumeOuter'
import VolumeInner from '@formatter/market-base/VolumeInner'
import HighLimit from '@formatter/market-base/HighLimit'
import LowLimit from '@formatter/market-base/LowLimit'

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
            socketData: {},
            industry_name: '',
            stock_name: '',
            symbol_type: null,
            price: null,
            price_change: null,
            price_change_rate: null,
            stock_type: null,
            identify_ico: {},
            close_price: null,

            turnover: null,
            turnover_rate: null,
            volume: null,
            quantity_ratio: null,
            pe_y1: null,
            mcap: null,
            pb_y1: null,
            tcap: null,
            avg_price: null,
            amplitude: null,
            open_price: null,
            high_price: null,
            low_price: null,
            volume_outer: null,
            volume_inner: null,
            mark: false,

            showFilterPopUp: true,
            identify_list: ['sh', 'sz', 'rzrq', 'sz_50', 'hs_300'],
            listIcoConfig,
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
        IdentifyIco,
        FiveOrder,
        ToggleBtn,
        TabSwitch,
        SetIco,

        SimpleFinancial,
        StockTransaction,
        PricePoint,
        FundFlow,
        ShortElves,

        ConsensusTable,
        MarketInfo,
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
        stockType() {
            return ASTOCK
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
        formatParam() {
            return {
                source: this.source,
                symbol_type: this.symbol_type,
                stock_type: this.stock_type,
                close_price: this.close_price,
            }
        },
        formatName() {
            return formatStockName(this.stock_name, {
                source: this.source,
                symbol_type: this.symbol_type,
            })
        },
        formatCode() {
            return formatShowCode(this.stock_code, {
                source: this.source,
            })
        },
        isNotEmpty() {
            return Object.keys(this.identify_ico).length !== 0
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
                    this.symbol_type = data.symbol_type
                    this.stock_type = data.stock_type

                    this.industry_name = data.industry_name
                    this.stock_name = data.stock_name

                    this.price = data.price
                    this.price_change = data.change_value
                    this.price_change_rate = data.change_rate

                    this.close_price = data.close_price

                    this.setFiveOrderFields('buy', data)
                    this.setFiveOrderFields('sell', data)

                    this.buy1_diff = 0
                    this.buy2_diff = 0
                    this.buy3_diff = 0
                    this.buy4_diff = 0
                    this.buy5_diff = 0
                    this.sell1_diff = 0
                    this.sell2_diff = 0
                    this.sell3_diff = 0
                    this.sell4_diff = 0
                    this.sell5_diff = 0

                    this.turnover = data.turnover ? data.turnover * 10000 : data.turnover
                    this.turnover_rate = data.turnover_rate ? data.turnover_rate * 100 : data.turnover_rate
                    this.volume = data.volume ? data.volume / 100 : data.volume
                    this.quantity_ratio = data.quantity_ratio
                    this.pe_y1 = data.pe_y1
                    this.mcap = data.mcap * 10000
                    this.pb_y1 = data.pb_y1
                    this.tcap = data.tcap * 10000
                    this.avg_price = data.avg_price
                    this.amplitude = data.amplitude
                    this.open_price = data.open_price
                    this.high_price = data.high_price
                    this.low_price = data.low_price
                    this.volume_outer = data.volume_outer ? data.volume_outer / 100 : data.volume_outer
                    this.volume_inner = data.volume_inner ? data.volume_inner / 100 :  data.volume_inner
                },
                afterResponse: () => {
                    this.sendLink(this.linkAddress)
                    this.rememberLink(this.linkAddress, this.linkIndex)
                    // TODO: 获取基础属性信息
                    this.getStockIdentity()
                },
            }

            getLimitStockData(param)
        },
        receiveSocketData(...args) {
            let data = args[0][0]
            // 清空
            this.mark = Object.is(data.mark, 1) ? true : false
            // 继承推送数据
            this.socketData = Object.assign({}, this.socketData, data)
            let socketData = this.socketData

            // 计算五档 volume 差值
            this.setDiffValue('buy')
            this.setDiffValue('sell')

            this.price = socketData.price
            this.price_change = socketData.price_change
            this.price_change_rate = socketData.price_change_rate

            this.close_price = socketData.close_price

            this.setFiveOrderFields('buy', socketData)
            this.setFiveOrderFields('sell', socketData)

            this.turnover = socketData.turnover ? socketData.turnover * 10000 : socketData.turnover
            this.turnover_rate = socketData.turnover_rate
            this.volume = socketData.volume ? socketData.volume / 100 : socketData.volume
            this.quantity_ratio = socketData.quantity_ratio
            this.pe_y1 = socketData.pe_y1
            this.mcap = socketData.mcap * 10000
            this.pb_y1 = socketData.pb_y1
            this.tcap = socketData.tcap * 10000
            this.avg_price = socketData.avg_price
            this.amplitude = socketData.amplitude
            this.open_price = socketData.open_price
            this.high_price = socketData.high_price
            this.low_price = socketData.low_price
            this.volume_outer = socketData.volume_outer ? socketData.volume_outer / 100 : socketData.volume_outer
            this.volume_inner = socketData.volume_inner ? socketData.volume_inner / 100 :  socketData.volume_inner

            // 成交明细
            if (this.isTransationShow && data.transaction_type && data.transaction_volume) {
                let one = {
                    update_time: data.date,
                    price: socketData.price,
                    price_change: socketData.price_change,
                    volume: Math.floor(Math.round(data.transaction_volume / 100)),
                    transaction_type: data.transaction_type,
                    deal_count: socketData.deal_count,
                }
                this.$refs.transactionComponent.pushData(one)
            }
       },
        getStockIdentity() {
            let param = {
                options: {
                    full_code: this.full_code,
                },
                callback0: data => {
                    this.identify_ico = data
                },
                callback1001: () => {
                    this.identify_ico = {}
                },
            }
            getStockIdentity(param)
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
        skipF10() {
            console.log('f10')
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
    },
    beforeDestroy() {
        this.$eventBus.$off(SOCKET_A_MARKET, this.receiveSocketData)
        this.cancleSocket(this.linkIndex)
        this.socketData = {}

        this.$eventBus.$off('tapeDefaultChanged', this.tapeDefaultChanged)
        this.$eventBus.$off('bottomSwitch', this.bottomSwitch)
    },
    watch: {
        full_code() {
            if (this.$parent.isAStock) {
                this.cancleSocket(this.linkIndex)
                this.socketData = {}
                this.getInfoData()
            }
        },
    },
}
</script>

<style lang="less">
.detail_head {
    padding: 8px 10px 6px;
}
.detail_head_title {
    display: flex;
    justify-content: space-between;
}
.title_left {
    display: flex;
    align-items: center;
}
.title_left_name {
    font-size: 18px;
}
.title_left_code {
    font-size: 16px;
}
.title_left_name,
.title_left_code {
    margin-right: 5px;
    color: rgba(255, 255, 255, 0.75);
}
.title_right_set {
    align-self: flex-start;
}
.belong_industry {
    margin-left: 5px;
}
.detail_head_market,
.detail_head_btn {
    margin-top: 5px;
}
.detail_head_btn_skip,
.detail_head_btn_identify {
    display: flex;
}
.detail_head_btn {
    display: flex;
    justify-content: space-between;
}
.btn-content {
    margin-left: 8px;
    &:first-child {
        margin-left: 0;
    }
}
.detail_head_btn_identify {
    font-size: 12px;
    .identify_ico {
        margin-left: 1px;
        &:first-child {
            margin-left: 0;
        }
    }
    .general-ico {
        background-color: #e03c43;
        color: #fff;
        &:after {
            content: '通';
        }
    }
    .melt-ico {
        background-color: #efa440;
        &:after {
            content: '融';
        }
    }
    .hsi-ico {
        // background: url("../ico/hsi-ico.png") no-repeat;
    }
    .sz-50 {
        // background: url("../ico/sz50-ico.png") no-repeat;
    }
    .hs-300 {
        // background: url("../ico/hs300-ico.png") no-repeat;
    }
}
.detail_info {
    display: flex;
    font-size: 13px;
    overflow: hidden;
}
.detail_info_Limit {
    height: 93px;
}
.detail_info_Full {
    height: 209px;
}
.detail_info_table {
    flex: 1;
    table {
        width: 100%;
        tr {
            height: 21px;
        }
    }
}
.detail_info_toggle {
    flex: 0 0 12px;
}
.detail_table_A {
    cursor: pointer;
}
</style>