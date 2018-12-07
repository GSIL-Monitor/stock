<!--  A / B 股 price 特殊处理 -->
<template>
    <!-- 停牌个股显示昨收 -->
    <ClosePrice
        v-if="options.stock_type === 0"
        :val="options.close_price"
        :current_type="options.current_type"
        class="top_market_price"
    ></ClosePrice>
    <!-- 临停个股(3)显示实时行情, 为复用方法，将 stock_type 置为 1 -->
    <Price
        v-else
        class="top_market_price"
        :val="options.price"
        :price_change="options.price_change"
        :current_type="options.current_type"
        :stock_type="options.stock_type === 3 ? 1 : options.stock_type"
    />
</template>

<script>
import Price from '@formatter/market-base/Price.vue'
import ClosePrice from '@formatter/market-base/ClosePrice.vue'

export default {
    name: 'SpecialHandlingPrice',
    props: {
        options: Object,
    },
    components: {
        Price,
        ClosePrice,
    },
}
</script>
