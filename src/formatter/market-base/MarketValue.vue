<template>
    <span
        :class="classes"
    >{{display}}</span>
</template>

<script>
import {
    prefixCls
} from './config/prefix.js'
import { formatMarketValue } from '../format-data.js'

export default {
    name: 'MarketValue',
    props: [
        'val'
    ],
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
}
</script>
