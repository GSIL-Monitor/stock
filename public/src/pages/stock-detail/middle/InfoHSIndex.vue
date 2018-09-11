<template>
<Tabs
    :activeKey="activeKey"
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
    >
        <News/>
    </TabPane>
    <TabPane
        label="公告"
        :type="notice"
    >
        <Notice/>
    </TabPane>
    <LoadMore
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

export default {
    name: 'InfoHSIndexTemp',
    mixins: [
        informationMixin,
    ],
    data() {
        return {
            activeKey: 'news',
            news: 'news',
            notice: 'notice',
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
}
</script>
