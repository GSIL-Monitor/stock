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
        :active="activeKey === news"
    >
        <News/>
    </TabPane>
    <TabPane
        label="公告"
        :type="notice"
        :active="activeKey === notice"
    >
        <Notice/>
    </TabPane>
    <TabPane
        label="研报"
        :type="report"
        :active="activeKey === report"
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
        :active="activeKey === related"
    >

    </TabPane>
    <LoadMore
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
    methods: {
        tabClicked() {

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
