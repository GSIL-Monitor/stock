<template>
<Tabs
    :activeKey="activeKey"
    active-style="underline"
    @on-click="$_tabClicked"
>
    <XqdownToUp
        @on-click="$_changeContainerState"
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
        <TradeStocks/>
    </TabPane>
    <TabPane
        label="关联品种"
        :type="related"
    >
        <RelatedType/>
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
import {
    sendEvent,
} from '@c/utils/callQt.js'

import inforJumpMixin from '../mixins/information-jump-mixin.js'
import informationMixin from '../mixins/information-mixin.js'

import Tabs from '../components/tabs/index.js'
import TabPane from '../components/tab-pane/index.js'
import LoadMore from '../components/LoadMore.vue'
import XqdownToUp from '../components/XqdownToUp.vue'
import News from './News.vue'
import TradeStocks from './TradeStocks.vue'
import RelatedType from './RelatedType.vue'

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
        TradeStocks,
        RelatedType,
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
        jumpStockMarket() {
            const params = JSON.stringify({
                hash: 'hk_stock'
            })
            sendEvent('stockMarket', 'stockMarketDetail', params, true)
        },
        moduleJump() {
            if (Object.is(this.activeKey, this.news)) {
                let type = 0
                this.$_jumpInfoMore(type)
            } else if (Object.is(this.activeKey, this.trade)) {
                this.jumpStockMarket()
            }
        },
    },
}
</script>
