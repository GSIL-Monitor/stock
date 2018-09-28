<script>
import Base from './mixins/base.js'
import { formatTurnover} from '../format-data.js'

export default {
    name: 'Turnover',
    mixins: [
        Base,
    ],
    computed: {
        formatter() {
            return formatTurnover(this.val, this.$_fields)
        },
    },
}
</script>
