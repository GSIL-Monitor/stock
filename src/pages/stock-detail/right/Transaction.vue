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
                    v-if="canLoadF1"
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
            @dblclick="toDetailPage"
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
} from '@service/index.js'
import {
    isHkRealTime,
} from '../utility.js'
import {
    skipF1,
} from '../components/module-jump.js'
import {
    MODULE_NAME,
} from '../storage.js'

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
            'canLoadF1',
        ]),
        isForbiddenHkLoad() {
            return this.isHkNormal && !isHkRealTime()
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
                    if (!this.update_time) {
                        if (this.dataStore.length) {
                            // 首次由于网络请求数据可能晚于推送数据回来
                            this.dataStore.length = 0
                        } else {
                            this.latestTime = this.getTimeStamp(data[0].update_time)
                        }
                    }

                    this.dataStore = this.dataStore.concat(data.map((element) => {
                        return Object.freeze(element)
                    }))

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
            if (!this.canLoadF1) { return false }

            let hash = location.hash.substr(1)
            skipF1(hash, MODULE_NAME)
        },
        loadMoreData() {
            this.busy = true
            this.getData()
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
            if (nowTimeStamp > this.latestTime) {
                if (this.noData) {
                    this.noData = false
                }
                this.dataStore.unshift(Object.freeze(data))
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
