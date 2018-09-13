<script>
import Base from './mixins/base'
import { formatRose } from '../format-data'

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
