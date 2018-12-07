<template>
    <span
        v-if="[0, 3].includes(stock_type)"
        class="price_stop_business"
    >{{label}}</span>
</template>

<script>
export default {
    name: 'StopBusiness',
    props: [
        'stock_type',
    ],
    computed: {
        label() {
            return this.stock_type === 0 ? '停牌':
                   this.stock_type === 3 ? '临停': ''
        },
    },
}
</script>

<style lang="less">
.price_stop_business {
    position: relative;
    padding: 2px 9px;
    background: #8a9fae;
    color: var(--white);
    font-size: 12px;
    top: -4px;
}
</style>
