<script>
import Base from './mixins/base.js'
import { formatShowCode } from '../format-data.js'

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
