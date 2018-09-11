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

export default {
    name: 'InfoHkStockTemp',
    mixins: [
        informationMixin,
    ],
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
}
</script>
