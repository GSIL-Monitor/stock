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
    </li>
</template>

<script>
import {
    RED,
    GREEN,
    DEFAULT,
} from '@formatter/config/color-config.js'
import formatPrice from '@formatter/market-fields/price.js'

export default {
    name: 'HkOrderItem',
    data() {
        return {
        }
    },
    computed: {
        formatPrice() {
            return formatPrice(this.now_price, {
            }, this.stockType)
        },
        volume_count() {
            return this.now_volume ? this.now_volume.toFixed(0) : '0'
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

<style lang="less" scoped>
.order_item {
    display: flex;
    flex: 1 0 20px;
    align-items: center;
    font-size: 12px;
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
    margin: 0 auto;
}
.order_item_price, {
    width: 35%;
}
.order_item_price, .order_item_count {
    text-align: center;
}
.order_item_count {
    flex: 1;
}
</style>