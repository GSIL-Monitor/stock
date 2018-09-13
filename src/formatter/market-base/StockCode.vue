<script>
import Base from './mixins/base'
import { formatShowCode } from '../format-data'

export default {
    name: 'StockCode',
    mixins: [
        Base,
    ],
    computed: {
        formatter() {
            let name = formatShowCode(this.val, this.fields)
            return {
                val: name,
                color: '',
            }
        }
    },
    props: {
    },
}
</script>
