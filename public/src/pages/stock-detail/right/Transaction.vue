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
                />
            </div>
        </div>
        <ul
            class="view_vessel"
            v-infinite-scroll="loadMoreData"
            infinite-scroll-disabled="busy"
            infinite-scroll-distance="60"
            infinite-scroll-throttle-delay="80"
            @dblclick="dblclickLi"
            v-show="transation.length"
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

import TransactionLi from './TransactionLi'
import LoadMore from '../components/LoadMore'

export default {
    name: 'stockTransation',
    created() {
        this.getData()
    },
    data() {
        return {
            latestTime: 0,
            transation: [],
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
        ...mapGetters([
            'isBStock',
            'isFund',
            'isBond',
        ]),
        ...mapState([
            'stock_code',
            'current_type',
            'full_code',
        ]),
        getCurrentApi() {
            if (this.isBStock || this.isFund || this.isBond) {
                return getTransaction
            }
        },
    },
    methods: {
        getTimeStamp(time) {
            return new Date(time.replace(/\-/g, '/'))
                   .getTime()
        },
        getCurrentParams() {
            if (this.isBStock) {
                let o = {
                    stock_code: this.stock_code
                }
                if (this.update_time) {
                    o.end_date = this.update_time
                }
                return o
            }
            else if (this.isFund || this.isBond) {
                let o = {
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
            const param = {
                options: this.getCurrentParams(),
                callback0: data => {
                    if (!this.update_time && Object.is(this.transation.length, 0)) {
                        this.latestTime = this.getTimeStamp(data[0].update_time)
                    }

                    this.transation = this.transation.concat(data)
                    this.update_time = data[data.length - 1].update_time

                    // 待 dom 状态更新之后，设回可加载
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
            this.transation = []
            this.update_time = null
            this.busy = true
            this.noData = false
            this.latestTime = 0
        },
        pushData(data) {
            // 推送
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
            if (this.isBStock || this.isFund || this.isBond) {
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
.transa_title_left_msg {
    margin-left: 10px;
    padding: 3px 5px;
    border-radius: 2px;
    background-color: rgba(255,255,255,.09);
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
