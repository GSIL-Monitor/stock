<script>
import Base from './mixins/base.js'
import { formatHighLimit } from '../format-data.js'

export default {
    name: 'HighLimit',
    mixins: [
        Base,
    ],
    computed: {
        params() {
            var o = this.$_fields
            if (this.stock_name) {
                o.stock_name = this.stock_name
            }

            return o
        },
        formatter() {
            return formatHighLimit(this.val, this.params, this.current_type)
        },
    },
    props: {
        stock_name: {
        }
    }
}
</script>


