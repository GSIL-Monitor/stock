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
} from './config/mutation-types'

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
}