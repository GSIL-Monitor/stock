import {
    mapState,
} from 'vuex'
import {
    getUrlDomain,
    getToken,
} from '@c/utils/util.js'
import {
    sendEvent,
} from '@c/utils/callQt.js'
import {
    MODULE_NAME,
} from '../storage.js'

export default {
    computed: {
        ...mapState([
            'stock_name',
        ]),
    },
    methods: {
        $_getJumpParam(url) {
            return {
                url,
                parentId: MODULE_NAME,
                keyword: this.stock_code,
            }
        },
        $_jumpInfoMore(type) {
            let baseUrl = getUrlDomain()
            let query = this.getQueryString(type)
            let token = getToken()

            let url = `${baseUrl}/html/stockMoreNews.html?${query}&token=${token}&qtFrame=1`

            let param = JSON.stringify(this.$_getJumpParam(url))

            sendEvent('hidden', '', param, true)
        },
    }
}
