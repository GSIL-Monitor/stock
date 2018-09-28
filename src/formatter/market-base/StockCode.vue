<script>
import Base from './mixins/base.js'
import { formatShowCode } from '../format-data.js'
import {
    prefixCls
} from './config/prefix.js'

export default {
    name: 'StockCode',
    mixins: [
        Base,
    ],
    props: {
        is_defined: { // 自选股变色
            default: false,
        },
    },
    computed: {
        formatter() {
            let name = formatShowCode(this.val, this.$_fields)

            return {
                val: name,
                color: '',
            }
        },
        $_classes() {
            let color = this.formatter.color
            let isMyStock = this.is_defined ? 'is-my-stock' : ''

            return [
                `${color}`,
                `${prefixCls}`,
                isMyStock
            ]
        },
    },
}
</script>

<style lang="less">
    .is-my-stock {
        color: var(--color-gold-11);
    }
</style>
