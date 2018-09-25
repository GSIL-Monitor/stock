import {
    pushData,
    UnSubscriptSockets,
} from '@c/utils/callQt.js'

export default {
    computed: {
        subFilterFields() {
            return [
                'price_change',
                'price_change_rate',
                // 'close_price',
                'full_code',
                'price',
                'source',
                'code',
                'stock_name',
                'stock_type',
                'symbol_type',
            ]
        },
    },
    methods: {
        subScription(requestId, params) {
            pushData(requestId, params)
        },
        unSubScription(requestId) {
            UnSubscriptSockets(requestId)
        },
        getBgColor(value, prevValue) {
            return  value > prevValue ? 'background-red' :
                    value < prevValue ? 'background-green' : ''
        },
        removeBgColor(arr) {
            setTimeout(() => {
                arr.forEach((element) => {
                    element.classColor = ''
                })
                arr = null
            }, 600)
        },
    }
}