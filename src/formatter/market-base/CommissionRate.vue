<script>
import Base from './mixins/base.js'
import { formatCommissionRate } from '../format-data.js'

export default {
    name: 'CommissionRate',
    mixins: [
        Base,
    ],
    computed: {
        formatter() {
            return formatCommissionRate(this.val, this.$_fields)
        },
    },
}
</script>
