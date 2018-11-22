import {
    CHANGE_WINDOW_CODE_LIST,
    KLINE_JUMP_PARAM,
} from '../config/mutation-types.js'

export default {
    state() {
        return {
            klineCodeList: null, // pageUp / pageDown 列表
            klineJumpState: null, // 从其他模块跳转过来设置的 K 线参数
        }
    },
    mutations: {
        [CHANGE_WINDOW_CODE_LIST](state, payLoad) {
            state.klineCodeList = payLoad
        },
        [KLINE_JUMP_PARAM](state, payLoad) {
            state.klineJumpState = payLoad
        },
    },
}
