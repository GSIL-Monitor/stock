<template>
    <div class="right_bottom_container">
        <div class="view_title">
            <span class="fund_flow_dsc">资金流向</span>

        </div>
        <div class="view_vessel">
            <div
                v-if="clear"
                class="extend_nodata"
            >
                暂无数据
            </div>
            <div
                v-else
            >
                <div class="fund_flow_top">
                    <FundFlowList
                        :listData="buyList"
                        :preFields="buy"
                        class="fund_flow_top_buyList"
                    />
                    <FundFlowPie
                        :pieData="chartData"
                    />
                    <FundFlowList
                        :listData="sellList"
                        :preFields="sell"
                        class="fund_flow_top_sellList"
                    />
                </div>
                <div class="fund_flow_bottom">
                    <FundFlowBar
                        :barData="chartData"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    mapState,
} from 'vuex'
import socketMixin from "../mixins/socket-mixin"
import {
    SOCKET_A_FLOW,
} from '../storage'

import FundFlowPie from './FundFlowPie'
import FundFlowBar from './FundFlowBar'
import FundFlowList from './FundFlowList'


export default {
    name: 'fundFlow',
    mixins: [
        socketMixin,
    ],
    data() {
        return {
            linkIndex: 1, // 位于goGoal.sockets数组的下标
            socketData: {},
            buy: 'buy_',
            sell: 'sell_',
            fieldsCount: 4,
        }
    },
    components: {
        FundFlowPie,
        FundFlowBar,
        FundFlowList,
    },
    created() {
        if (this.full_code) {
            this.sendLink(this.linkAddress)
            this.rememberLink(this.linkAddress, this.linkIndex)
        }
        this.$eventBus.$on(SOCKET_A_FLOW, this.receiveSocketData)
    },
    computed: {
        ...mapState([
            'stock_code',
            'current_type',
            'full_code',
        ]),
        clear() {
            // TODO -- 清空机制
            return false
        },
        buyList() {
            let arr = []
            for (let i = 0; i < this.fieldsCount; i++) {
                let buyField = this.buy + i
                arr[i] = []
                arr[i][0] = buyField
                arr[i][1] = this.socketData[buyField]
            }

            return arr
        },
        sellList() {
            let arr = []
            for (let i = 0; i < this.fieldsCount; i++) {
                let sellField = this.sell + i
                arr[i] = []
                arr[i][0] = sellField
                arr[i][1] = this.socketData[sellField]
            }

            return arr
        },
        chartData() {
            let o = {}
            this.sellList.reduce((obj, element)=>{
                obj[element[0]] = element[1]

                return o
            }, o)
            this.buyList.reduce((obj, element)=>{
                obj[element[0]] = element[1]

                return o
            }, o)

            return o
        },
        linkAddress() {
            return `request_name:push/distribute/capital|request_param:fullcode=${this.full_code}|request_id:${SOCKET_A_FLOW}|first_push:true`
        },
    },
    methods: {
        receiveSocketData(...args) {
            this.socketData = Object.assign({}, this.socketData, args[0][0])
            this.setDefaultValue()
        },
        setDefaultValue() {
            let count = this.fieldsCount
            for (let i = 0; i < count; i++) {
                let nowBuyVal = this.socketData[this.buy + i]
                let nowSellVal = this.socketData[this.sell + i]
                if (!nowBuyVal) {
                    this.socketData[this.buy + i] = 0
                }
                if (!nowSellVal) {
                     this.socketData[this.sell + i] = 0
                }
            }
        },
    },
    beforeDestroy() {
        this.$eventBus.$off(SOCKET_A_FLOW, this.receiveSocketData)
        this.cancleSocket(this.linkIndex)
    },
    watch: {
        full_code() {
            this.cancleSocket(this.linkIndex)
            this.sendLink(this.linkAddress)
            this.rememberLink(this.linkAddress, this.linkIndex)
        },
    },
}
</script>

<style lang="less">
.fund_flow_top {
    display: flex;
    justify-content: space-between;
}
.fund_flow_top_buyList {
    .flow_item_desc:nth-child(1) {
        background-color: rgba(255,43,72,0.4);
    }
    .flow_item_desc:nth-child(2) {
        background-color: rgba(255,43,72,0.6);
    }
    .flow_item_desc:nth-child(3) {
        background-color: rgba(255,43,72,0.8);
    }
    .flow_item_desc:nth-child(4) {
        background-color: rgba(255,43,72,1);
    }
    .flow_item_desc {
        margin-left: 5px;
        margin-right: 10px;
    }
}
.fund_flow_top_sellList {
    .flow_item_desc:nth-child(1) {
        background-color: rgba(6,180,95,0.4);
    }
    .flow_item_desc:nth-child(2) {
        background-color: rgba(6,180,95,0.6);
    }
    .flow_item_desc:nth-child(3) {
        background-color: rgba(6,180,95,0.8);
    }
    .flow_item_desc:nth-child(4) {
        background-color: rgba(6,180,95,1);
    }
    .flow_item_desc {
        margin-right: 5px;
        margin-left: 10px;
    }
    .flow_item {
        flex-direction: row-reverse;
    }
}
</style>
