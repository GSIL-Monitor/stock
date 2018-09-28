<script>
import Base from './mixins/base.js'
import { formatPriceChange } from '../format-data.js'

export default {
    name: 'PriceChange',
    mixins: [
        Base,
    ],
    props: {
        price: {

        }
    },
    computed: {
        formatter() {
            return formatPriceChange(this.val, this.$_fields, this.current_type)
        },
    },
}
</script>
