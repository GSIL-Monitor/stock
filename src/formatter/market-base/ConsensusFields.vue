<script>
import Base from './mixins/base'
import { formatConsensusFields } from '../format-data'

export default {
    name: 'Rose',
    mixins: [Base],
    computed: {
        formatter() {
            return formatConsensusFields(this.val)
        },
    },
}
</script>
