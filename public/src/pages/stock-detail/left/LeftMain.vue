<template>
    <div
        :class="leftClasses"
        v-show="leftState"
    >
        <Tabs
            activeStyle="underline"
            ref="leftTabs"
            @on-click="tabClicked"
        >
            <TabPane
                label="推荐标签"
                :type="recommendTags"
                :active="activeKey === recommendTags"
            >
                <StockTag/>
            </TabPane>
            <TabPane
                label="自选股"
                :type="mystock"
                :active="activeKey === mystock"
            >
                <MyStockList/>
            </TabPane>
            <TabPane
                label="最近访问"
                :type="recentVisited"
                :active="activeKey === recentVisited"
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
import Tabs from '../components/tabs/'
import TabPane from '../components/tab-pane/'
import StockTag from './StockTag'
import MyStockList from './MyStockList'
import RecentVisit from './RecentVisit'

export default {
    name: 'Left',
    created() {
        this.initState()

        window.addEventListener('resize', this.resizeWindow)
    },
    mounted() {
        this.resizeWindow()
    },
    data() {
        return {
            recommendTags: 'tag',
            mystock: 'stock',
            recentVisited: 'recent',
            activeKey: 'stock',
        }
    },
    computed: {
        ...mapState([
            'current_type',
            'leftState',
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
    },
    // beforeDestroy() {

    // },
    watch: {
        current_type(value, oldValue) {

        },
    },
    destroyed() {
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

