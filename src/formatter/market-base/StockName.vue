<script>
import Base from './mixins/base'
import { formatStockName } from '../format-data'

export default {
    name: 'Name',
    mixins: [
        Base,
    ],
    computed: {
        formatter() {
            let name = formatStockName(this.val, this.fields, this.current_type)
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
