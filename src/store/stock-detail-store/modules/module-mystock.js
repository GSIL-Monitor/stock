import {
    getMyStockGroup,
    getMyStocks,
} from '@service/index.js'
import {
    STOCK_GROUP_LIST,
    SELECT_GROUP_DATA,
} from '../config/mutation-types.js'
import {
    GET_STOCK_GROUP_DATA,
    GET_SELECT_GROUP_DATA,
} from '../config/action-types.js'

export default {
    state() {
        return {
            group_data: [], // 自选股分组数据
            select_group_data: [], // 选中自选股分组的股票列表
        }
    },
    getters: {
        firstGroupId({
            group_data
        }) {
            return group_data[0] ? group_data[0].group_id : null
        },
    },
    mutations: {
        [STOCK_GROUP_LIST](state, payLoad) {
            state.group_data = [...payLoad]
        },
        [SELECT_GROUP_DATA](state, payLoad) {
            state.select_group_data = [...payLoad]
        },
    },
    actions: {
        [GET_STOCK_GROUP_DATA](context, param) {
            getMyStockGroup(param)
        },
        [GET_SELECT_GROUP_DATA](context, param) {
            getMyStocks(param)
        },
    },
}
