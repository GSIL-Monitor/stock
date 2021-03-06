<template>
    <div
        class="five_order"
        :class="[getRowClass]"
    >
        <div class="five_order_sell">
            <ul class="volume_info">
                <FiveOrderItem
                    v-for="(item, index) of sellData"
                    :key="index"
                    :index="index + 1"
                    :now_price="item.now_price"
                    :now_volume="item.now_volume"
                    :now_diff="item.now_diff"
                    :close_price="close_price"
                    :current_type="current_type"
                />
            </ul>
            <div class="volume_cont">{{calcRatio.sellRatio}}</div>
        </div>
        <div class="five_order_buy">
            <ul class="volume_info">
                <FiveOrderItem
                    v-for="(item, index) of buyData"
                    :key="index"
                    :index="index + 1"
                    :now_price="item.now_price"
                    :now_volume="item.now_volume"
                    :now_diff="item.now_diff"
                    :close_price="close_price"
                    :current_type="current_type"
                />
            </ul>
            <div class="volume_cont">{{calcRatio.buyRatio}}</div>
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
    name: 'FiveOrder',
    computed: {
        getRowClass() {
            return this.row === '3' ? 'three_row' :
                   this.row === '0' ? 'zero_row' : ''
        },
        buyData() {
            return this.orderData.buy
        },
        sellData() {
            return this.orderData.sell
        },
        calcRatio() {
            let buy_all = this.orderData.buy.slice(0, Number(this.row)).reduce((sum, next) => {
                return sum + next.now_volume
            }, 0)
            let sell_all = this.orderData.sell.slice(0, Number(this.row)).reduce((sum, next) => {
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
    },
    components: {
        FiveOrderItem,
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
        row: {
            type: [String],
            default: '5',
        },
    },
}
</script>

<style lang="less">
.five_order {
    border-bottom: 1px solid var(--color-dividers);
}
.five_order_sell,
.five_order_buy {
    display: flex;
    overflow: hidden;
}
.volume_info {
    display: flex;
    flex: 1;
}
.five_order_sell {
    .volume_info {
        flex-direction: column-reverse;
    }
}
.five_order_buy {
    .volume_info {
        flex-direction: column;
    }
}
.volume_cont {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    color: var(--color-white);
    font-size: 12px;
}
.five_order_sell {
    .volume_cont,
    .item_index {
        background-color: var(--color-green);
    }
}
.five_order_buy {
    .volume_cont,
    .item_index {
        background-color: var(--color-red);
    }
}
.three_row {
    .five_order_sell, .five_order_buy{
        height: 60px;
    }
}
.zero_row {
    .five_order_sell, .five_order_buy{
        height: 0;
    }
}
</style>
