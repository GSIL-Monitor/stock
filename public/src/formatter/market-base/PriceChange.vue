<script>
import Base from './mixins/base'
import { formatPriceChange } from '../format-data'

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
