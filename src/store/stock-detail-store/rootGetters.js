import {
    ASTOCK,
    SHBSTOCK,
    SZBSTOCK,
    INDEX,
    FUND,
    BOND,
    HKSTOCK,
    HKFUND,
    HKBOND,
    HKWARRANT,
    HKCBBC,
    HKINDEX,
    FUTURES,
} from '@formatter/config/stock-type-config.js'

export default {
    isAStock({
        current_type,
    }) {
        return Object.is(ASTOCK, current_type)
    },
    isBStock({
        current_type,
    }) {
        return [SHBSTOCK, SZBSTOCK].includes(current_type)
    },
    // 沪深指数
    isHSIndex({
        current_type,
    }) {
        return Object.is(INDEX, current_type)
    },
    // 沪深基金
    isFund({
        current_type,
    }) {
        return Object.is(FUND, current_type)
    },
    // 沪深债券
    isBond({
        current_type,
    }) {
        return Object.is(BOND, current_type)
    },
    isHkNormal(state, {
        isHkStock,
        isHkFund,
        isHkBond,
        isHkWarrant,
        isHkCbbc,
    }) {
        return (isHkStock
            || isHkFund
            || isHkBond
            || isHkWarrant
            || isHkCbbc
        )
    },
    // 港股股票
    isHkStock({
        current_type,
    }) {
        return Object.is(HKSTOCK, current_type)
    },
    // 港股基金
    isHkFund({
        current_type,
    }) {
        return Object.is(HKFUND, current_type)
    },
    // 港股债券
    isHkBond({
        current_type,
    }) {
        return Object.is(HKBOND, current_type)
    },
    // 港股涡轮
    isHkWarrant({
        current_type,
    }) {
        return Object.is(HKWARRANT, current_type)
    },
    // 港股牛熊证
    isHkCbbc({
        current_type,
    }) {
        return Object.is(HKCBBC, current_type)
    },
    // 港股指数
    isHkIndex({
        current_type,
    }) {
        return Object.is(HKINDEX, current_type)
    },
    // 期货
    isFuture({
        current_type,
    }) {
        return Object.is(FUTURES, current_type)
    },
    hasInformation(state, {
        isAStock,
        isHSIndex,
        isHkStock,
    }) {
        return (isAStock
            || isHSIndex
            || isHkStock
        )
    },
    canLoadF10({
        hsIndexCategory,
    }, {
        isAStock,
        isBStock,
        isFund,
        isBond,
        isHkStock,
        isHSIndex,
    }) {
        if (isAStock
            || isBStock
            || isFund
            || isBond
            || isHkStock
        ) {
            return true
        } else if (isHSIndex
            && Array.isArray(hsIndexCategory)
            && hsIndexCategory.includes(1)
        ) {
            // 沪深指数且为重要指数
            return true
        } else {
            return false
        }
    },
    canLoadF1(state, {
        isAStock,
        isBStock,
        isFund,
        isBond,
    }) {
        return (isAStock
            || isBStock
            || isFund
            || isBond
        )
    },
}
