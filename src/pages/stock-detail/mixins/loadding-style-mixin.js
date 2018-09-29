export default {
    data() {
        return {
            loadding: false,
            page: 1,
        }
    },
    computed: {
        $_isFirstLoadding() {
            return Object.is(this.page, 1)
        },
        $_wrapClasses() {
            return [
                {
                    loadingStyle: this.loadding,
                }
            ]
        },
    },
    methods: {
        $_addLoadding() {
            if (this.$_isFirstLoadding) {
                this.loadding = true
            }
        },
        $_removeLoadding() {
            this.loadding = false
        }
    },
}
