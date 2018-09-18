<template>
    <div
        class="right_bottom_container"
    >
        <div class="view_title">
            <div class="transa_title_left">
                <div>成交明细</div>
            </div>
            <div class="transa_title_right">
                <LoadMore
                    class="transa_title_right_more"
                    @on-click="toDetailPage"
                    v-if="showMore"
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
            <TransactionLi
                v-for="(item, index) of dataStore"
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
    getHKTransaction,
} from '@service/'
import {
    isHkRealTime,
} from '../utility'

import TransactionLi from './TransactionLi.vue'
import LoadMore from '../components/LoadMore.vue'

export default {
    name: 'StockTransation',
    created() {
        this.getData()
    },
    data() {
        return {
            latestTime: 0,
            dataStore: [],
            update_time: null,
            busy: true,
            noData: false,
        }
    },
    components: {
        TransactionLi,
        LoadMore,
    },
    computed: {
        ...mapState([
            'stock_code',
            'current_type',
            'full_code',
        ]),
        ...mapGetters([
            'isBStock',
            'isFund',
            'isBond',
            'isHkIndex',
            'isHkNormal',
        ]),
        isForbiddenHkLoad() {
            return this.isHkNormal && !isHkRealTime()
        },
        showMore() {
            return this.isBStock || this.isFund || this.isBond
        },
        getCurrentApi() {
            if (this.isBStock || this.isFund || this.isBond) {
                return getTransaction
            } else if (this.isHkIndex || this.isHkNormal) {
                return getHKTransaction
            }
        },
    },
    methods: {
        getTimeStamp(time) {
            return new Date(time.replace(/\-/g, '/'))
                   .getTime()
        },
        stockBParams() {
            const o = {
                stock_code: this.stock_code
            }
            if (this.update_time) {
                o.end_date = this.update_time
            }
            return o
        },
        getCurrentParams() {
            if (this.isBStock) {
                return this.stockBParams()
            } else {
                const o = {
                    fullcode: this.full_code
                }
                if (this.update_time) {
                    o.end_date = this.update_time
                }
                return o
            }
        },
        getData() {
            let api = this.getCurrentApi
            if (!api) return

            const param = {
                options: this.getCurrentParams(),
                callback0: data => {
                    if (!this.update_time && Object.is(this.dataStore.length, 0)) {
                        this.latestTime = this.getTimeStamp(data[0].update_time)
                    }

                    this.dataStore = this.dataStore.concat(data)
                    this.update_time = data[data.length - 1].update_time

                    if (this.isForbiddenHkLoad) {
                        // 港股非实时行情禁用滚动加载
                        this.busy = true
                    } else {
                        // 待 dom 状态更新之后，设回可加载
                        this.$nextTick(() => {
                            this.busy = false
                        })
                    }
                },
                callback1001: () => {
                    this.busy = true
                    if (!this.update_time) {
                        // 显示无数据
                        this.noData = true
                    }
                },
            }

            api(param)
        },
        toDetailPage() {
            console.log('timeShareDetail')
        },
        loadMoreData() {
            this.busy = true
            this.getData()
        },
        dblclickLi() {
            console.log('timeShareDetail')
        },
        resetComponent() {
            this.update_time = null
            this.busy = true
            this.latestTime = 0
            if (Object.is(this.noData, false)) {
                this.$refs.scrollContainer.scrollTop = 0
            }
            this.noData = false
            this.dataStore = []
        },
        pushData(data) {
            // 推送
            let nowTimeStamp = this.getTimeStamp(data.update_time)
            if (this.noData) {
                this.noData = false
            }
            if (nowTimeStamp > this.latestTime) {
                this.dataStore.unshift(data)
                // 港股非实时行情保留4条数据
                if (this.isForbiddenHkLoad) {
                    if (this.dataStore.length > 4) {
                        this.dataStore.splice(this.dataStore.length - 1, 1)
                    }
                }
                this.latestTime = nowTimeStamp
            }
        },
        clear() {
            // 清空
            this.resetComponent()
            this.noData = true
        },
        resetStock() {
            this.resetComponent()

            this.getData()
        },
    },
    watch: {
        full_code() {
            if (this.isBStock || this.isFund || this.isBond || this.isHkIndex || this.isHkNormal) {
                this.resetComponent()
                this.getData()
            }
        },
    },
}
</script>

<style lang="less">
.transa_title_left, .transa_title_right {
    display: flex;
    align-items: center;
}
.transa_title_right {
    padding-right: 10px;
}
.transa_title_right_set {
    margin-right: 5px;
}
</style>
