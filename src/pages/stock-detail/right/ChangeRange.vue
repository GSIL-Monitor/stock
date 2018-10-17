<template>
    <div class="range_mod">
        <div class="view_title">涨跌分布</div>
        <div class="range_mod_body">
            <RangeBodyItem
                v-for="(item, index) of bodyOrder"
                :key="index"
                :text="item.text"
                :val="item.val"
                :bg="item.bg"
            />
        </div>
        <div class="range_mod_list" ref="rangeList">
            <ul class="range_mod_list_item">
                <RangeListItem
                    v-for="(item, index) of riseList.children"
                    :key="index"
                    :color="riseList.color"
                    :text="item.text"
                    :process="item.process"
                    :count="item.count"
                >
                </RangeListItem>
            </ul>
            <ul class="range_mod_list_item">
                <RangeListItem
                    v-for="(item, index) of fallList.children"
                    :key="index"
                    :color="fallList.color"
                    :text="item.text"
                    :process="item.process"
                    :count="item.count"
                />
            </ul>
        </div>
    </div>
</template>

<script>
import {
    evenRound,
} from '@c/utils/util.js'
import {
    SOCKET_RANGE_SCOPE,
} from '../storage.js'

import socketMixin from '../mixins/socket-mixin.js'

import RangeBodyItem from './ChangeRangeBodyItem.vue'
import RangeListItem from './ChangeRangeListItem.vue'

export default {
    name: 'ChangeRange',
    mixins: [
        socketMixin,
    ],
    created() {
        this.$_eventBus.$on(SOCKET_RANGE_SCOPE, this.receiveSocketData)
        this.$_sendLink(this.linkAddress)
        this.$_rememberLink(this.linkAddress, this.linkIndex)
    },
    data() {
        return {
            socketData: {},
            linkIndex: 0,
            mark: null,
        }
    },
    components: {
        RangeBodyItem,
        RangeListItem,
    },
    computed: {
        linkAddress() {
            return `request_name:push/distribute/p_change_a|request_id:${SOCKET_RANGE_SCOPE}|first_push:true`
        },
        bodyOrder() {
            return [
                {
                    text: '上涨比例',
                    val: this.riseRatio,
                    bg: 'red',
                },
                {
                    text: '下跌比例',
                    val: this.fallRatio,
                    bg: 'green',
                },
                {
                    text: '涨停个股',
                    val: this.limitUp,
                    bg: 'red',
                },
                {
                    text: '跌停个股',
                    val: this.limitDown,
                    bg: 'green',
                },
            ]
        },
        total() {
            return this.socketData.rose + this.socketData.fall
        },
        isClear() {
            return Object.is(this.mark, 1)
        },
        riseRatio() {
            return this.formatRatio(this.socketData.rose, this.total)
        },
        fallRatio() {
            return this.formatRatio(this.socketData.fall, this.total)
        },
        limitUp() {
            return this.formatNumber(this.socketData.rose10)
        },
        limitDown() {
            return this.formatNumber(this.socketData.fall10)
        },
        rose7_10Number() {
            return this.formatNumber(this.socketData.rose7_10)
        },
        rose4_7Number() {
            return this.formatNumber(this.socketData.rose4_7)
        },
        rose2_4Number() {
            return this.formatNumber(this.socketData.rose2_4)
        },
        rose1_2Number() {
            return this.formatNumber(this.socketData.rose1_2)
        },
        rose0_1Number() {
            return this.formatNumber(this.socketData.rose0_1)
        },
        fall7_10Number() {
            return this.formatNumber(this.socketData.fall7_10)
        },
        fall4_7Number() {
            return this.formatNumber(this.socketData.fall4_7)
        },
        fall2_4Number() {
            return this.formatNumber(this.socketData.fall2_4)
        },
        fall1_2Number() {
            return this.formatNumber(this.socketData.fall1_2)
        },
        fall0_1Number() {
            return this.formatNumber(this.socketData.fall0_1)
        },
        rose10Ratio() {
            return this.formatWidth(this.socketData.rose10, this.total)
        },
        rose7_10Ratio() {
            return this.formatWidth(this.socketData.rose7_10, this.total)
        },
        rose4_7Ratio() {
            return this.formatWidth(this.socketData.rose4_7, this.total)
        },
        rose2_4Ratio() {
            return this.formatWidth(this.socketData.rose2_4, this.total)
        },
        rose1_2Ratio() {
            return this.formatWidth(this.socketData.rose1_2, this.total)
        },
        rose0_1Ratio() {
            return this.formatWidth(this.socketData.rose0_1, this.total)
        },
        fall0_1Ratio() {
            return this.formatWidth(this.socketData.fall0_1, this.total)
        },
        fall1_2Ratio() {
            return this.formatWidth(this.socketData.fall1_2, this.total)
        },
        fall2_4Ratio() {
            return this.formatWidth(this.socketData.fall2_4, this.total)
        },
        fall4_7Ratio() {
            return this.formatWidth(this.socketData.fall4_7, this.total)
        },
        fall7_10Ratio() {
            return this.formatWidth(this.socketData.fall7_10, this.total)
        },
        fall10Ratio() {
            return this.formatWidth(this.socketData.fall10, this.total)
        },
        riseList() {
            return {
                color: 'red',
                children: [
                    {
                        text: '当日涨停',
                        process: this.rose10Ratio,
                        count: this.limitUp,
                    },
                    {
                        text: '涨幅7-10%',
                        process: this.rose7_10Ratio,
                        count: this.rose7_10Number,
                    },
                    {
                        text: '涨幅4-7%',
                        process: this.rose4_7Ratio,
                        count: this.rose4_7Number,
                    },
                    {
                        text: '涨幅2-4%',
                        process: this.rose2_4Ratio,
                        count: this.rose2_4Number,
                    },
                    {
                        text: '涨幅1-2%',
                        process: this.rose1_2Ratio,
                        count: this.rose1_2Number,
                    },
                    {
                        text: '涨幅0-1%',
                        process: this.rose0_1Ratio,
                        count: this.rose0_1Number,
                    },
                ]
            }
        },
        fallList() {
            return {
                color: 'green',
                children: [
                    {
                        text: '跌幅0-1%',
                        process: this.fall0_1Ratio,
                        count: this.fall0_1Number,
                    },
                    {
                        text: '跌幅1-2%',
                        process: this.fall1_2Ratio,
                        count: this.fall1_2Number,
                    },
                    {
                        text: '跌幅2-4%',
                        process: this.fall2_4Ratio,
                        count: this.fall2_4Number,
                    },
                    {
                        text: '跌幅4-7%',
                        process: this.fall4_7Ratio,
                        count: this.fall4_7Number,
                    },
                    {
                        text: '跌幅7-10%',
                        process: this.fall7_10Ratio,
                        count: this.fall7_10Number,
                    },
                    {
                        text: '当日跌停',
                        process: this.fall10Ratio,
                        count: this.limitDown,
                    },
                ]
            }
        }
    },
    methods: {
        receiveSocketData(...args) {
            let data = args[0]
            this.mark = data.mark

            if (Object.is(data.mark, 1)) {
                // 清空
                this.socketData = {}
            } else {
                this.socketData = Object.assign({}, data)
            }
        },
        evenRoundRatio(num, total) {
            return `${evenRound(num / total * 100, 2)}%`
        },
        formatRatio(num, total) {
            if (this.isClear || !num) {
                return '--'
            } else {
                return this.evenRoundRatio(num, total)
            }
        },
        formatNumber(num) {
            if (this.isClear || !num) {
                return '--'
            } else {
                return num
            }
        },
        formatWidth(num, total) {
            if (this.isClear || !num) {
                return '0%'
            } else {
                return this.evenRoundRatio(num, total)
            }
        },
    },
    beforeDestroy() {
        this.$_eventBus.$off(SOCKET_RANGE_SCOPE, this.receiveSocketData)
        this.$_cancleSocket(this.linkIndex)
    },
}
</script>

<style lang="less">
    .range_mod {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .range_mod_body {
        display: flex;
        flex: 0 0 148px;
        flex-wrap: wrap;
        border-bottom: 1px solid var(--color-border);
    }
    .range_item {
        flex: 0 0 50%;
    }
    .range_mod_list {
        flex: 1;
        overflow: auto;
    }
    .range_mod_list_item {
        padding: 5px 10px;
    }
</style>
