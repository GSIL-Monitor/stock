<script>
import Base from './mixins/base.js'
import { formatTurnoverRate } from '../format-data.js'

export default {
    name: 'TurnoverRate',
    mixins: [
        Base,
    ],
    computed: {
        formatter() {
            return formatTurnoverRate(this.val, this.fields)
        },
    },
}
</script>
