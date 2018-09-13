import {
    mapState,
} from 'vuex'

export default {
    computed: {
        ...mapState([
            'infoState',
        ])
    },
    methods: {
        tabClicked(type) {
            if (Object.is(this.infoState, false)) {
                const SHOW = true
                this.changeContainerState(SHOW)
            }
            this.activeKey = type
        },
        changeContainerState(state) {
            this.$eventBus.$emit('changeInfoState', state)
        },
    },
    props: {
        titleState: {
            type: Boolean,
            default: false,
        },
    },
}
