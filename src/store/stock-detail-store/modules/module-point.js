/**
 * @file 分价表
*/
import {
    SWITCH_PRICE_POINT,
} from '../config/mutation-types.js'

export default {
    state() {
        return {
            isSimple: true, // 默认简化模式
        }
    },
    mutations: {
        [SWITCH_PRICE_POINT](state) {
            state.isSimple = !state.isSimple
        },
    },
}
