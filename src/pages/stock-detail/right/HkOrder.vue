<template>
<div class="hk_order">
    <ul class="order_title">
        <li>买盘</li>
        <li>卖盘</li>
    </ul>
    <div class="order_info">
        <ul class="hk_order_buy">
            <HkOrderItem
                v-for="(item, index) of buyData"
                :key="index"
                :index="index + 1"
                :now_price="item.now_price"
                :now_volume="item.now_volume"
                :close_price="close_price"
                :current_type="current_type"
            />
        </ul>
        <ul class="hk_order_sell">
            <HkOrderItem
                v-for="(item, index) of sellData"
                :key="index"
                :index="index + 1"
                :now_price="item.now_price"
                :now_volume="item.now_volume"
                :close_price="close_price"
                :current_type="current_type"
            />
        </ul>
    </div>
</div>
</template>

<script>
import HkOrderItem from './HkOrderItem.vue'

export default {
    name: 'HkOrder',
    components: {
        HkOrderItem,
    },
    computed: {
        buyData() {
            return this.orderData.buy
        },
        sellData() {
            return this.orderData.sell
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
.hk_order {
    .order_title {
        display: flex;
        font-size: 12px;
        height: 25px;
        font-weight: bold;
        align-items: center;
        border-top: 1px solid var(--color-dividers);
        border-bottom: 1px solid var(--color-dividers);
        li {
            flex: 1;
            padding: 0 10px;
        }
    }
}

.order_info {
    display: flex;
    align-items: center;
}
.hk_order_buy,
.hk_order_sell {
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

.hk_order_buy {
    .item_index {
        background-color: var(--color-red);
    }
}

.hk_order_sell {
    .item_index {
        background-color: var(--color-green);
    }
}
</style>
