import {
    isNumber,
} from '@formatter/utility.js'

export default {
    props: {
        chartData: {
            type: Array,
            required: true,
            default() {
                return []
            }
        },
        close_price: {
            required: true,
            validator(value) {
                return isNumber(value)
            },
        },
        total_volume: {
            required: true,
            validator(value) {
                return isNumber(value)
            },
        },
    },
}