<template>
<span :class="classes">
    {{display}}
</span>
</template>

<script>
import {
    prefixCls
} from './config/prefix'
import { formatStockName } from '../format-data'

export default {
    name: 'Name',
    computed: {
        formatter() {
            let name = formatStockName(this.val, {
                source: this.source,
                symbol_type: this.symbol_type,
            }, this.current_type)

            return {
                val: name,
                color: '',
            }
        },
        classes() {
            let color = this.formatter.color
            let isMyStock = this.is_defined ? 'is-my-stock' : ''

            return [
                `${color}`,
                `${prefixCls}`,
                isMyStock
            ]
        },
        display() {
            return this.formatter.val
        },
    },
    props: {
        is_defined: { // 自选股变色
            default: false,
        },
        val: {
            required: true,
        },
        source: {
            default: null,
        },
        symbol_type: {
            default: null,
        },
        current_type: {
            default: null,
        },
    },
}
</script>

<style lang="less">
    .is-my-stock {
        color: var(--color-gold-11);
    }
</style>
