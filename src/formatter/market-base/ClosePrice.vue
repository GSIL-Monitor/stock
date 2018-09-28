<script>
import Base from './mixins/base.js'
import {
    formatClosePrice,
} from '../format-data.js'

export default {
    name: 'Close',
    mixins: [Base],
    computed: {
        formatter() {
            return formatClosePrice(this.val, this.$_fields, this.current_type)
        },
    },
}
</script>
