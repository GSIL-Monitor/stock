import {
    getStocktag,
    getMyStockGroup,
    getMyStocks,
    getStockRecent,
    getIndexData,
    getIndexStocks,
    addMyRecent,
} from '@service/index.js'
import {
    GET_STOCK_TAG_DATA,
    GET_STOCK_GROUP_DATA,
    GET_SELECT_GROUP_DATA,
    GET_RECENT_LIST_DATA,
    GET_HS_INDEX_MARKET_DATA,
    GET_HS_INDEX_CONSTITUENT_LIST,
    ADD_TO_RECENT_LIST,
} from './config/action-types.js'
// import {
//     HSINDEX_CATEGORY,
// } from './config/mutation-types'

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
    async [GET_HS_INDEX_MARKET_DATA](context, param) {
        await getIndexData(param)
                // .then((response) => {
                //     const code = response.code
                //     if (Object.is(code, 0)) {
                //         const data = response.data
                //         commit(HSINDEX_CATEGORY, data.category)
                //     }
                // })
    },
    async [GET_HS_INDEX_CONSTITUENT_LIST]({ state, dispatch }, param) {
        // if (Object.is(param.options.page, 1)) {
        //     await dispatch(GET_HS_INDEX_MARKET_DATA, {
        //         options: {
        //             fullcode: state.full_code,
        //         }
        //     })
        // }

        // const category = state.hsIndexCategory
        // if (Array.isArray(category)) {
        //     param.options.type = category.includes(1) ? 9 : 3
        // } else {
        //     param.options.type = 9
        // }
        await getIndexStocks(param)
    },
    [ADD_TO_RECENT_LIST](context, param) {
        addMyRecent(param)
    },
}
