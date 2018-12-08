<template>
<Tabs
    :active-key="activeKey"
    active-style="underline"
    @on-click="$_tabClicked"
>
    <XqdownToUp
        @on-click="$_changeContainerState"
        slot="navPrev"
        :is-on="titleState"
    />
    <TabPane
        label="新闻"
        :type="news"
    >
        <News/>
    </TabPane>
    <TabPane
        label="公告"
        :type="notice"
    >
        <Notice/>
    </TabPane>
    <TabPane
        label="研报"
        :type="report"
    >
        <Report/>
    </TabPane>
    <TabPane
        label="投资问答"
        :type="question"
    >
        <InvestQA/>
    </TabPane>
    <TabPane
        label="大事件"
        :type="bigevent"
    >
        <BigEvent/>
    </TabPane>
    <TabPane
        label="同业股票"
        :type="trade"
    >
        <TradeStocks/>
    </TabPane>
    <TabPane
        label="关联品种"
        :type="related"
    >
        <RelatedType/>
    </TabPane>
    <LoadMore
        v-show="isShowMore"
        @on-click="moduleJump"
        :label="loadMoreLabel"
        slot="navNext"
    />
</Tabs>
</template>

<script>
import {
    mapState,
} from 'vuex'
import {
    sendEvent,
} from '@c/utils/callQt.js'
import {
    getGGnewsHost,
} from '@c/utils/util.js'
import inforJumpMixin from '../mixins/information-jump-mixin.js'
import informationMixin from '../mixins/information-mixin.js'

import Tabs from '../components/tabs/index.js'
import TabPane from '../components/tab-pane/index.js'
import LoadMore from '../components/LoadMore.vue'
import XqdownToUp from '../components/XqdownToUp.vue'
import News from './News.vue'
import Notice from './Notice.vue'
import Report from './Report.vue'
import InvestQA from './InvestQA.vue'
import BigEvent from './BigEvent.vue'
import TradeStocks from './TradeStocks.vue'
import RelatedType from './RelatedType.vue'

export default {
    name: 'InfoStockA',
    mixins: [
        inforJumpMixin,
        informationMixin,
    ],
    data() {
        return {
            activeKey: 'news',
            news: 'news',
            notice: 'notice',
            report: 'report',
            question: 'question',
            bigevent: 'bigevent',
            trade: 'trade',
            related: 'related',
            tradeCode: {},
        }
    },
    computed: {
        ...mapState([
            'stock_code',
            'stock_name',
            'full_code',
        ]),
        loadMoreLabel() {
            let prefix = '更多'

            return this.isNewsActive ? `${prefix}新闻` :
                    this.isNoticeActive ? `${prefix}公告`:
                    this.isReportActive ? `${prefix}研报`:
                    prefix
        },
        isNewsActive() {
            return Object.is(this.activeKey, this.news)
        },
        isNoticeActive() {
            return Object.is(this.activeKey, this.notice)
        },
        isReportActive() {
            return Object.is(this.activeKey, this.report)
        },
        isRelatedActive() {
            return Object.is(this.activeKey, this.related)
        },
        isShowMore() {
            return !this.isRelatedActive
        },
    },
    watch: {
        full_code() {
            this.tradeCode = {}
        },
    },
    components: {
        Tabs,
        TabPane,
        LoadMore,
        XqdownToUp,
        News,
        Notice,
        Report,
        BigEvent,
        InvestQA,
        TradeStocks,
        RelatedType,
    },
    methods: {
        getQueryString(type) {
            let name = encodeURIComponent(this.stock_name)

            return `keyword=${name}&stockCode=${this.stock_code}&type=${type}&stockName=${name}`
        },
        moduleJump() {
            if (this.isNewsActive) {
                let type = 0
                this.$_jumpInfoMore(type)
            } else if (this.isNoticeActive) {
                this.jumpMoreNotice()
            } else if (this.isReportActive) {
                this.jumpMoreReport()
            } else if (Object.is(this.activeKey, this.question)) {
                let type = 3
                this.$_jumpInfoMore(type)
            } else if (Object.is(this.activeKey, this.bigevent)) {
                let type = 4
                this.$_jumpInfoMore(type)
            } else if (Object.is(this.activeKey, this.trade)) {
                this.jumpStockMarket()
            }
        },
        jumpMoreNotice() {   
            const params = JSON.stringify({
                stockCode: this.stock_code,
                stockName: encodeURIComponent(this.stock_name),
            })
            sendEvent('bulletinCenter', 'bulletinCenter', params, true)
        },
        jumpMoreReport() {
            let hash = location.hash.substr(1)
            const params = JSON.stringify({
                moduleName: 'reportCenter_/reportClassify',
                stock_code: hash,
                stock_name: encodeURIComponent(this.stock_name),
            })
            sendEvent('reportCenter', 'searchReport', params, true)
        },
        jumpStockMarket() {
            if (!this.tradeCode || !this.tradeCode.plate_code) {
                alert('暂无申万二级行业')
                return false
            }
            let plate_code = this.tradeCode.plate_code
            const params = JSON.stringify({
                plate_code: plate_code
            })
            sendEvent('stockMarket', 'stockMarketDetail', params, true)
        },
        changeTradeCode(obj) {
            this.tradeCode = obj
        },
    },
    created() {
        this.$_eventBus.$on('tradeCode', this.changeTradeCode)
    },
    beforeDestroy() {
        this.$_eventBus.$off('tradeCode', this.changeTradeCode)
    },
}
</script>
