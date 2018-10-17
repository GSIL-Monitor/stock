import {
    getStockRecent,
    addMyRecent,
} from '@service/index.js'
import {
    GET_RECENT_LIST_DATA,
    ADD_TO_RECENT_LIST,
} from '../config/action-types.js'
import {
    STOCK_RECENT_LIST,
} from '../config/mutation-types'

export default {
    state() {
        return {
            recent_list_data: [],
        }
    },
    getters: {
        recentVisitedSubFullCode({
            recent_list_data,
        }) {
            return recent_list_data.map((element) => {
                return element.full_code
            })
        },
    },
    mutations: {
        [STOCK_RECENT_LIST](state, payLoad) {
            state.recent_list_data = payLoad
        },
    },
    actions: {
        [ADD_TO_RECENT_LIST](context, param) {
            return addMyRecent(param)
        },
        async [GET_RECENT_LIST_DATA]({
            commit,
        }) {
            const response = await getStockRecent({
                options: {},
            })
            if (Object.is(response.code, 0)) {
                const selectData = response.data.map((element) => {
                    let full_code = `${element.source}${element.code}`
                    Reflect.set(element, 'price_change', element.change_value)
                    Reflect.set(element, 'price_change_rate', element.change_rate)
                    Reflect.set(element, 'stock_name', element.name)
                    Reflect.set(element, 'symbol_type', element.type)
                    Reflect.deleteProperty(element, 'change_value')
                    Reflect.deleteProperty(element, 'change_rate')
                    Reflect.deleteProperty(element, 'type')
                    Reflect.deleteProperty(element, 'name')

                    Reflect.set(element, 'full_code', full_code)
                    Reflect.set(element, 'classColor', '')

                    return element
                })

                commit(STOCK_RECENT_LIST, selectData)
            }
        },
    }
}
