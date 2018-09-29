import {
    mapState,
} from 'vuex'

export default {
    props: {
        titleState: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        ...mapState([
            'infoState',
        ]),
    },
    methods: {
        $_tabClicked(type) {
            if (Object.is(this.infoState, false)) {
                const SHOW = true
                this.$_changeContainerState(SHOW)
            }
            this.activeKey = type
        },
        $_changeContainerState(state) {
            this.$_eventBus.$emit('changeInfoState', state)
        },
    },
}
