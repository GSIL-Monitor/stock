<script>
import Base from './mixins/base.js'
import { formatPriceChangeRate } from '../format-data.js'

export default {
    name: 'PriceChangeRate',
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
            return formatPriceChangeRate(this.val, this.params, this.current_type)
        },
    },
    props: {
        price_change: {
            default: 0.
        },
        price: {

        },
    }
}
</script>
