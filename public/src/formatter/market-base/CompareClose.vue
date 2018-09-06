<script>
import Base from './mixins/base'
import { formatCompareClose } from '../format-data'

export default {
    name: 'CompareClose',
    mixins: [
        Base,
    ],
    computed: {
        params() {
            let o = this.fields
            Reflect.set(o, 'close_price', this.close_price)

            return o
        },
        formatter() {
            return formatCompareClose(this.val, this.params, this.current_type)
        },
    },
    props: {
        close_price: {
            required: true,
        },
    },
}
</script>
