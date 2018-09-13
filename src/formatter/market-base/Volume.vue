<script>
import Base from './mixins/base'
import { formatVolume } from '../format-data'

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
