<template>
<div
    class="info_wrap"
>
    <ul
        class="info_vessel"
        v-show="dataStore.length"
        v-infinite-scroll="loadMoreData"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="60"
        infinite-scroll-throttle-delay="100"
        ref="scrollContainer"
    >
        <li
            v-for="(item, index) of dataStore"
            :key="index"
            class="bigevent_item"
        >
            <svg
                width="10"
            >
                <line
                    x1="5"
                    y1="0"
                    x2="5"
                    y2="26"
                    stroke-width="1px"
                    stroke="#C0C0C0"
                ></line>
                <circle
                    r="5"
                    cx="5"
                    cy="12"
                    fill="#C0C0C0"
                ></circle>
            </svg>
            <span
                class="bigevent_item_date"
            >
                {{formatDate(item.declare_date)}}
            </span>
            <span>
                {{item.title}}
            </span>
        </li>
    </ul>
    <div
        v-if="noData"
        class="extend_nodata"
    >
        {{noDataMsg}}
    </div>
</div>
</template>

<script>
import {
    mapState,
} from 'vuex'
import {
    subDate,
} from '../utility'
import {
    getEventList,
} from '@service/'

export default {
    name: 'BigEvent',
    created() {
        this.fetchData()
    },
    data() {
        return {
            rows: 10,
            page: 1,
            dataStore: [],
            busy: true,
            noData: false,
            noDataMsg: '暂无大事件',
            filterFields: [
                'id',
                'title',
                'declare_date',
            ],
        }
    },
    computed: {
        ...mapState([
            'stock_code',
            'full_code',
        ]),
    },
    methods: {
        fetchData() {
            const params = {
                options: {
                    is_details: false,
                    stock_code: this.stock_code,
                    rows: this.rows,
                    page: this.page,
                    fields: this.filterFields.join(';'),
                },
                callback0: data => {
                    this.dataStore = this.dataStore.concat(data)
                    this.$nextTick(() => {
                        this.busy = false
                    })
                },
                callback1001: () => {
                    this.busy = true
                    if (Object.is(this.dataStore.length, 0)) {
                        this.noData = true
                    }
                },
            }

            getEventList(params)
        },
        loadMoreData() {
            // 滚动加载
            this.busy = true
            this.page++
            this.fetchData()
        },
        formatDate(date) {
            return subDate(date)
        },
        resetState() {
            this.page = 1
            this.busy = true
            if (Object.is(this.noData, false)) {
                this.$refs.scrollContainer.scrollTop = 0
            }
            this.noData = false
            this.dataStore = []
        },
    },
    watch: {
        full_code() {
            this.resetState()
            this.fetchData()
        },
    },
}
</script>

<style lang="less" scoped>
.info_vessel {
    padding-top: 5px;
    padding-left: 15px;
}

.bigevent_item {
    height: 26px;
    display: flex;
    line-height: 26px;
    cursor: pointer;
}

.bigevent_item_date {
    margin: 0 10px;
}
</style>
