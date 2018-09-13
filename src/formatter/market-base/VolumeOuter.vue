<script>
import Base from './mixins/base'
import { formatVolumeOuter } from '../format-data'

export default {
    name: 'VolumeOuter',
    mixins: [
        Base,
    ],
    computed: {
        formatter() {
            return formatVolumeOuter(this.val, this.fields)
        }
    },
}
</script>
