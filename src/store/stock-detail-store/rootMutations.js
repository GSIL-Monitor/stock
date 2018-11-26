import {
    CHANGE_HASH,
    CURRENT_TYPE,
    STOCK_CODE,
    SOURCE,
    FULL_CODE,
    LEFT_STATE,
    RIGHT_STATE,
    INFO_STATE,
    LEFT_SELECT_TAB,
    STOCK_NAME,
    HSINDEX_CATEGORY,
    JUMP_FROM_TRADE,
} from './config/mutation-types.js'

export default {
    [CHANGE_HASH](state, payLoad) {
        state.stockHash = payLoad
    },
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
    [HSINDEX_CATEGORY](state, payLoad) {
        state.hsIndexCategory = payLoad
    },
    [JUMP_FROM_TRADE](state, payLoad) {
        state.isJumpFromTradeStock = payLoad
    },
}
