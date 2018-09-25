<script>
import Base from './mixins/base.js'
import { formatFlat } from '../format-data.js'

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
