export default {
    data() {
        return {
            loadding: false,
            page: 1,
        }
    },
    computed: {
        isFirstLoadding() {
            return Object.is(this.page, 1)
        },
        wrapClasses() {
            return [
                {
                    loadingStyle: this.loadding,
                }
            ]
        },
    },
    methods: {
        addLoadding() {
            if (this.isFirstLoadding) {
                this.loadding = true
            }
        },
        removeLoadding() {
            if (this.isFirstLoadding) {
                this.loadding = false
            }
        }
    },
}
