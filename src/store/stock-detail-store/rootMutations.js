import {
    CURRENT_TYPE,
    STOCK_CODE,
    SOURCE,
    FULL_CODE,
    LEFT_STATE,
    RIGHT_STATE,
    INFO_STATE,
    KLINE_JUMP_PARAM,
    LEFT_SELECT_TAB,
    STOCK_NAME,
} from './config/mutation-types.js'

export default {
    [CURRENT_TYPE](state, payLoad) {
        state.current_type = payLoad
    },
    [STOCK_NAME](state, payLoad) {
        state.stock_name = payLoad
    },
    [STOCK_CODE](state, payLoad) {
        state.stock_code = payLoad
    },
    [SOURCE](state, payLoad) {
        state.source = payLoad
    },
    [FULL_CODE](state, payLoad) {
        state.full_code = payLoad
    },
    [LEFT_STATE](state, payLoad) {
        state.leftState = payLoad
    },
    [RIGHT_STATE](state, payLoad) {
        state.rightState = payLoad
    },
    [INFO_STATE](state, payLoad) {
        state.infoState = payLoad
    },
    [LEFT_SELECT_TAB](state, payLoad) {
        state.leftActiveKey = payLoad
    },
    [KLINE_JUMP_PARAM](state, payLoad) {
        state.klineJumpState = payLoad
    },
}
