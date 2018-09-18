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
            :key="index"
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
} from '@service/index'
import {
    SOCKET_SHORT_LINE,
    LOCAL_SHORT_LINE_SET,
} from '../storage'
import {
    ASTOCK,
    INDEX,
} from '@formatter/config/stock-type-config'

import socketMixin from '../mixins/socket-mixin'

import SetIco from '../components/SetIco.vue'
import ShortElvesItem from './ShortElvesItem.vue'

// TODO: 清空时段加载问题
export default {
    name: 'ShortElves',
    mixins: [
        socketMixin,
    ],
    created() {
        this.initType()
        this.getInfo()
        this.$eventBus.$on(SOCKET_SHORT_LINE, this.receiveSocketData)
        this.$eventBus.$on('shortFilterChanged', this.shortFilterChanged)
    },
    data() {
        return {
            stock_only: false,
            dataStore: [],
            busy: true,
            rows: 50,
            end_date: null,
            noData: false,
            linkIndex: 1,
            type: null,
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
        baseLink() {
            let type = this.type ? `|type=${this.type}` : ''
            return `request_name:push/dynamic/list_info|first_push:true|request_id:${SOCKET_SHORT_LINE}${type}`
        },
        stockLink() {
            if (this.isStockOnly) {
                return `${this.baseLink}|request_param:fullcode=${this.full_code}`
            } else {
                return `${this.baseLink}|request_param:fullcode=`
            }
        },
        indexGroupType() {
            return Object.is(this.source, 'BK') ? '3' : '5'
        },
        indexLink() {
            if (this.isStockOnly) {
                let group_type = this.indexGroupType
                return `${this.baseLink}|request_param:group_code=${this.full_code}&group_type=${group_type}`
            } else {
                return `${this.baseLink}|request_param:group_code=`
            }
        },
        linkAddress() {
            if (this.isAStock) {
                return this.stockLink
            } else if (this.isHSIndex) {
                return this.indexLink
            }
        },
    },
    methods: {
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
                    this.dataStore = this.dataStore.concat(data)
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
                    this.sendLink(this.linkAddress)
                    this.rememberLink(this.linkAddress, this.linkIndex)
                },
            }
            getShortLine(param)
        },
        receiveSocketData(...args) {
            let data
            let requestContent = args[1]
            let isFullCodeIn = requestContent.includes(this.full_code)
            // 处理异常数据
            if (this.isStockOnly && !isFullCodeIn) {
                return false
            }
            if (!this.isStockOnly && isFullCodeIn) {
                return false
            }
            // TODO: 剔重

            if (this.noData) {
                this.noData = false
            }
            data = args[0]
            data.forEach((element) => {
                element.tdate = element.date
            })
            this.dataStore.unshift(...data)
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
        dblclickLi() {

        },
        filterLine() {
            this.$eventBus.$emit('showShortLineFilter')
        },
        shortFilterChanged(type) {
            this.type = type
            this.cancleSocket(this.linkIndex)
            this.resetStockData()
        },
    },
    beforeDestroy() {
        this.$eventBus.$off(SOCKET_SHORT_LINE, this.receiveSocketData)
        this.cancleSocket(this.linkIndex)
        this.$eventBus.$off('shortFilterChanged', this.shortFilterChanged)
    },
    watch: {
        full_code() {
            this.cancleSocket(this.linkIndex)
            this.resetStockData()
        },
        stock_only() {
            this.cancleSocket(this.linkIndex)
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
