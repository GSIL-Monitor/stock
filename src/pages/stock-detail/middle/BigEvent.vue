<template>
<div
    class="info_wrap"
    :class="$_wrapClasses"
>
    <ul
        class="info_vessel"
        v-show="dataStore.length"
        v-infinite-scroll="$_loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="60"
        infinite-scroll-throttle-delay="100"
        @click="handleClick"
        ref="scrollContainer"
    >
        <li
            v-for="(item, index) of dataStore"
            :key="index"
            :data-index="index"
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
} from '../utility.js'
import {
    getEventList,
} from '@service/index.js'
import {
    openBigEvent,
} from './open-information.js'

import informationItemMixin from '../mixins/information-item-mixin.js'
import loaddingStyleMixin from '../mixins/loadding-style-mixin.js'

export default {
    name: 'BigEvent',
    mixins: [
        informationItemMixin,
        loaddingStyleMixin,
    ],
    created() {
        this.fetchData()
    },
    data() {
        return {
            ROWS: 10,
            page: 1,
            dataStore: [],
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
            'stock_name',
        ]),
        titleName() {
            return '大事件'
        },
    },
    methods: {
        fetchData() {
            this.$_addLoadding()
            const params = {
                options: {
                    is_details: false,
                    stock_code: this.stock_code,
                    rows: this.ROWS,
                    page: this.page,
                    fields: this.filterFields.join(';'),
                },
                callback0: data => {
                    this.dataStore = this.dataStore.concat(data)
                    this.$_setBusyState(data.length)
                },
                callback1001: () => {
                    this.busy = true
                    if (Object.is(this.dataStore.length, 0)) {
                        this.noData = true
                    }
                },
            }
            if (this.$_isFirstLoadding) {
                params.afterResponse = () => {
                    this.$_removeLoadding()
                }
            }
            getEventList(params)
        },
        formatDate(date) {
            return subDate(date)
        },
        openContent(index, data) {
            let title = this.stock_name ? `${this.titleName}——${this.stock_name}(${this.stock_code})` : this.titleName
            const param = {
                position: (index + 1),
                stock_name: this.stock_name,
                stock_code: this.stock_code,
                params: {
                    rows: 9,
                    stock_code: this.stock_code,
                    is_details: false,
                    page: Math.ceil(index / 9),
                },
                listApi:'v1/stock/get_announcement_notice',
                contentApi: 'v1/stock/get_big_event_milestone',
                contentId: data.id,
            }

            openBigEvent(param, title)
        },
        handleClick(event) {
            let target = event.target
            while (target && target.tagName.toLowerCase() !== 'li') {
                target = target.parentNode
            }
            const index = Number(target.dataset.index)
            const targetData = this.dataStore[index]

            this.openContent(index, targetData)
        },
    },
    watch: {
        full_code() {
            this.$_resetState()
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
