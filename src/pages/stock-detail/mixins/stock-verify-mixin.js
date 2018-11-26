import {
    ASTOCK,
    SHBSTOCK,
    SZBSTOCK,
    FUND,
    BOND,
    HKSTOCK,
    HKINDEX,
    HKFUND,
    HKBOND,
    HKWARRANT,
    HKCBBC,
    INDEX,
    FUTURES,
} from '@formatter/config/stock-type-config.js'

const stockVerify = [
    {
        type: ASTOCK,
        regexp: /^[01345678][0-9]{5}/,
    },
    {
        type: SHBSTOCK,
        regexp: /^900\d{3}$/,
    },
    {
        type: SZBSTOCK,
        regexp: /^200\d{3}$/,
    },
    {
        type: FUND,
        regexp: /^fund([a-z]{2})(\d{6})$/,
    },
    {
        type: BOND,
        regexp: /^bond[a-z]{2}[0-9]{6}$/,
    },
    {
        type: HKSTOCK,
        regexp: /^hk[0-9]{1,}/,
    },
    {
        type: HKINDEX,
        regexp: /^hk[a-zA-Z]+[0-9]*/,
    },
    {
        type: HKFUND,
        regexp: /^fund_H\w+/,
    },
    {
        type: HKBOND,
        regexp: /^bond_H\w+/,
    },
    {
        type: HKWARRANT,
        regexp: /^warrants\w+/,
    },
    {
        type: HKCBBC,
        regexp: /^cbbc\w+/,
    },
    {
        type: INDEX,
        // sh sz BK csi
        regexp: /^[a-zA-Z]{2,}[0-9]{1,}$/,
    },
    {
        type: FUTURES,
        regexp: /^qh_\w+/,
    },
]

export default {
    methods: {
        $_enSureStockType(hash) {
            const itemVerify = (arr, hash) => {
                return arr.regexp.test(hash)
            }

            const ele = stockVerify.find(el => {
                return itemVerify(el, hash)
            })

            return ele.type
        },
    },
}
