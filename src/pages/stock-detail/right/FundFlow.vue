<template>
    <div class="right_bottom_container">
        <div class="view_title">
            <span class="fund_flow_dsc">资金流向</span>
            <default-btn
                @on-click="selectStock"
            >
                资金选股
            </default-btn>
        </div>
        <div class="view_vessel">
            <div
                v-if="noData"
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
import {
    JsToQtEventInterface,
} from '@c/utils/callQt.js'
import {
    FRAME_FUND_FLOW,
} from '../storage.js'
import {
    pushData,
    UnSubscriptSockets,
} from '@c/utils/callQt.js'

import DefaultBtn from '../components/DefaultBtn.vue'
import FundFlowPie from './FundFlowPie.vue'
import FundFlowBar from './FundFlowBar.vue'
import FundFlowList from './FundFlowList.vue'

export default {
    name: 'FundFlow',
    data() {
        return {
            socketData: {},
            buy: 'buy_',
            sell: 'sell_',
            fieldsCount: 4,
            noData: true,
        }
    },
    components: {
        DefaultBtn,
        FundFlowPie,
        FundFlowBar,
        FundFlowList,
    },
    created() {
        goGoal.event.listen(FRAME_FUND_FLOW, this.receiveSocketData)
        this.subToFrame()
    },
    computed: {
        ...mapState([
            'stock_code',
            'current_type',
            'full_code',
        ]),
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
    },
    methods: {
        subToFrame() {
            pushData(FRAME_FUND_FLOW, {
                code: this.full_code,
                request_name: 'distribute/capital',
            })
        },
        unSubToFrame() {
            UnSubscriptSockets(FRAME_FUND_FLOW)
        },
        receiveSocketData(args) {
            const { receive_content, request_content } = JSON.parse(args)
            const data = receive_content[0]

            if (!request_content.includes(this.full_code)) {
                return false
            }
            if (Object.is(data.mark, 1)) {
                // clear
                this.socketData = {}
                this.noData = true
            } else {
                this.socketData = Object.assign({}, this.socketData, data)
                this.setDefaultValue()
                if (this.noData) {
                    this.noData = false
                }
            }
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
        // 资金选股点击
        selectStock() {
            const FUNC_NAME = 'MainFundSelStock'
            JsToQtEventInterface(JSON.stringify({
                fun: FUNC_NAME,
            }))
        },
    },
    beforeDestroy() {
        goGoal.event.remove(FRAME_FUND_FLOW, this.receiveSocketData)
        this.unSubToFrame()
    },
    watch: {
        full_code() {
            this.noData = true
            // this.unSubToFrame()
            this.socketData = {}
            this.subToFrame()
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
    .flow_item:nth-child(1) {
        .flow_item_desc {
            background-color: rgba(255,43,72,0.4);
        }
    }
    .flow_item:nth-child(2) {
        .flow_item_desc {
            background-color: rgba(255,43,72,0.6);
        }
    }
    .flow_item:nth-child(3) {
        .flow_item_desc {
            background-color: rgba(255,43,72,0.8);
        }
    }
    .flow_item:nth-child(4) {
        .flow_item_desc {
            background-color: rgba(255,43,72,1);
        }
    }
    .flow_item_desc {
        margin-left: 5px;
        margin-right: 10px;
    }
}
.fund_flow_top_sellList {
    .flow_item:nth-child(1) {
        .flow_item_desc {
            background-color: rgba(6,180,95,0.4);
        }
    }
    .flow_item:nth-child(2) {
        .flow_item_desc {
            background-color: rgba(6,180,95, 0.6);
        }
    }
    .flow_item:nth-child(3) {
        .flow_item_desc {
            background-color: rgba(6,180,95,0.8);
        }
    }
    .flow_item:nth-child(4) {
        .flow_item_desc {
            background-color: rgba(6,180,95,1);
        }
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
