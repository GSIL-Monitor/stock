<script>
import Base from './mixins/base.js'
import { formatVolumeInner } from '../format-data.js'

export default {
    name: 'VolumeInner',
    mixins: [
        Base,
    ],
    computed: {
        formatter() {
            return formatVolumeInner(this.val, this.fields, this.current_type)
        }
    },
}
</script>
