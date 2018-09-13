<script>
import Base from './mixins/base'
import { formatQuantityRatio } from '../format-data'

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
