<template>
    <li class="order_item">
        <div class="order_item_index">
            <span class="item_index">
                {{index}}
            </span>
        </div>
        <span class="order_item_price"
            :class="[priceColor]"
        >
            {{formatPrice.val}}
        </span>
        <span class="order_item_count">
            {{volume_count}}
        </span>
        <span
            :class="['order_item_incre', diffColor]"
        >
            {{diffVolume}}
        </span>
    </li>
</template>

<script>
import formatPrice from '@formatter/market-fields/price'
import {
    RED,
    GREEN,
    DEFAULT,
} from '@formatter/config/color-config'
import {
    ASTOCK,
    SHBSTOCK,
    SZBSTOCK,
    FUND,
    BOND,
} from '@formatter/config/stock-type-config'

export default {
    name: 'FiveOrderItem',
    data() {
        return {
            handArr: [ASTOCK, SHBSTOCK, SZBSTOCK, FUND],
        }
    },
    computed: {
        // 转换成手为单位
        changeToHand() {
            return this.now_volume ? Math.floor(this.now_volume / 100) : '0'
        },
        formatPrice() {
            return formatPrice(this.now_price, {
            }, this.stockType)
        },
        volume_count() {
            if (this.handArr.includes(this.stockType)) {
                return this.changeToHand
            } else {
                return this.now_volume ? this.now_volume.toFixed(0) : '0'
            }
        },
        priceColor() {
            if (Object.is(this.now_price, 0)) {
                return DEFAULT
            } else {
                return this.now_price > this.close_price ? RED :
                       this.now_price < this.close_price ? GREEN :
                       DEFAULT
            }
        },
        diffColor() {
            return this.now_diff > 0 ? RED :
                   this.now_diff < 0 ? GREEN : DEFAULT
        },
        diffVolume() {
            return this.now_diff > 0 ? `+${this.now_diff}` :
                   this.now_diff < 0 ? this.now_diff : ''
        },
    },
    props: {
        index: {
            required: true,
            type: Number,
        },
        now_price: {
            required: true,
        },
        now_volume: {
            required: true,
        },
        now_diff: {
            type: Number,
            default: 0,
        },
        close_price: {
            required: true,
        },
        stockType: {
            type: String,
            required: true,
        },
    },
}
</script>

<style lang="less">
.order_item {
    display: flex;
    flex: 1 0 20px;
    align-items: center;
    font-size: 13px;
}
.order_item_index {
    width: 17%;
}
.item_index {
    width: 14px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    font-size: 11px;
    border-radius: 3px;
    color: var(--color-white);
    margin: 0 auto;
}
.order_item_price, .order_item_count {
    width: 27%;
    text-align: right;
}
.order_item_price, .order_item_count, .order_item_incre {
    padding-right: 5px;
}
.order_item_incre {
    flex: 1;
    text-align: right;
}
</style>