<script>
import Base from './mixins/base.js'
import { formatRose } from '../format-data.js'

export default {
    name: 'Rose',
    mixins: [
        Base,
    ],
    computed: {
        formatter() {
            return formatRose(this.val, this.fields)
        },
    },
}
</script>
