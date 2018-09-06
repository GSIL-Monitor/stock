import {
    getStocktag,
    getMyStockGroup,
    getMyStocks,
    getStockRecent,
} from '@service/'
import {
    GET_STOCK_TAG_DATA,
    GET_STOCK_GROUP_DATA,
    GET_SELECT_GROUP_DATA,
    GET_RECENT_LIST_DATA,
} from './config/action-types'

export default {
    [GET_STOCK_TAG_DATA](context, param) {
        getStocktag(param)
    },
    [GET_STOCK_GROUP_DATA](context, param) {
        getMyStockGroup(param)
    },
    [GET_SELECT_GROUP_DATA](context, param) {
        getMyStocks(param)
    },
    [GET_RECENT_LIST_DATA](context, param = {}) {
        getStockRecent(param)
    },
}
