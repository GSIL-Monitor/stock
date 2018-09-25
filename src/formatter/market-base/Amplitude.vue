<script>
import Base from './mixins/base.js'
import { formatAmplitude } from '../format-data.js'

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
