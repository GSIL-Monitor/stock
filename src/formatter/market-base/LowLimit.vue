<script>
import Base from './mixins/base.js'
import { formatLowLimit } from '../format-data.js'

export default {
    name: 'LowLimit',
    mixins: [
        Base,
    ],
    computed: {
        params() {
            var o = this.fields
            if (this.stock_name) {
                o.stock_name = this.stock_name
            }

            return o
        },
        formatter() {
            return formatLowLimit(this.val, this.params, this.current_type)
        },
    },
    props: {
        stock_name: {
        }
    }
}
</script>
