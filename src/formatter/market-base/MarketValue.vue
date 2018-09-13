<template>
    <span
        :class="classes"
    >
        {{display}}
    </span>
</template>

<script>
import {
    prefixCls
} from './config/prefix'
import { formatMarketValue } from '../format-data'

export default {
    name: 'MarketValue',
    data() {
        return {
            prefixCls,
        }
    },
    computed: {
        formatter() {
            return formatMarketValue(this.val)
        },
        display() {
            return this.formatter.val
        },
        classes() {
            let color = this.formatter.color
            return [
                `${prefixCls}`,
                `${color}`,
            ]
        }
    },
    props: [
        'val'
    ]
}
</script>
