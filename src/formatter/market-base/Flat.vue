<script>
import Base from './mixins/base'
import { formatFlat } from '../format-data'

export default {
    name: 'Flat',
    mixins: [Base],
    computed: {
        formatter() {
            return formatFlat(this.val, this.fields)
        },
    },
}
</script>
