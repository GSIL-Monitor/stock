import {
    getIndexData,
    getIndexStocks,
} from '@service/index.js'
import {
    HSINDEX_CATEGORY,
} from '../config/mutation-types.js'
import {
    GET_HS_INDEX_MARKET_DATA,
    GET_HS_INDEX_CONSTITUENT_LIST,
} from '../config/action-types.js'

export default {
    state() {
        return {
            hsIndexCategory: null,
        }
    },
    mutations: {
        [HSINDEX_CATEGORY](state, payLoad) {
            state.hsIndexCategory = payLoad
        },
    },
    actions: {
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
    },
}