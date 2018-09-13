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
        :label="loadMoreLabel"
        slot="navNext"
    />
</Tabs>
</template>

<script>
import informationMixin from '../mixins/information-mixin'

import Tabs from '../components/tabs/'
import TabPane from '../components/tab-pane/'
import LoadMore from '../components/LoadMore'
import XqdownToUp from '../components/XqdownToUp'
import News from './News'
import Notice from './Notice'
import Report from './Report'
import InvestQA from './InvestQA'
import BigEvent from './BigEvent'

export default {
    name: 'InfoStockA',
    mixins: [
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
}
</script>
