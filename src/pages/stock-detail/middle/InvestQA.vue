<template>
<div
    class="info_wrap"
    :class="$_wrapClasses"
>
    <div
        v-show="dataStore.length"
        v-infinite-scroll="$_loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="60"
        infinite-scroll-throttle-delay="100"
        ref="scrollContainer"
    >
        <ul
            class="info_vessel"
            @click="handleClick"
            ref="infoContainer"
        >
            <li
                v-for="(item, index) of dataStore"
                class="investqa_item"
                :data-index="(index + 1)"
                :key="index"
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
                        :title="item.ask_title.replace(/\<br\>/, ' ')"
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
                        :title="item.reply_content.replace(/\<br\>/, ' ')"
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
    </div>
    <div
        v-if="noData"
        class="extend_nodata"
    >{{noDataMsg}}</div>
    <!-- <ul
        class="info_vessel"
        v-show="dataStore.length"
        v-infinite-scroll="$_loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="60"
        infinite-scroll-throttle-delay="100"
        ref="scrollContainer"
    > -->
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
    isContainsNode,
} from '../utility.js'
import {
    openInvestment,
} from './open-information.js'

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
            'stock_name',
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
        openContent(index, data) {
            let titleName = '投资问答'
            let title = this.stock_name ? `${titleName}——${this.stock_name}(${this.$_showCode})` : titleName
            const param = {
                listApi: 'v1/news/get_investment_qa',
                position: index,
                contentId: data.id,
                stock_code: this.stock_code,
                stock_name: this.stock_name,
                params: {
                    rows: 6,
                    stock_code: this.stock_code,
                    page: Math.ceil(index / 6)
                },
            }

            openInvestment(param, title)
        },
        handleClick(event) {
            let target = event.target
            if (!isContainsNode(this.$refs.infoContainer, target)) {
                return false
            }

            while (target && target.tagName.toLowerCase() !== 'li') {
                target = target.parentNode
            }

            if (target) {
                const index = Number(target.dataset.index)
                const targetData = this.dataStore[index]

                this.openContent(index, targetData)
            }
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
.info_wrap {
    overflow: auto;
}
.info_vessel {
    display: table;
    width: 100%;
    table-layout: fixed;
}
.investqa_item {
    cursor: pointer;
    padding: 5px 10px;
    border-bottom: 1px solid var(--color-dividers);
}
.investqa_item_question,
.investqa_item_answewr,
.investqa_item_date {
    height: 26px;
    display: flex;
    align-items: center;
}

.investqa_item_question_text,
.investqa_item_answewr_text {
    height: 16px;
    line-height: 16px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
