import {
    prefixCls
} from '../config/prefix.js'

export default {
    computed: {
        fields() {
            return ['source', 'symbol_type', 'stock_type', 'mark', 'price'].reduce((o, ele) => {
                let val = this[ele]
                if (val !== null) {
                    Reflect.set(o, ele, val)
                }

                return o
            }, {})
        },
        display() {
            return this.formatter.val
        },
        classes() {
            let color = this.formatter.color

            return [`${color}`, `${prefixCls}`]
        },
    },
    template: `<span :class="classes">
            {{display}}
         </span>`,
    props: {
        val: {
            required: true,
        },
        source: {
            default: null,
        },
        symbol_type: {
            default: null,
        },
        mark: {
            default: null,
        },
        stock_type: {
            default: null,
        },
        current_type: {
            default: null,
        },
    },
}
