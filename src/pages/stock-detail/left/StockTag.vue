<template>
    <div class="lt_detail_tool">
        <TagList
            v-for="(item, index) of dataList"
            :class="toolClasses(index)"
            :key="index"
            v-bind="item"
        />
    </div>
</template>

<script>
import {
    mapState,
    mapActions,
    mapMutations,
} from 'vuex'
import {
    GET_STOCK_TAG,
} from '@store/stock-detail-store/config/mutation-types.js'
import {
    GET_STOCK_TAG_DATA,
} from '@store/stock-detail-store/config/action-types.js'

import TagList from './StockTagList.vue'

const tagShowData = [
    {
        showTitle: false,
        title: '',
        listData: [
            {
                name: '确定性评分',
                fields: 'zyyx_score',
            },
            {
                name: '公司荣誉',
                fields: 'tags',
            },
        ],
    },
    {
        showTitle: true,
        title: '业绩标签',
        listData: [
            {
                name: '业绩鉴定',
                fields: 'history_achievement_appraise',
            },
            {
                name: '业绩预判',
                fields: 'future_achievement_appraise',
            },
            {
                name: '行业业绩',
                fields: 'industry_appraise',
            },
            {
                name: '行业预判',
                fields: 'industry_future',
            },
        ],
    },
    {
        showTitle: true,
        title: '市场标签',
        listData: [
            {
                name: '行业地位',
                fields: 'business_status_new',
            },
            {
                name: '行业周期',
                fields: 'industry_periodicity',
            },
            {
                name: '机构持仓',
                fields: 'hold_change',
            },
            {
                name: '融资融券',
                fields: 'financing_securities_loan',
            },
            {
                name: '互联互通',
                fields: 'hold_percent',
            },
            {
                name: '季度胜率',
                fields: 'success_rate',
            },
            {
                name: '个股风格',
                fields: 'periodicity',
            },
            {
                name: '超额收益',
                fields: 'over_rate',
            },
        ],
    },
]

export default {
    name: 'StockTag',
    created() {
        this.initTagData()
    },
    data() {
        return {
            dataList: tagShowData,
        }
    },
    computed: {
        ...mapState([
            'full_code',
        ]),
    },
    components: {
        TagList,
    },
    methods: {
        ...mapMutations([
            GET_STOCK_TAG,
        ]),
        ...mapActions({
            getStockTagData: GET_STOCK_TAG_DATA,
        }),
        initTagData() {
            const param = {
                options: {
                    type: 1,
                    full_code: this.full_code,
                },
                callback0: data => {
                    this[GET_STOCK_TAG](data)
                },
                callback1001: () => {
                    var o = Object.create(null)
                    o.clear = 1
                    this[GET_STOCK_TAG](o)
                },
            }

            this.getStockTagData(param)
        },
        toolClasses(index) {
            return [`tool_title_${index}`]
        },
    },
    watch: {
        full_code() {
            this.initTagData()
        },
    },
}
</script>

<style lang="less">
.lt_detail_tool {
    height: 100%;
    overflow: auto;
    padding-bottom: 15px;
    .tool_title {
        display: flex;
        height: 20px;
        align-items: center;
        margin-top: 13px;
        background-color: var(--color-smallcard-background);
        color: var(--color-primary-text);
        border-top: 1px solid var(--color-dividers);
        border-bottom: 1px solid var(--color-dividers);
        font-size: 12px;
        .tool_title_circle {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            margin-left: 13px;
        }
        .tool_title_dsc {
            margin-left: 7px;
        }
    }
    .tool_title_1 {
        .tool_title_circle {
            background-color: #FE943D;
        }
    }
    .tool_title_2 {
        .tool_title_circle {
            background-color: #DA4F4A;
        }
    }
    .tool_list{
        display: flex;
        flex-wrap: wrap;
        .tool_list_item {
            flex: 0 0 50%;
            max-width: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .tool_list_item_cot {
            width: 60px;
            height: 60px;
            border-radius: 6px;
        }
        .tool_list_item_dsc {
            max-width: 100%;
            margin-top: 1px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #9E9FA1;
        }
    }
}
</style>
