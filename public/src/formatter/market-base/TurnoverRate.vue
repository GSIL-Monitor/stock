<script>
import Base from './mixins/base'
import { formatTurnoverRate } from '../format-data'

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
