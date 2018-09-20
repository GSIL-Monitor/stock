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
        @on-click="moduleJump"
        slot="navNext"
    />
</Tabs>
</template>

<script>
import {
    mapState,
} from 'vuex'

import inforJumpMixin from '../mixins/information-jump-mixin'
import informationMixin from '../mixins/information-mixin'

import Tabs from '../components/tabs/'
import TabPane from '../components/tab-pane/'
import LoadMore from '../components/LoadMore.vue'
import XqdownToUp from '../components/XqdownToUp.vue'
import News from './News.vue'

export default {
    name: 'InfoHkStockTemp',
    mixins: [
        inforJumpMixin,
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
    computed: {
        ...mapState([
            'stock_code',
        ]),
    },
    methods: {
        getQueryString() {
            let name = encodeURIComponent(this.stock_name)
            return `keyword=${name}&stockCode=${this.stock_code}&type=0&hk_stock=1&stockName=${name}`
        },
        moduleJump() {
            if (Object.is(this.activeKey, this.news)) {
                let type = 0
                this.jumpInfoMore(type)
            }
        },
    },
}
</script>
