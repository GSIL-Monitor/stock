<template>
    <div
        class="right_bottom_container"
    >
        <div class="view_title">
            <div class="transa_title_left">
                <div>
                    成交明细
                </div>
                <div class="transa_title_left_msg">
                    <span>[{{filterMsg}}]</span>
                    <span
                        class="transa_title_left_msg_close"
                        @click="resetStock"
                        v-if="!isShowAll"
                    >x</span>
                </div>
            </div>
            <div class="transa_title_right">
                <SetIco
                    class="transa_title_right_set"
                    @click="filterTransation"
                />
                <LoadMore
                    class="transa_title_right_more"
                    @on-click="toDetailPage"
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
            v-show="transation.length"
            ref="scrollContainer"
        >
            <TransactionLi
                v-for="(item, index) of transation"
                :key="index"
                :item="item"
                :current_type="current_type"
            />
        </ul>
        <div
            v-if="noData"
            class="extend_nodata"
        >
            暂无成交明细
        </div>
    </div>
</template>

<script>
import {
    mapState,
    mapGetters,
} from 'vuex'
import {
    getTransaction,
} from '@service/'
import {
    LOCAL_TRANSATION_STORE,
} from '../storage'

import TransactionLi from './TransactionLi'
import SetIco from '../components/SetIco'
import LoadMore from '../components/LoadMore'

export default {
    name: 'StockTransation',
    created() {
        this.initStockState()
        this.$eventBus.$on('transationFilter', this.filterParams)
        this.fetchData()
    },
    data() {
        return {
            latestTime: 0,
            transation: [],
            filterMsg: '全部',
            update_time: null,
            busy: true,
            noData: false,
            filterType: 1,
            min: null, // 成交明细过滤
            max: null, // 成交明细过滤
        }
    },
    components: {
        TransactionLi,
        SetIco,
        LoadMore,
    },
    computed: {
        ...mapGetters([
            'isAStock',
        ]),
        ...mapState([
            'stock_code',
            'current_type',
            'full_code',
        ]),
        isShowAll() {
            return Object.is(this.filterMsg, '全部')
        },
    },
    methods: {
        getTimeStamp(time) {
            return new Date(time.replace(/\-/g, '/'))
                   .getTime()
        },
        getStore() {
            let store = localStorage.getItem(LOCAL_TRANSATION_STORE)
            store = store ? JSON.parse(store) : {}

            return store
        },
        setStore(param) {
            let store = this.getStore()
            if (!param) {
                Reflect.deleteProperty(store, this.full_code)
            } else {
                store[this.full_code] = param
            }

            localStorage.setItem(LOCAL_TRANSATION_STORE, JSON.stringify(store))
        },
        initStockState() {
            let store = this.getStore()
            let item = store[this.full_code]
            if (item) {
                let min = item.min
                let max = item.max
                this.min = min
                this.max = max

                this.changeMsg()
            } else {
                this.filterMsg = `全部`
            }
        },
        changeMsg() {
            let min = this.min
            let max = this.max
            if (!max && !min) {
                this.filterMsg = `全部`
                this.filterType = 1
            } else if (max && !min) {
                this.filterMsg = `小于${max}`
                this.filterType = 2
            } else if (!max && min) {
                this.filterMsg = `大于${min}`
                this.filterType = 3
            } else if (Object.is(max, min)) {
                this.filterMsg = `等于${max}`
                this.filterType = 4
            } else {
                this.filterMsg = `介于${min}~${max}`
                this.filterType = 5
            }
        },
        getCurrentParams() {
            const o = {
                stock_code: this.stock_code
            }
            if (this.update_time) {
                o.end_date = this.update_time
            }
            const store = this.getStore()
            let item = store[this.full_code]
            if (item) {
                if (item.min) {
                    o.min_volume = Number(item.min) * 100
                }
                if (item.max) {
                    o.max_volume = Number(item.max) * 100
                }
            }

            return o
        },
        fetchData() {
            const param = {
                options: this.getCurrentParams(),
                callback0: data => {
                    if (!this.update_time && Object.is(this.transation.length, 0)) {
                        this.latestTime = this.getTimeStamp(data[0].update_time)
                    }

                    this.transation = this.transation.concat(data)
                    this.update_time = data[data.length - 1].update_time

                    this.$nextTick(() => {
                        this.busy = false;
                    })
                },
                callback1001: () => {
                    this.busy = true
                    if (!this.update_time) {
                        // 显示无数据
                        this.noData = true
                    }
                },
            }

            getTransaction(param)
        },
        filterParams(o) {
            this.min = o.min
            this.max = o.max

            this.changeMsg()
            this.resetAll()
            this.fetchData()
        },
        filterTransation() {
            this.$eventBus.$emit('showTransationFilter')
        },
        toDetailPage() {
            console.log('timeShareDetail')
        },
        loadMoreData() {
            this.busy = true
            this.fetchData()
        },
        dblclickLi() {
            console.log('timeShareDetail')
        },
        resetBase() {
            this.update_time = null
            this.busy = true
            this.latestTime = 0
            if (Object.is(this.noData, false)) {
                this.$refs.scrollContainer.scrollTop = 0
            }
            this.noData = false
            this.transation = []
        },
        resetAll() {
            this.resetBase()
            this.filterType = 1
            this.min = null
            this.max = null
        },
        filerPushData(volume) {
            if (Object.is(this.filterType, 1)) {
                return true
            } else if (Object.is(this.filterType, 2)) {
                return volume < this.max
            } else if (Object.is(this.filterType, 3)) {
                return volume > this.min
            } else if (Object.is(this.filterType, 4)) {
                return Object.is(String(volume), this.max)
            } else {
                return (volume > this.min) && (volume < this.max)
            }
        },
        // 接收推送数据
        pushData(data) {
            // 过滤成交明细
            if (!this.filerPushData(data.volume)) {
                return false
            }
            let nowTimeStamp = this.getTimeStamp(data.update_time)
            if (this.noData) {
                this.noData = false
            }
            if (nowTimeStamp > this.latestTime) {
                this.transation.unshift(data)
                this.latestTime = nowTimeStamp
            }
        },
        clear() {
            // 清空
            this.resetBase()
            this.noData = true
        },
        resetStock() {
            this.resetAll()
            this.setStore()
            this.filterMsg = '全部'

            this.fetchData()
        },
    },
    beforeDestroy() {
        this.$eventBus.$off('transationFilter', this.filterParams)
    },
    watch: {
        full_code() {
            if (this.isAStock) {
                this.resetAll()
                this.initStockState()
                this.fetchData()
            }
        }
    },
}
</script>

<style lang="less">
.transa_title_left, .transa_title_right {
    display: flex;
    align-items: center;
}
.transa_title_left_msg {
    margin-left: 10px;
    padding: 1px 5px;
    border-radius: 2px;
    background-color: var(--color-smallcard-background);
}
.transa_title_left_msg_close {
    cursor: pointer;
}
.transa_title_right {
    padding-right: 10px;
}
.transa_title_right_set {
    margin-right: 5px;
}
</style>
