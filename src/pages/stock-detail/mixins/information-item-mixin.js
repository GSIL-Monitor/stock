import {
    mapState,
} from 'vuex'
import {
    formatShowCode,
} from '@formatter/format-data.js'

export default {
    data() {
        return {
            busy: true,
        }
    },
    computed: {
        ...mapState([
            'stock_code',
            'source',
        ]),
        $_showCode() {
            return formatShowCode(this.stock_code, {
                source: this.source,
            })
        },
    },
    methods: {
        $_setBusyState(length) {
            if (length < this.ROWS) {
                this.busy = true
            } else {
                this.$nextTick(() => {
                    this.busy = false
                })
            }
        },
        $_loadMore() {
            // 滚动加载
            this.busy = true
            this.page++
            this.fetchData()
        },
        $_resetState() {
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
