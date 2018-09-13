<template>
    <table class="detail_table">
        <slot></slot>
    </table>
</template>

<script>
export default {
    name: 'MarketInfo',
}
</script>

<style lang="less">
.detail_table {
    width: 100%;
    tr {
        height: 23px;
    }
    .two-letters:first-letter {
        letter-spacing: 13px;
    }
}
</style>
