<template>
    <div class="top_market">
        <slot name="price">
            <Price
                class="top_market_price"
                :val="price"
                :price_change="price_change"
                :current_type="current_type"
                :stock_type="stock_type"
            ></Price>
        </slot>
        <PriceChange
            class="top_market_value"
            :val="price_change"
            :price="price"
            :current_type="current_type"
            :stock_type="stock_type"
        ></PriceChange>
        <PriceChangeRate
            class="top_market_rate"
            :val="price_change_rate"
            :price="price"
            :price_change="price_change"
            :current_type="current_type"
            :stock_type="stock_type"
        ></PriceChangeRate>
        <slot name="next"></slot>
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
        ]),
    },
    props: {
        stock_type: { //A股必传
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
