import getters from './getters'
import mutations from './mutations'
import actions from './actions'

// 状态树
const state = {
    current_type: null,
    stock_code: null,
    source: null,
    full_code: null,
    leftState: true,  // 左侧栏展开收起状态
    rightState: true, // 右侧栏展开收起状态
    infoState: false, // 资讯栏状态
    leftActiveKey: null, // 左侧选中 tab
    // hsIndexCategory: null,
    klineJumpState: null,
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
    group_data: [], // 自选股分组数据
    select_group_data: [], // 选中自选股分组的股票列表
    recent_list_data: [],
}

export default {
    state,
    getters,
    mutations,
    actions,
}
