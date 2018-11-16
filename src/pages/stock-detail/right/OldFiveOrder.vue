<template>
    <div class="old_order">
        <ul class="order_title">
            <li>买盘五档</li>
            <li>卖盘五档</li>
        </ul>
        <div class="order_radio">
            <div
                class="order_radio_item order_radio_red"
                :style="buyObject"
            >
                <span class="order_radio_item_label">{{calcRatio.buyRatio}}</span>
            </div>
            <div
                class="order_radio_item order_radio_green"
                :style="sellObject"
            >
                <span class="order_radio_item_label">{{calcRatio.sellRatio}}</span>
            </div>
        </div>
        <div class="order_info">
            <ul class="order_info_buy">
                <FiveOrderItem
                    v-for="(item, index) of buyData"
                    :key="index"
                    :index="(index + 1)"
                    :now_price="item.now_price"
                    :now_volume="item.now_volume"
                    :now_diff="item.now_diff"
                    :close_price="close_price"
                    :current_type="current_type"
                />
            </ul>
            <ul class="order_info_sell">
                <FiveOrderItem
                    v-for="(item, index) of sellData"
                    :key="index"
                    :index="(index + 1)"
                    :now_price="item.now_price"
                    :now_volume="item.now_volume"
                    :now_diff="item.now_diff"
                    :close_price="close_price"
                    :current_type="current_type"
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
    isNumber,
} from '@formatter/utility.js'

import FiveOrderItem from './FiveOrderItem.vue'

export default {
    name: 'OldFiveOrder',
    components: {
        FiveOrderItem,
    },
    computed: {
        buyData() {
            return this.orderData.buy
        },
        sellData() {
            return this.orderData.sell
        },
        calcRatio() {
            let buy_all = this.orderData.buy.reduce((sum, next) => {
                return sum + next.now_volume
            }, 0)
            let sell_all = this.orderData.sell.reduce((sum, next) => {
                return sum + next.now_volume
            }, 0)
            let sum = buy_all + sell_all
            let buyRatio, sellRatio

            if (isNumber(sum) && sum !== 0) {
                buyRatio = evenRound(buy_all / sum * 100)
                sellRatio = evenRound(sell_all / sum * 100)
            } else {
                buyRatio = 50
                sellRatio = 50
            }

            return {
                buyRatio: `${buyRatio}%`,
                sellRatio: `${sellRatio}%`,
            }
        },
        buyObject() {
            return {
                width: this.calcRatio.buyRatio,
            }
        },
        sellObject() {
            return {
                width: this.calcRatio.sellRatio,
            }
        },
    },
    props: {
        orderData: {
            type: Object,
            required: true,
        },
        close_price: {
            required: true,
        },
        current_type: {
            type: String,
            required: true,
        },
    },
}
</script>

<style lang="less">
.old_order {
    .order_radio {
        color: var(--color-white);
    }
    .order_title {
        display: flex;
        font-size: 12px;
        height: 25px;
        font-weight: bold;
        align-items: center;
        border-top: 1px solid var(--color-dividers);
        color: var(--color-table-header-text);
        li {
            flex: 1;
            padding: 0 10px;
        }
    }
    .order_info_buy .item_index {
        background-color: var(--color-red);
    }
    .order_info_sell .item_index {
        background-color: var(--color-green);
    }
}
.order_radio {
    height: 25px;
    display: flex;
}
.order_radio_item {
    display: flex;
    position: relative;
    align-items: center;
    font-size: 12px;
}
.order_radio_item_label {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3;
}
.order_radio_red .order_radio_item_label{
    left: 5px;
}
.order_radio_green .order_radio_item_label{
    right: 5px;
}
.order_radio_red {
    background-color: var(--color-red);
    justify-content: flex-start;
}
.order_radio_green {
    background-color: var(--color-green);
    justify-content: flex-end;
}
.order_info {
    display: flex;
    align-items: center;
}
.order_info_buy, .order_info_sell {
    flex: 1;
    .order_item {
        height: 25px;
        font-size: 12px;
    }
    .order_item_price {
        width: 33%;
        text-align: left;
        padding-right: 0;
    }
    .order_item_count, .order_item_incre {
        text-align: left;
    }
}
</style>
