<script>
import Base from './mixins/base'
import { formatAmplitude } from '../format-data'

export default {
    name: 'Amplitude',
    mixins: [
        Base,
    ],
    computed: {
        formatter() {
            return formatAmplitude(this.val, this.fields)
        }
    }
}
</script>
