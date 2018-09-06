<script>
import Base from './mixins/base'
import {
    formatClosePrice,
} from '../format-data'

export default {
    name: 'Close',
    mixins: [Base],
    computed: {
        formatter() {
            return formatClosePrice(this.val, this.fields, this.current_type)
        },
    },
}
</script>
