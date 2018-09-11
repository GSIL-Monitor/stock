import * as TYPE from '@formatter/config/stock-type-config'

// 计算属性
export default {
    isAStock(state) {
        return Object.is(TYPE.ASTOCK, state.current_type)
    },
    isBStock(state) {
        return [TYPE.SHBSTOCK, TYPE.SZBSTOCK].includes(state.current_type)
    },
    // 沪深指数
    isHSIndex(state) {
        return Object.is(TYPE.INDEX, state.current_type)
    },
    // 沪深基金
    isFund(state) {
        return Object.is(TYPE.FUND, state.current_type)
    },
    // 沪深债券
    isBond(state) {
        return Object.is(TYPE.BOND, state.current_type)
    },
    isHkNormal(state, getters) {
        return getters.isHkStock
            || getters.isHkFund
            || getters.isHkBond
            || getters.isHkWarrant
            || getters.isHkCbbc
    },
    // 港股股票
    isHkStock(state) {
        return Object.is(TYPE.HKSTOCK, state.current_type)
    },
    // 港股基金
    isHkFund(state) {
        return Object.is(TYPE.HKFUND, state.current_type)
    },
    // 港股债券
    isHkBond(state) {
        return Object.is(TYPE.HKBOND, state.current_type)
    },
    // 港股涡轮
    isHkWarrant(state) {
        return Object.is(TYPE.HKWARRANT, state.current_type)
    },
    // 港股牛熊证
    isHkCbbc(state) {
        return Object.is(TYPE.HKCBBC, state.current_type)
    },
    // 港股指数
    isHkIndex(state) {
        return Object.is(TYPE.HKINDEX, state.current_type)
    },
    // 期货
    isFuture(state) {
        return Object.is(TYPE.FUTURES, state.current_type)
    },
    hasInformation(state, getters) {
        return getters.isAStock
            || getters.isHSIndex
            || getters.isHkStock
    },
}
