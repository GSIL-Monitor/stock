<template>
<div
    class="right_bottom_container"
>
    <div
        class="view_title"
    >
        <div>
            短线精灵
        </div>
        <div
            class="line_title_right"
        >
            <span
                class="line_title_right_only"
                :class="classes"
                @click="watchOnly"
            >
                {{watchOnlyMsg}}
            </span>
            <SetIco
                class="transa_title_right_set"
                @click="filterLine"
            />
        </div>
    </div>
    <ul
        class="view_vessel"
        v-infinite-scroll="loadMoreData"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="60"
        infinite-scroll-throttle-delay="100"
        @dblclick="dblclickLi"
        v-show="dataStore.length"
        ref="scrollContainer"
    >
        <ShortElvesItem
            v-for="(item, index) of dataStore"
            class="j_short_line_li"
            :key="index"
            :data-full_code="item.fullcode"
            :type="item.type"
            :tdate="item.tdate"
            :name="item.name"
            :value="item.value"
        />
    </ul>
    <div
        v-if="noData"
        class="extend_nodata"
    >暂无数据</div>
</div>
</template>

<script>
import {
    mapState,
    mapGetters,
} from 'vuex'
import {
    getShortLine,
} from '@service/index.js'
import {
    changePageStock,
} from '../utility.js'
import {
    FRAME_SHORT_LINE,
    LOCAL_SHORT_LINE_SET,
} from '../storage.js'
import {
    pushData,
    UnSubscriptSockets,
} from '@c/utils/callQt.js'

import SetIco from '../components/SetIco.vue'
import ShortElvesItem from './ShortElvesItem.vue'

export default {
    name: 'ShortElves',
    created() {
        this.initType()
        this.getInfo()
        goGoal.event.listen(FRAME_SHORT_LINE, this.receiveSocketData)
        this.$_eventBus.$on('shortFilterChanged', this.shortFilterChanged)
    },
    data() {
        return {
            stock_only: false,
            dataStore: [],
            busy: true,
            rows: 50,
            end_date: null,
            noData: false,
            type: null,
            isFirstRequest: true,
        }
    },
    components: {
        ShortElvesItem,
        SetIco,
    },
    computed: {
        ...mapGetters([
            'isAStock',
            'isHSIndex',
        ]),
        ...mapState([
            'current_type',
            'full_code',
            'source',
        ]),
        classes() {
            return [{
                on: this.isStockOnly,
            }, ]
        },
        watchOnlyMsg() {
            if (this.isAStock) {
                return `只看该股`
            } else if (this.isHSIndex) {
                return `只看成分股`
            }
        },
        isStockOnly() {
            return this.stock_only
        },
        subParams() {
            const o = {
                request_name: 'dynamic/list_info',
            }

            if (this.type) {
                o.type = this.type
            }
            if (this.isAStock && this.isStockOnly) {
                o.code = this.full_code
            } else if (this.isHSIndex && this.isStockOnly) {
                o.group_code = this.full_code
                o.group_type = this.indexGroupType
            }

            return o
        },
        indexGroupType() {
            return Object.is(this.source, 'BK') ? '3' : '5'
        },
    },
    methods: {
        subToFrame() {
            console.log(this.subParams)
            pushData(FRAME_SHORT_LINE, this.subParams)
        },
        unSubToFrame() {
            UnSubscriptSockets(FRAME_SHORT_LINE)
        },
        getStore() {
            let store = localStorage.getItem(LOCAL_SHORT_LINE_SET)
            return store ? JSON.parse(store) : null
        },
        initType() {
            let store = this.getStore()
            if (store) {
                this.type = store.join(';')
            }
        },
        getParams() {
            const o = {
                rows: this.rows,
            }
            if (this.end_date) {
                o.end_date = this.end_date
            }
            if (this.stock_only) {
                if (this.isAStock) {
                    o.fullcode = this.full_code
                } else if (this.isHSIndex) {
                    o.group_code = this.full_code
                    o.group_type = this.indexGroupType
                }
            }
            if (this.type) {
                o.type = this.type
            }

            return o
        },
        resetComponent() {
            this.busy = true
            this.end_date = null
            this.isFirstRequest = true
            if (Object.is(this.noData, false)) {
                this.$refs.scrollContainer.scrollTop = 0
            }
            this.noData = false
            this.dataStore = []
        },
        watchOnly() {
            this.stock_only = !this.stock_only
        },
        getInfo() {
            const p = this.getParams()
            const param = {
                options: p,
                callback0: data => {
                    this.dataStore = this.dataStore.concat(data.map((element) => {
                        return Object.freeze(element)
                    }))
                    this.end_date = data[data.length - 1].tdate

                    this.$nextTick(() => {
                        this.busy = false;
                    })
                },
                callback1001: () => {
                    this.busy = true
                    if (!this.end_date) {
                        // 显示无数据
                        this.noData = true
                    }
                },
                afterResponse: () => {
                    if (this.isFirstRequest) {
                        this.subToFrame()
                        this.isFirstRequest = false
                    }
                },
            }
            getShortLine(param)
        },
        receiveSocketData(args) {
            const { receive_content, request_content } = JSON.parse(args)
            if (Object.is(receive_content[0].mark, 1)) {
                this.resetComponent()
                this.noData = true
                return false
            }
            console.log(request_content)
            const data = receive_content
            let requestContent = request_content
            let isFullCodeIn = requestContent.includes(this.full_code)
            // 处理异常数据
            if (this.isStockOnly && !isFullCodeIn) {
                return false
            }
            if (!this.isStockOnly && isFullCodeIn) {
                return false
            }
            if (this.noData) {
                this.noData = false
            }
            data.forEach((element) => {
                element.tdate = element.date
                Object.freeze(element)
                this.dataStore.unshift(element)
            })
        },
        loadMoreData() {
            // 滚动加载
            this.busy = true
            this.getInfo()
        },
        resetStockData() {
            this.resetComponent()
            this.getInfo()
        },
        dblclickLi(event) {
            let target = event.target
            while (target && !target.classList.contains('j_short_line_li')) {
                target = target.parentNode
            }
            if (target) {
                let full_code = target.dataset.full_code
                let hash = full_code.substr(2)
                changePageStock(hash)
            }
        },
        filterLine() {
            this.$_eventBus.$emit('showShortLineFilter')
        },
        shortFilterChanged(type) {
            this.type = type
            this.unSubToFrame()
            this.resetStockData()
        },
    },
    beforeDestroy() {
        goGoal.event.remove(FRAME_SHORT_LINE, this.receiveSocketData)
        this.unSubToFrame()
        this.$_eventBus.$off('shortFilterChanged', this.shortFilterChanged)
    },
    watch: {
        full_code() {
            this.unSubToFrame()
            this.resetStockData()
        },
        stock_only() {
            this.unSubToFrame()
            this.resetStockData()
        },
    },
}
</script>

<style lang="less">
.line_title_right_only {
    border: 1px solid var(--color-border);
    padding: 1px 5px;
    border-radius: 4px;
    margin-right: 9px;
    cursor: pointer;
    &.on {
        border: 1px solid transparent;
        background: var(--color-button-normal);
        color: var(--white);
    }
}

.line_title_right {
    display: flex;
    align-items: center;
}
</style>
