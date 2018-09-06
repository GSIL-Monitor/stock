<script>
import Base from './mixins/base'
import { formatVolumeInner } from '../format-data'

export default {
    name: 'VolumeInner',
    mixins: [
        Base,
    ],
    computed: {
        formatter() {
            return formatVolumeInner(this.val, this.fields)
        }
    },
}
</script>
