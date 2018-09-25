<script>
import Base from './mixins/base.js'
import { formatPriceChange } from '../format-data.js'

export default {
    name: 'PriceChange',
    mixins: [
        Base,
    ],
    computed: {
        formatter() {
            return formatPriceChange(this.val, this.fields, this.current_type)
        },
    },
    props: {
        price: {

        }
    }
}
</script>
