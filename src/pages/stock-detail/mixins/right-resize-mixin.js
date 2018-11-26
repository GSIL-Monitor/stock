import throttle from 'lodash/throttle'

export default {
    data() {
        return {
            extendHeight: 200,
        }
    },
    computed: {
        $_extendStyles() {
            let height = this.extendHeight
            return {
                height: `${height}px`,
            }
        },
    },
    methods: {
        $_resizeWindow: throttle(function() {
            let top = this.$refs.detailExtend.getBoundingClientRect().top
            let residue = window.innerHeight - top

            this.extendHeight = residue
        }, 100),
        $_nextResizeWindow() {
            this.$nextTick(() => {
                this.$_resizeWindow()
            })
        },
    },
    created() {
        window.addEventListener('resize', this.$_resizeWindow)
    },
    mounted() {
        this.$_resizeWindow()
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.$_resizeWindow)
    },
}