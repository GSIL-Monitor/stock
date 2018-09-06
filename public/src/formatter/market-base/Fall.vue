<script>
import Base from './mixins/base'
import { formatFall } from '../format-data'

export default {
    name: 'Fall',
    mixins: [Base],
    computed: {
        formatter() {
            return formatFall(this.val, this.fields)
        },
    },
}
</script>
