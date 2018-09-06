<template>
<Tabs active-style="underline" @on-click="tabClicked">
    <XqdownToUp
        @on-click="changeContainerState"
        slot="navPrev"
        :is-on="vesselState"
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

    </TabPane>
    <TabPane
        label="投资问答"
        :type="question"
        :active="activeKey === question"
    >

    </TabPane>
    <TabPane
        label="大事件"
        :type="bigevent"
        :active="activeKey === bigevent"
    >

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
import News from './News'
import Notice from './Notice'
import LoadMore from '../components/LoadMore'
import XqdownToUp from '../components/XqdownToUp'

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
            vesselState: this.titleState,
        }
    },
    components: {
        Tabs,
        TabPane,
        News,
        Notice,
        LoadMore,
        XqdownToUp,
    },
    methods: {
        tabClicked() {

        },
        changeContainerState(state) {
            this.vesselState = state
            this.$eventBus.$emit('changeInfoState', state)
        },
    },
    props: {
        titleState: {
            type: Boolean,
            default: false,
        }
    }
}
</script>

<style lang="less">

</style>
