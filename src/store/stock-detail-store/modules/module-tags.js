import {
    getStocktag,
} from '@service/index.js'
import {
    GET_STOCK_TAG,
} from '../config/mutation-types.js'
import {
    GET_STOCK_TAG_DATA,
} from '../config/action-types.js'

export default {
    state() {
        return {
            tag_data: {
                zyyx_score: null, // 确定性评分
                tags: null, //公司荣誉
                future_achievement_appraise: null, // 业绩预判
                history_achievement_appraise: null, // 业绩鉴定
                hold_change: null, // 机构持仓
                business_status_new: null, //行业地位
                industry_appraise: null, // 行业业绩
                financing_securities_loan: null, // 融资融券
                hold_percent: null, // 互联互通
                success_rate: null, // 季度胜率
                industry_future: null, // 行业预判
                industry_periodicity: null, // 行业周期
                periodicity: null, //个股风格
                over_rate: null, // 超额收益
            },
        }
    },
    mutations: {
        [GET_STOCK_TAG](state, payLoad) {
            state.tag_data = Object.assign({}, payLoad)
        },
    },
    actions: {
        [GET_STOCK_TAG_DATA](context, param) {
            getStocktag(param)
        },
    }
}
