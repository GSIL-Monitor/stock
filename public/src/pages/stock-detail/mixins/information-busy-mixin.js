export default {
    data() {
        return {
            busy: true,
        }
    },
    methods: {
        setBusyState(length) {
            if (length < this.ROWS) {
                this.busy = true
            } else {
                this.$nextTick(() => {
                    this.busy = false
                })
            }
        },
        loadMore() {
            // 滚动加载
            this.busy = true
            this.page++
            this.fetchData()
        },
        resetState() {
            this.page = 1
            this.busy = true
            if (Object.is(this.noData, false)) {
                this.$refs.scrollContainer.scrollTop = 0
            }
            this.noData = false
            this.dataStore = []
        },
    },
}
