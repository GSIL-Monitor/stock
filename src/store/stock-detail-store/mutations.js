// 提交更改 store
import {
    GET_STOCK_TAG,
    STOCK_GROUP_LIST,
    SELECT_GROUP_DATA,
    STOCK_RECENT_LIST,
    CURRENT_TYPE,
    STOCK_CODE,
    SOURCE,
    FULL_CODE,
    LEFT_STATE,
    RIGHT_STATE,
    INFO_STATE,
    HSINDEX_CATEGORY,
    KLINE_JUMP_PARAM,
    LEFT_SELECT_TAB,
    STOCK_NAME,
} from './config/mutation-types.js'
import {
    LOCAL_LEFT_TAB,
} from '@pages/stock-detail/storage.js'

export default {
    [GET_STOCK_TAG](state, payLoad) {
        state.tag_data = Object.assign({}, payLoad)
    },
    [STOCK_GROUP_LIST](state, payLoad) {
        state.group_data = [...payLoad]
    },
    [SELECT_GROUP_DATA](state, payLoad) {
        state.select_group_data = [...payLoad]
    },
    [STOCK_RECENT_LIST](state, payLoad) {
        state.recent_list_data = [...payLoad]
    },
    [CURRENT_TYPE](state, payLoad) {
        state.current_type = payLoad
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
    [KLINE_JUMP_PARAM](state, payLoad) {
        state.klineJumpState = payLoad
    },
    [LEFT_SELECT_TAB](state, payLoad) {
        state.leftActiveKey = payLoad
        localStorage.setItem(LOCAL_LEFT_TAB, payLoad)
    },
    [STOCK_NAME](state, payLoad) {
        state.stock_name = payLoad
    },
    [HSINDEX_CATEGORY](state, payLoad) {
        state.hsIndexCategory = payLoad
    },
}
