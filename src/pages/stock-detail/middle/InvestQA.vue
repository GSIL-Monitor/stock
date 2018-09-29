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
        ref="scrollContainer"
    >
        <li
            v-for="(item, index) of dataStore"
            :key="index"
            class="investqa_item"
        >
            <div
                class="investqa_item_question"
            >
                <span
                    class="investqa_ico investqa_ico_bgGray"
                >
                    问
                </span>
                <span
                    class="investqa_item_question_text"
                    v-html="item.ask_title"
                ></span>
            </div>
            <div
                 class="investqa_item_answewr"
            >
                <span
                    class="investqa_ico investqa_ico_bgGray"
                >
                    答
                </span>
                <span
                    class="investqa_item_answewr_text"
                    v-html="item.reply_content">
                </span>
            </div>
            <div
                class="investqa_item_date"
            >
                <span
                    class="investqa_ico"
                >
                </span>
                <span  class="investqa_item_date_text">
                    {{item.reply_time}}
                </span>
            </div>
        </li>
    </ul>
    <div
        v-if="noData"
        class="extend_nodata"
    >{{noDataMsg}}</div>
</div>
</template>

<script>
import {
    mapState,
} from 'vuex'
import {
    getInvestmentQAData,
} from '@service/index.js'
import {
    subDate,
} from '../utility.js'

import informationItemMixin from '../mixins/information-item-mixin.js'
import loaddingStyleMixin from '../mixins/loadding-style-mixin.js'

export default {
    name: 'InvestQA',
    mixins: [
        informationItemMixin,
        loaddingStyleMixin,
    ],
    created() {
        this.fetchData()
    },
    data() {
        return {
            ROWS: 3,
            page: 1,
            dataStore: [],
            noData: false,
            noDataMsg: '暂无投资问答',
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
            this.$_addLoadding()
            let param = {
                options: {
                    stock_code: this.stock_code,
                    rows: this.ROWS,
                    page: this.page,
                },
                callback0: data => {
                    data.forEach((element) => {
                        element.reply_time = subDate(element.reply_time)
                    })
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
                param.afterResponse = () => {
                    this.$_removeLoadding()
                }
            }
            getInvestmentQAData(param)
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
    width: 100%;
}
.investqa_item {
    padding: 5px 10px;
}
.investqa_item_question,
.investqa_item_answewr,
.investqa_item_date {
    height: 26px;
    display: flex;
    flex-grow: 1;
    width: 100%;
    align-items: center;
}

.investqa_item_question_text,
.investqa_item_answewr_text {
    flex-grow: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}
.investqa_ico {
    flex: 0 0 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    color: #fff;
    border-radius: 2px;
    margin-right: 10px;
}
.investqa_ico_bgGray {
    background: #707d91;
}
</style>
