<template>
<Tabs
    :activeKey="activeKey"
    @on-click="tabClicked"
    active-style="underline"
>
    <XqdownToUp
        @on-click="changeContainerState"
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

    </TabPane>
    <TabPane
        label="关联品种"
        :type="related"
    >

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
} from '@c/utils/callQt'

import inforJumpMixin from '../mixins/information-jump-mixin'
import informationMixin from '../mixins/information-mixin'

import Tabs from '../components/tabs/'
import TabPane from '../components/tab-pane/'
import LoadMore from '../components/LoadMore.vue'
import XqdownToUp from '../components/XqdownToUp.vue'
import News from './News.vue'
import Notice from './Notice.vue'
import Report from './Report.vue'
import InvestQA from './InvestQA.vue'
import BigEvent from './BigEvent.vue'

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
            related: 'related',
            trade: 'trade',
        }
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
    },
    computed: {
        ...mapState([
            'stock_code',
            'stock_name',
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
    methods: {
        getQueryString(type) {
            let name = encodeURIComponent(this.stock_name)

            return `keyword=${name}&stockCode=${this.stock_code}&type=${type}&stockName=${name}`
        },
        moduleJump() {
            if (this.isNewsActive) {
                let type = 0
                this.jumpInfoMore(type)
            } else if (this.isNoticeActive) {
                this.jumpMoreNotice()
            } else if (this.isReportActive) {
                this.jumpMoreReport()
            } else if (Object.is(this.activeKey, this.question)) {
                let type = 3
                this.jumpInfoMore(type)
            } else if (Object.is(this.activeKey, this.bigevent)) {
                let type = 4
                this.jumpInfoMore(type)
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
            const params = JSON.stringify({
                moduleName: 'reportCenter_/reportClassify',
                stock_code: this.stock_code,
                stock_name: encodeURIComponent(this.stock_name),
            })
            sendEvent('reportCenter', 'searchReport', params, true)
        },
        jumpStockMarket() {

        },
    },
}
</script>
