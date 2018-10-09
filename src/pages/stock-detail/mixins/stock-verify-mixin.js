import * as TYPE from '@formatter/config/stock-type-config.js'

const stockVerify = [
    {
        type: TYPE.ASTOCK,
        regexp: /^[01345678][0-9]{5}/,
    },
    {
        type: TYPE.SHBSTOCK,
        regexp: /^900\d{3}$/,
    },
    {
        type: TYPE.SZBSTOCK,
        regexp: /^200\d{3}$/,
    },
    {
        type: TYPE.FUND,
        regexp: /^fund([a-z]{2})(\d{6})$/,
    },
    {
        type: TYPE.BOND,
        regexp: /^bond[a-z]{2}[0-9]{6}$/,
    },
    {
        type: TYPE.HKSTOCK,
        regexp: /^hk[0-9]{1,}/,
    },
    {
        type: TYPE.HKINDEX,
        regexp: /^hk[a-zA-Z]+[0-9]*/,
    },
    {
        type: TYPE.HKFUND,
        regexp: /^fund_H\w+/,
    },
    {
        type: TYPE.HKBOND,
        regexp: /^bond_H\w+/,
    },
    {
        type: TYPE.HKWARRANT,
        regexp: /^warrants\w+/,
    },
    {
        type: TYPE.HKCBBC,
        regexp: /^cbbc\w+/,
    },
    {
        type: TYPE.INDEX,
        regexp: /^[a-zA-Z]{2,}[0-9]{1,}$/,
    },
    {
        type: TYPE.FUTURES,
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
