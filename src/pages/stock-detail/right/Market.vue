<template>
    <div class="detail detail_Market">
        <!-- 顶部信息 -->
        <div class="detail_head">
            <div class="detail_head_title">
                <div class="title_left">
                    <StockName
                        class="title_left_name"
                        :val="stock_name"
                        :current_type="current_type"
                    />
                    <StockCode
                        class="title_left_code"
                        :val="stock_code"
                        :source="source"
                    />
                </div>
            </div>
            <TitleTopMarket
                class="detail_head_market"
                :source="source"
                :symbol_type="symbol_type"
                :price="socketData.price"
                :price_change="socketData.price_change"
                :price_change_rate="socketData.price_change_rate"
            />
            <div class="detail_head_btn">
                <div class="detail_head_btn_skip">
                    <ButtonF10
                        v-if="isImportantCode"
                    />
                </div>
            </div>
        </div>
        <div class="detail_info">
            <MarketInfo class="detail_table_Index">
                <tr>
                    <td class="two-letters">开盘</td>
                    <td>
                        <CompareClose
                            :close_price="close_price"
                            :val="socketData.open_price"
                            :current_type="current_type"
                        />
                    </td>
                    <td class="two-letters">昨收</td>
                    <td>
                        <ClosePrice
                            :val="close_price"
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
                    <td class="two-letters">金额</td>
                    <td>
                        <Turnover
                            :val="socketData.turnover"
                        />
                    </td>
                </tr>
                <tr>
                    <td class="two-letters">最高</td>
                    <td>
                        <CompareClose
                            :close_price="close_price"
                            :val="socketData.high_price"
                            :current_type="current_type"
                        />
                    </td>
                    <td class="two-letters">最低</td>
                    <td>
                        <CompareClose
                            :close_price="close_price"
                            :val="socketData.low_price"
                            :current_type="current_type"
                        />
                    </td>
                </tr>
                <tr>
                    <td class="two-letters">振幅</td>
                    <td>
                        <Amplitude
                            :val="socketData.amplitude"
                        />
                    </td>
                    <td class="two-letters">平盘</td>
                    <td>
                        <Flat
                            :val="socketData.flat"
                        />
                    </td>
                </tr>
                <tr>
                    <td class="two-letters">上涨</td>
                    <td>
                        <Rose
                            :val="socketData.rose"
                        />
                    </td>
                    <td class="two-letters">下跌</td>
                    <td>
                        <Fall
                            :val="socketData.fall"
                        />
                    </td>
                </tr>
            </MarketInfo>
        </div>
        <Tabs
            :activeKey="activeKey"
            average
            ref="marketDetailTabs"
            @on-click="tabClicked"
        >
            <TabPane
                label="成分股"
                :type="constituent"
            >
                <ConstituentStock
                    :plate_code="full_code"
                />
            </TabPane>
            <TabPane
                label="涨跌分布"
                :type="rangeScope"
            >
                <ChangeRange/>
            </TabPane>
            <TabPane
                label="其他指数"
                :type="otherIndex"
            >
                <div>3</div>
            </TabPane>
            <TabPane
                label="短线精灵"
                :type="shortLine"
            >
                <ShortElves/>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import {
    mapState,
    mapActions,
    mapMutations,
} from 'vuex'
import {
    SOCKET_HSINDEX_MARKET,
    SESSION_INDEX_FUNC_TAB,
} from '../storage'
import {
    GET_HS_INDEX_MARKET_DATA,
} from '@store/stock-detail-store/config/action-types'
// import {
//     HSINDEX_CATEGORY,
// } from '@store/stock-detail-store/config/mutation-types'

import rightResizeMixin from '../mixins/right-resize-mixin'
import socketMixin from '../mixins/socket-mixin'

import Tabs from '../components/tabs/'
import TabPane from '../components/tab-pane/'
import ButtonF10 from '../components/ButtonF10.vue'
import TitleTopMarket from './TitleTopMarket.vue'
import StockName from '@formatter/market-base/StockName.vue'
import StockCode from '@formatter/market-base/StockCode.vue'
import CompareClose from '@formatter/market-base/CompareClose.vue'
import Volume from '@formatter/market-base/Volume.vue'
import Turnover from '@formatter/market-base/Turnover.vue'
import ClosePrice from '@formatter/market-base/ClosePrice.vue'
import Amplitude from '@formatter/market-base/Amplitude.vue'
import Flat from '@formatter/market-base/Flat.vue'
import Rose from '@formatter/market-base/Rose.vue'
import Fall from '@formatter/market-base/Fall.vue'
import MarketInfo from './MarketInfo.vue'
import ConstituentStock from './ConstituentStock.vue'
import ChangeRange from './ChangeRange.vue'
import OtherIndex from './OtherIndex.vue'
import ShortElves from './ShortElves.vue'

export default {
    name: 'MarketTemp',
    mixins: [
        rightResizeMixin,
        socketMixin,
    ],
    created() {
        this.initState()
        this.$eventBus.$on(SOCKET_HSINDEX_MARKET, this.receiveSocketData)
        this.getInfoData()
    },
    data() {
        return {
            defaultKey: 'constituent',
            constituent: 'constituent',
            rangeScope: 'rangeScope',
            otherIndex: 'otherIndex',
            shortLine: 'shortLine',
            activeKey: null,
            category_type: null,

            linkIndex: 0,
            socketData: {},
            symbol_type: null,
            stock_name: null,
            close_price: null,
        }
    },
    components: {
        TitleTopMarket,
        ButtonF10,
        MarketInfo,
        StockName,
        StockCode,
        CompareClose,
        Volume,
        Turnover,
        ClosePrice,
        Amplitude,
        Flat,
        Rose,
        Fall,
        Tabs,
        TabPane,
        ConstituentStock,
        ChangeRange,
        OtherIndex,
        ShortElves,
    },
    computed: {
        ...mapState([
            'source',
            'stock_code',
            'full_code',
            'current_type',
        ]),
        isImportantCode() {
            return ['930715','000905','000133','399006','399005','000009','000904','399001','000906','000132','000300','000001','000010','000903','000016'].includes(this.stock_code)
        },
        isBKIndex() {
            return Object.is(this.source, 'BK')
        },
        linkAddress() {
            return `request_name:push/hq/list_info|first_push:true|request_param:fullcodes=${this.full_code}|request_id:${SOCKET_HSINDEX_MARKET}`
        },
        isConstituentActive() {
            return Object.is(this.activeKey, this.constituent)
        },
        isAwaitCase() {
            return this.isConstituentActive
        },
    },
    methods: {
        // ...mapMutations([
        //     HSINDEX_CATEGORY,
        // ]),
        ...mapActions({
            getIndexData: GET_HS_INDEX_MARKET_DATA,
        }),
        resizeWindow() {
            let $panes = this.$refs.marketDetailTabs.$refs.panes
            let top = $panes.getBoundingClientRect().top
            let tabHeight = this.$refs.marketDetailTabs.$refs.navWrap.offsetHeight
            let residue = window.innerHeight - top - tabHeight

            $panes.style.height = residue + 'px'
        },
        initState() {
            let item = sessionStorage.getItem(SESSION_INDEX_FUNC_TAB)
            this.activeKey = item || this.defaultKey
        },
        getInfoData() {
            const params = {
                options: {
                    fullcode: this.full_code
                },
                callback0: data => {
                    // this[HSINDEX_CATEGORY](data.category)
                    this.stock_name = data.name
                    this.symbol_type = data.symbol_type
                    this.close_price = data.close_price

                    this.socketData.price = data.price
                    this.socketData.price_change = data.change_value
                    this.socketData.price_change_rate = data.change_rate

                    this.socketData.volume = data.volume ? data.volume / 100 : data.volume
                    this.socketData.turnover = data.turnover ? data.turnover * 10000 : data.turnover
                    this.socketData.high_price = data.high_price
                    this.socketData.low_price = data.low_price
                    this.socketData.open_price = data.open_price
                    this.socketData.amplitude = data.amplitude

                    this.socketData.flat = data.flat
                    this.socketData.rose = data.rose
                    this.socketData.fall = data.fall
                },
                afterResponse: () => {
                    this.sendLink(this.linkAddress)
                    this.rememberLink(this.linkAddress, this.linkIndex)
                },
            }

            this.getIndexData(params)
        },
        receiveSocketData(...args) {
            let data = args[0][0]
            // 清空
            if (Object.is(data.mark, 1)) {
                this.socketData = {}
                return false
            }
            const transferData = Object.assign({}, data)
            if (transferData.turnover) {
                transferData.turnover = transferData.turnover * 10000
            }
            if (transferData.volume) {
                transferData.volume = transferData.volume / 100
            }
            // 继承推送数据
            this.socketData = Object.assign({}, this.socketData, transferData)
            // 不清空数据
            this.close_price = this.socketData.close_price
        },
        tabClicked(type) {
            this.activeKey = type
            sessionStorage.setItem(SESSION_INDEX_FUNC_TAB, type)
        },
    },
    beforeDestroy() {
        this.$eventBus.$off(SOCKET_HSINDEX_MARKET, this.receiveSocketData)
    },
    watch: {
        full_code() {
            this.cancleSocket(this.linkIndex)
            this.socketData = {}
            this.$nextTick(()=> {
                this.resizeWindow()
            })
            this.getInfoData()
        }
    },
}
</script>

<style lang="less">
.detail_Market {
    .gg_tabs {
        flex-direction: column-reverse;
    }
    .gg_tabs_wrap {
        height: 30px;
        border-top: none;
        border-bottom: none;
        background: var(--color-smallcard-background);
    }
    .gg_tabs_tab_text {
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .gg_tabs_tab {
        border-right: 1px solid var(--color-border);
        color: var(--color-primary-text);
    }
    .gg_tabs_tab_active {
        background: var(--color-card-background);
        color: var(--color-selected);
    }
}
</style>