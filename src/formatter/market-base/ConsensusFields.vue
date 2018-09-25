<script>
import Base from './mixins/base.js'
import { formatConsensusFields } from '../format-data.js'

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
