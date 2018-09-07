<template>
<Tabs
    active-style="underline"
    @on-click="tabClicked"
>
    <XqdownToUp
        @on-click="changeContainerState"
        slot="navPrev"
        :is-on="titleState"
    />
    <TabPane
        label="新闻"
        :type="news"
        :active="isNewsActive"
    >
        <News/>
    </TabPane>
    <TabPane
        label="公告"
        :type="notice"
        :active="isNoticeActive"
    >
        <Notice/>
    </TabPane>
    <TabPane
        label="研报"
        :type="report"
        :active="isReportActive"
    >
        <Report/>
    </TabPane>
    <TabPane
        label="投资问答"
        :type="question"
        :active="activeKey === question"
    >
        <InvestQA/>
    </TabPane>
    <TabPane
        label="大事件"
        :type="bigevent"
        :active="activeKey === bigevent"
    >
        <BigEvent/>
    </TabPane>
    <TabPane
        label="同业股票"
        :type="trade"
        :active="activeKey === trade"
    >

    </TabPane>
    <TabPane
        label="关联品种"
        :type="related"
        :active="isTradeActive"
    >

    </TabPane>
    <LoadMore
        v-show="isShowMore"
        :label="loadMoreLabel"
        slot="navNext"
    />
</Tabs>
</template>

<script>
import Tabs from '../tabs/'
import TabPane from '../tab-pane/'
import LoadMore from '../components/LoadMore'
import XqdownToUp from '../components/XqdownToUp'
import News from './News'
import Notice from './Notice'
import Report from './Report'
import InvestQA from './InvestQA'
import BigEvent from './BigEvent'

export default {
    name: 'InfoStockA',
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
        isTradeActive() {
            return Object.is(this.activeKey, this.trade)
        },
        isShowMore() {
            return !this.isTradeActive
        },
    },
    methods: {
        tabClicked(type) {
            this.activeKey = type
        },
        changeContainerState(state) {
            this.$eventBus.$emit('changeInfoState', state)
        },
    },
    props: {
        titleState: {
            type: Boolean,
            default: false,
        },
    },
}
</script>

<style lang="less">

</style>
