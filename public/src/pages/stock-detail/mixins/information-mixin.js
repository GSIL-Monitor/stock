export default {
    methods: {
        tabClicked(type) {
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