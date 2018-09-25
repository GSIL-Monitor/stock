<script>
import Base from './mixins/base.js'
import { formatVolume } from '../format-data.js'

export default {
    name: 'Volume',
    mixins: [
        Base,
    ],
    computed: {
        formatter() {
            return formatVolume(this.val, this.fields)
        },
    },
}
</script>
