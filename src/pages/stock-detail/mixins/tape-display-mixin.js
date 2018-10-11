import {
    mapState,
    mapMutations,
} from 'vuex'
import {
    CHANGE_TAPE_DISPLAY,
} from '@store/stock-detail-store/config/mutation-types.js'

export default {
    computed: {
        ...mapState({
            $_tapeState: state => state.moduleTape.tapeState,
        }),
    },
    methods: {
        ...mapMutations([
            CHANGE_TAPE_DISPLAY,
        ]),
        $_changeTapeDisplay() {
            let nextState = !this.$_tapeState
            this[CHANGE_TAPE_DISPLAY](nextState)
        },
    },
}
