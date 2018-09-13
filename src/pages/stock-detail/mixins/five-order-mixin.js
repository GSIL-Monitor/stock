/**
 * @description 买卖五档 mixin
*/

export default {
    data() {
        return {
            buy1_price: null,
            buy2_price: null,
            buy3_price: null,
            buy4_price: null,
            buy5_price: null,
            sell1_price: null,
            sell2_price: null,
            sell3_price: null,
            sell4_price: null,
            sell5_price: null,

            buy1_volume: null,
            buy2_volume: null,
            buy3_volume: null,
            buy4_volume: null,
            buy5_volume: null,
            sell1_volume: null,
            sell2_volume: null,
            sell3_volume: null,
            sell4_volume: null,
            sell5_volume: null,

            buy1_diff: 0,
            buy2_diff: 0,
            buy3_diff: 0,
            buy4_diff: 0,
            buy5_diff: 0,
            sell1_diff: 0,
            sell2_diff: 0,
            sell3_diff: 0,
            sell4_diff: 0,
            sell5_diff: 0,
        }
    },
    computed: {
        orderData() {
            return {
                buy: [
                    {
                        now_price: this.buy1_price,
                        now_volume: this.buy1_volume,
                        now_diff: this.buy1_diff,
                    },
                    {
                        now_price: this.buy2_price,
                        now_volume: this.buy2_volume,
                        now_diff: this.buy2_diff,
                    },
                    {
                        now_price: this.buy3_price,
                        now_volume: this.buy3_volume,
                        now_diff: this.buy3_diff,
                    },
                    {
                        now_price: this.buy4_price,
                        now_volume: this.buy4_volume,
                        now_diff: this.buy4_diff,
                    },
                    {
                        now_price: this.buy5_price,
                        now_volume: this.buy5_volume,
                        now_diff: this.buy5_diff,
                    },
                ],
                sell: [
                    {
                        now_price: this.sell1_price,
                        now_volume: this.sell1_volume,
                        now_diff: this.sell1_diff,
                    },
                    {
                        now_price: this.sell2_price,
                        now_volume: this.sell2_volume,
                        now_diff: this.sell2_diff,
                    },
                    {
                        now_price: this.sell3_price,
                        now_volume: this.sell3_volume,
                        now_diff: this.sell3_diff,
                    },
                    {
                        now_price: this.sell4_price,
                        now_volume: this.sell4_volume,
                        now_diff: this.sell4_diff,
                    },
                    {
                        now_price: this.sell5_price,
                        now_volume: this.sell5_volume,
                        now_diff: this.sell5_diff,
                    },
                ],
            }
        },
    },
    methods: {
        volumeDiff(val, oldVal) {
            return Math.floor((val - oldVal) / 100)
        },
        setDiffValue(prefix) {
            for (let i = 1; i <= 5; i++) {
                let priceFields = `${prefix}${i}_price`
                let diffFields = `${prefix}${i}_diff`
                let volumeFielfs = `${prefix}${i}_volume`

                if (Object.is(this.socketData[priceFields], this[priceFields])) {
                    this[diffFields] = this.volumeDiff(this.socketData[volumeFielfs], this[volumeFielfs])
                } else {
                    this[diffFields] = 0
                }
            }
        },
        setFiveOrderFields(prefix, data) {
            for (let i = 1; i <= 5; i += 1) {
                let priceFields = `${prefix}${i}_price`
                let volumeFielfs = `${prefix}${i}_volume`
                this[priceFields] = data[priceFields]
                this[volumeFielfs] = data[volumeFielfs]
            }
        },
    },
}