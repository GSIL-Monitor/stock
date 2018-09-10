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
import Tabs from '../components/tabs/'
import TabPane from '../components/tab-pane/'
import LoadMore from '../components/LoadMore'
import XqdownToUp from '../components/XqdownToUp'
import News from './News'

export default {
    name: 'InfoHkStockTemp',
    data() {
        return {
            activeKey: 'news',
            news: 'news',
            trade: 'trade',
            related: 'related',
        }
    },
    components: {
        Tabs,
        TabPane,
        LoadMore,
        XqdownToUp,
        News,
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
