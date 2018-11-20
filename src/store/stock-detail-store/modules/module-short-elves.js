/**
 * @file 短线精灵
*/
import {
    SWITCH_ELVES_WATCH_ONLY,
} from '../config/mutation-types.js'

export default {
    state() {
        return {
            isStockOnly: false,
        }
    },
    mutations: {
        [SWITCH_ELVES_WATCH_ONLY](state) {
            state.isStockOnly = !state.isStockOnly
        },
    },
}
