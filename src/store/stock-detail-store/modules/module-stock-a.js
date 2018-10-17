import {
    CHANGE_STOCK_A_ACTIVE_TAB,
} from '../config/mutation-types.js'

export default {
    state() {
        return {
            bottomTabConfig: {
                activeType: 'transaction',
                list: [
                    {
                        text: '分笔',
                        type: 'transaction',
                    },
                    {
                        text: '分价表',
                        type: 'price_table',
                    },
                    {
                        text: '资金流向',
                        type: 'fund_flow',
                    },
                    {
                        text: '短线精灵',
                        type: 'short_line',
                    },
                    {
                        text: '简易财务',
                        type: 'simple_finance',
                    },
                ],
            }
        }
    },
    getters: {
        filterList(state, getters, rootState, rootGetters) {
            return state.bottomTabConfig.list.filter((ele) => {
                let type = ele.type
                return !rootGetters.tapeFuncRemoveList.some((n) => {
                    return Object.is(type, n)
                })
            })
        },
        isAllTabsFalse(state, getters) {
            let nowActive = state.bottomTabConfig.activeType
            return getters.filterList.every((ele) => {
                return ele.type !== nowActive
            })
        },
        tabSwitchList(state, {
            filterList,
        }) {
            return {
                activeType: state.bottomTabConfig.activeType,
                list: filterList,
            }
        },
    },
    mutations: {
        [CHANGE_STOCK_A_ACTIVE_TAB](state, payLoad) {
            state.bottomTabConfig.activeType = payLoad
        },
    },
}
