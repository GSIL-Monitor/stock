<template>
    <div
        :class="leftClasses"
        v-show="leftState"
    >
        <Tabs
            :activeKey="leftActiveKey"
            @on-click="tabClicked"
            activeStyle="underline"
            ref="leftTabs"
        >
            <TabPane
                label="推荐标签"
                :type="recommendTags"
            >
                <StockTag/>
            </TabPane>
            <TabPane
                label="自选股"
                :type="mystock"
            >
                <MyStockList/>
            </TabPane>
            <TabPane
                label="最近访问"
                :type="recentVisited"
            >
                <RecentVisit/>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import {
    mapState,
    mapGetters,
    mapMutations,
} from 'vuex'
import {
    LOCAL_LEFT_TAB,
    TAB_RECOMMEND_TAGS,
    TAB_MY_STOCK,
    TAB_RECENT_VISITED,
} from '../storage.js'
import {
    ASTOCK,
} from '@formatter/config/stock-type-config.js'
import {
    LEFT_SELECT_TAB,
} from '@store/stock-detail-store/config/mutation-types.js'

import Tabs from '../components/tabs/index.js'
import TabPane from '../components/tab-pane/index.js'
import StockTag from './StockTag.vue'
import MyStockList from './MyStockList.vue'
import RecentVisit from './RecentVisit.vue'

export default {
    name: 'Left',
    watch: {
        current_type(value, oldValue) {
            if (
                Object.is(ASTOCK, oldValue)
                && Object.is(this.recommendTags, this.leftActiveKey)
            ) {
                this[LEFT_SELECT_TAB](this.mystock)
            }
        },
    },
    data() {
        return {
            recommendTags: TAB_RECOMMEND_TAGS,
            mystock: TAB_MY_STOCK,
            recentVisited: TAB_RECENT_VISITED,
        }
    },
    computed: {
        ...mapState([
            'current_type',
            'full_code',
            'leftState',
            'leftActiveKey',
        ]),
        ...mapGetters([
            'isAStock',
        ]),
        leftClasses() {
            return [
                {
                    root_left_ShowTag: this.isAStock,
                },
            ]
        },
    },
    methods: {
        ...mapMutations([
            LEFT_SELECT_TAB,
        ]),
        tabClicked(type) {
            this[LEFT_SELECT_TAB](type)
        },
        resizeWindow() {
            let $panes = this.$refs.leftTabs.$refs.panes
            let top = $panes.getBoundingClientRect().top
            let residue = window.innerHeight - top

            $panes.style.height = residue + 'px'
        },
    },
    components: {
        Tabs,
        TabPane,
        StockTag,
        MyStockList,
        RecentVisit,
    },
    created() {
        window.addEventListener('resize', this.resizeWindow)
    },
    mounted() {
        this.resizeWindow()
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeWindow)
    },

}
</script>

<style lang="less">
.root_left {
    .gg_tabs_tab:first-child {
        display: none;
    }
    .gg_tabs_wrap {
        flex: 0 0 30px;
        align-items: center;
        justify-content: space-around;
        padding: 0 10px;
        border-bottom: 1px solid var(--color-dividers);
        .gg_tabs_tab  {
            padding: 5px 7px;
        }
    }
}
.root_left_ShowTag {
    .gg_tabs_tab:first-child {
        display: block;
    }
}
</style>
