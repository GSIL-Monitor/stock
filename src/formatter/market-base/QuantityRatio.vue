<script>
import Base from './mixins/base.js'
import { formatQuantityRatio } from '../format-data.js'

export default {
    name: 'QuantityRatio',
    mixins: [
        Base,
    ],
    computed: {
        formatter() {
            return formatQuantityRatio(this.val, this.fields)
        },
    },
    props: {
    }
}
</script>
