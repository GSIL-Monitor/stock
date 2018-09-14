<template>
    <ul>
        <li
            v-for="(item, index) of listData"
            :key="index"
            class="flow_item"
        >
            <div class="flow_item_desc">{{itemDesc[index]}}</div>
            <div class="flow_item_ratio">{{formatRatio(item)}}</div>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'fundFlowList',
    data() {
        return {
            itemDesc: [
                '特',
                '大',
                '中',
                '小',
            ],
        }
    },
    computed: {
        totalCount() {
            return this.listData.reduce((total, element) => {
                return total += element[1]
            }, 0)
        },
    },
    methods: {
        formatRatio(item) {
            let val =  item[1]
            let total = this.totalCount

            if (total) {
                let showVal = (val / this.totalCount * 100).toFixed(2)
                return `${showVal}%`
            } else {
                let showVal = '0.00%'
                return showVal
            }
        },
    },
    props: {
        listData: {
            type: Array,
            required: true,
        },
        preFields: { // 字段前缀
            type: String,
            required: true,
            default: 'buy_',
        },
    },
}
</script>

<style lang="less" scoped>
    .flow_item {
        display: flex;
        font-size: 14px;
        align-items: center;
        margin-top: 30px;
        &:first-child {
            margin-top: 15px;
        }
    }
    .flow_item_desc {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--white);
    }
</style>
