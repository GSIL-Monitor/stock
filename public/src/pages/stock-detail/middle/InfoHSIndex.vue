<template>
<Tabs
    active-style="underline"
    @on-click="tabClicked"
>
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

export default {
    name: 'InfoHSIndexTemp',
    data() {
        return {
            activeKey: 'news',
            news: 'news',
            notice: 'notice',
            vesselState: this.titleState,
        }
    },
    components: {
        Tabs,
        TabPane,
        LoadMore,
        XqdownToUp,
        News,
        Notice,
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
    },
}
</script>

<style lang="less">

</style>
