<template>
    <div class="top_market">
        <Price
            class="top_market_price"
            :val="price"
            :price_change="price_change"
            :current_type="current_type"
        ></Price>
        <PriceChange
            class="top_market_value"
            :val="price_change"
            :price="price"
            :current_type="current_type"
        ></PriceChange>
        <PriceChangeRate
            class="top_market_rate"
            :val="price_change_rate"
            :price="price"
            :price_change="price_change"
            :current_type="current_type"
        ></PriceChangeRate>
        <!-- <span
            class="top_market_rate"
            :class="[formatPriceChangeRate.color]"
        >
            {{formatPriceChangeRate.val}}
        </span> -->
    </div>
</template>

<script>
import Price from '@formatter/market-base/Price.vue'
import PriceChange from '@formatter/market-base/PriceChange.vue'
import PriceChangeRate from '@formatter/market-base/PriceChangeRate.vue'

import {
    mapState,
} from 'vuex'

export default {
    name: "titleTopMarket",
    components: {
        Price,
        PriceChange,
        PriceChangeRate,
    },
    computed: {
        ...mapState([
            'current_type',
            'source',
        ]),
    },
    props: {
        symbol_type: {
            type: Number,
            default: 1
        },
        stock_type: {
            type: Number,
            default: 1,
        },
        price: {},
        price_change: {},
        price_change_rate: {},
    }
}
</script>

<style lang="less">
    .top_market {
        display: flex;
        align-items: baseline;
        color: rgba(255, 255, 255, 0.75);
        cursor: default;
    }
    .top_market_price, .top_market_value {
        margin-right: 15px;
    }
    .top_market_price {
        font-size: 30px;
    }
    .top_market_value, .top_market_rate{
        font-size: 16px;
    }
</style>
