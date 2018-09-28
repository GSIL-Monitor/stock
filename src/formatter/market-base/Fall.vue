<script>
import Base from './mixins/base.js'
import { formatFall } from '../format-data.js'

export default {
    name: 'Fall',
    mixins: [Base],
    computed: {
        formatter() {
            return formatFall(this.val, this.$_fields)
        },
    },
}
</script>
