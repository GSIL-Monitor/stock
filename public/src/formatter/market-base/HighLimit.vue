<script>
import Base from './mixins/base'
import { formatHighLimit } from '../format-data'

export default {
    name: 'HighLimit',
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
            return formatHighLimit(this.val, this.params, this.current_type)
        },
    },
    props: {
        stock_name: {
        }
    }
}
</script>


