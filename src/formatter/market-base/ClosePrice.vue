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
            return formatClosePrice(this.val, this.fields, this.current_type)
        },
    },
}
</script>
