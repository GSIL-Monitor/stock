<script>
import Base from './mixins/base.js'
import { formatCompareClose } from '../format-data.js'

export default {
    name: 'CompareClose',
    mixins: [
        Base,
    ],
    props: {
        close_price: {
            required: true,
        },
    },
    computed: {
        params() {
            let o = this.$_fields
            Reflect.set(o, 'close_price', this.close_price)

            return o
        },
        formatter() {
            return formatCompareClose(this.val, this.params, this.current_type)
        },
    },
}
</script>
