import {
    TAPE_ROWS,
    TAPE_CONTENT,
    TAPE_STYLE,
    FUNC_PERFORMANCE,
} from '@pages/stock-detail/tape/tape-set-config.js'
import {
    CHANGE_TAPE_SET,
    CHANGE_TAPE_FUNC,
    RESET_TAPE_FUNC,
    RESET_TAPE_CONTENT,
    CHANGE_TAPE_DISPLAY,
} from '../config/mutation-types.js'
import {
    TAPE_RESET_STATE,
} from '../config/action-types.js'

const defaults = new Map([
    [TAPE_ROWS, '5'],
    [TAPE_CONTENT, 'market'],
    [TAPE_STYLE, 'off'],
])

export default {
    state() {
        return {
            tapeState: false,
            [TAPE_ROWS]: {
                type: TAPE_ROWS,
                title: '委托明细',
                className: 'tape-case-entrust',
                activeType: defaults.get(TAPE_ROWS), // 默认 5 档
                list: [
                    {
                        text: '五档',
                        type: '5',
                    },
                    {
                        text: '三档',
                        type: '3',
                    },
                    {
                        text: '隐藏',
                        type: '0',
                    },
                ],
            },
            [TAPE_CONTENT]: {
                type: TAPE_CONTENT,
                title: '默认盘口内容',
                className: 'tape-case-content',
                activeType: defaults.get(TAPE_CONTENT), // 默认行情数据
                list: [
                    {
                        text: '行情数据',
                        type: 'market',
                    },
                    {
                        text: '一致预期',
                        type: 'entrust',
                    },
                ],
            },
            [TAPE_STYLE]: {
                type: TAPE_STYLE,
                title: '默认盘口样式',
                className: 'tape-case-style',
                activeType: defaults.get(TAPE_STYLE), // 默认收起
                list: [
                    {
                        text: '展开',
                        type: 'on',
                    },
                    {
                        text: '收起',
                        type: 'off',
                    },
                ],
            },
            [FUNC_PERFORMANCE]: {
                type: [FUNC_PERFORMANCE],
                title: '功能显隐',
                list: [
                    {
                        text: '分价表',
                        type: 'price_table',
                        on: true,
                    },
                    {
                        text: '资金流向',
                        type: 'fund_flow',
                        on: true,
                    },
                    {
                        text: '短线精灵',
                        type: 'short_line',
                        on: true,
                    },
                    {
                        text: '简易财务',
                        type: 'simple_finance',
                        on: true,
                    },
                ],
            },
        }
    },
    getters: {
        tapeFuncRemoveList(state) {
            return state[FUNC_PERFORMANCE].list.reduce((arr, element) => {
                if (!element.on) {
                    arr.push(element.type)
                }
                return arr
            }, [])
        },
        isShowTape(state, getters, rootState, rootGetters) {
            return state.tapeState && (rootGetters.isAStock || rootGetters.isBStock)
        },
    },
    mutations: {
        [CHANGE_TAPE_SET](state, payLoad) {
            payLoad.forEach((element) => {
                let type = element.type
                let val = element.val
                state[type].activeType = val
            })
        },
        [CHANGE_TAPE_FUNC](state, payLoad) {
            payLoad.forEach((element) => {
                let type = element.type
                let one = state[FUNC_PERFORMANCE].list.find((el) => {
                    return el.type === type
                })
                if (one) {
                    one.on = element.on
                }
            })
        },
        // 改变盘口设置的显隐状态
        [CHANGE_TAPE_DISPLAY](state, payLoad) {
            state.tapeState = payLoad
        },
        [RESET_TAPE_FUNC](state) {
            state[FUNC_PERFORMANCE].list.forEach((element) => {
                element.on = true
            })
        },
        [RESET_TAPE_CONTENT](state) {
            for (let [key, value] of defaults.entries()) {
                state[key].activeType = value
            }
        },

    },
    actions: {
        [TAPE_RESET_STATE]({
            commit,
        }) {
            commit(RESET_TAPE_CONTENT)
            commit(RESET_TAPE_FUNC)
        },
    },
}
