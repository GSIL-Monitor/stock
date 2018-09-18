<template>
    <div
        :class="leftClasses"
        v-show="leftState"
    >
        <Tabs
            :activeKey="activeKey"
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
} from 'vuex'
import {
    LOCAL_LEFT_TAB,
} from '../storage'
import {
    ASTOCK,
} from '@formatter/config/stock-type-config'

import Tabs from '../components/tabs/'
import TabPane from '../components/tab-pane/'
import StockTag from './StockTag.vue'
import MyStockList from './MyStockList.vue'
import RecentVisit from './RecentVisit.vue'

export default {
    name: 'Left',
    created() {
        this.initState()

        this.$eventBus.$on('changeSelectKey', this.changeSelectKey)
        window.addEventListener('resize', this.resizeWindow)
    },
    mounted() {
        this.resizeWindow()
    },
    data() {
        return {
            recommendTags: 'tags',
            mystock: 'stock',
            recentVisited: 'recent',
            activeKey: 'stock',
        }
    },
    computed: {
        ...mapState([
            'current_type',
            'leftState',
            'full_code',
        ]),
        ...mapGetters([
            'isAStock'
        ]),
        leftClasses() {
            return [
                {
                    root_left_ShowTag: this.isAStock
                },
            ]
        },
    },
    components: {
        Tabs,
        TabPane,
        StockTag,
        MyStockList,
        RecentVisit,
    },
    methods: {
        initState() {
            let store = this.getStore()
            this.activeKey = store
        },
        getStore() {
            let record = localStorage.getItem(LOCAL_LEFT_TAB)

            return record || this.mystock
        },
        setStore() {
            localStorage.setItem(LOCAL_LEFT_TAB, this.activeKey)
        },
        tabClicked(type) {
            this.activeKey = type
            this.setStore()
        },
        resizeWindow() {
            let $panes = this.$refs.leftTabs.$refs.panes
            let top = $panes.getBoundingClientRect().top
            let residue = window.innerHeight - top

            $panes.style.height = residue + 'px'
        },
        changeSelectKey(key) {
            // 只记录，不设置本地存储
            this.activeKey = key
        },
    },
    beforeDestroy() {
        this.$eventBus.$off('changeSelectKey', this.changeSelectKey)
        window.removeEventListener('resize', this.resizeWindow)
    },
    watch: {
        current_type(value, oldValue) {
            if (
                Object.is(ASTOCK, oldValue)
                && Object.is(this.recommendTags, this.activeKey)
            ) {
                this.activeKey = this.mystock
            }
        },
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
