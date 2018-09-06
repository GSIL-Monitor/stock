export default {
    data() {
        return {
            extendHeight: 200,
        }
    },
    created() {
        window.addEventListener('resize', this.resizeWindow)
    },
    mounted() {
        this.resizeWindow()
    },
    computed: {
        extendStyles() {
            let height = this.extendHeight
            return {
                height: `${height}px`,
            }
        },
    },
    methods: {
        resizeWindow() {
            let top = this.$refs.detailExtend.getBoundingClientRect().top
            let residue = window.innerHeight - top

            this.extendHeight = residue
        },
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeWindow)
    },
}