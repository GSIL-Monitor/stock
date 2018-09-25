<script>
import Base from './mixins/base.js'
import { formatVolumeOuter } from '../format-data.js'

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
