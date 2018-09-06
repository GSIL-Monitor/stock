<script>
import Base from './mixins/base'
import { formatTurnover} from '../format-data'

export default {
    name: 'Turnover',
    mixins: [
        Base,
    ],
    computed: {
        formatter() {
            return formatTurnover(this.val, this.fields)
        },
    },
}
</script>
