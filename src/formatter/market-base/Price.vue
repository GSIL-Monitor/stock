<script>
import Base from './mixins/base.js'
import { formatPrice } from '../format-data.js'

export default {
    name: 'Price',
    mixins: [
        Base,
    ],
    computed: {
        params() {
            let o = this.fields
            o.price_change = this.price_change

            return o
        },
        formatter() {
            return formatPrice(this.val, this.params, this.current_type)
        },
    },
    props: {
        price_change: { // 判断颜色
            default: 0,
        },
    },
}
</script>