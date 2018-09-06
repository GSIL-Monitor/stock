import {
    get,
    post,
} from './XHR'
import {
    getToken,
} from '@c/utils/util'

/**
 * @description 网页登录
*/
export const loginIn = param => {
    let APIName = 'v1/user/login'
    return get(APIName, param)
}

/**
 * @description 个股 -- 获取推荐标签
*/
export const getStocktag = param => {
    let APIName = 'v1/zt/get_stock_tags'
    return get(APIName, param)
}

/**
 * @description 个股 -- 获取自选股分组
*/
export const getMyStockGroup = param => {
    let APIName = 'v1/mystock/get_group'
    return get(APIName, param)
}

/**
 * @description 个股 -- 获取自选股分组详情
*/
export const getMyStocks = param => {
    let APIName = 'v1/mystock/mystock_list'
    return get(APIName, param)
}

/**
 * @description 个股 -- 关联品种折溢价
*/
export const getDiscountPremium = param => {
    let APIName = 'v1/zt/get_stock_discount'
    return get(APIName, param)
}

/**
 * @description 个股 -- 个股标识
*/
export const getStockIdentity = param => {
    let APIName = 'v1/zt/get_stock_buoy'
    return get(APIName, param)
}

/**
 * @description 个股 -- 获取 A股/B股 行情数据
*/
export const getLimitStockData = param => {
    let APIName = 'v1/stock/data'
    return get(APIName, param)
}

/**
 * @description 个股 -- 获取指数行情数据
*/
export const getIndexData = param => {
    let APIName = 'v1/hq/details'
    return get(APIName, param)
}

/**
 * @description 个股 -- 获取基金行情数据
*/
export const getFundData = param => {
    let APIName = 'v1/hq/fund_data'
    return get(APIName, param)
}

/**
 * @description 个股 -- 获取债券行情数据
*/
export const getBondData = param => {
    let APIName = 'v1/hq/bond_data'
    return get(APIName, param)
}

/**
 * @description 个股 -- 获取 港股股票/指数/基金/债券/涡轮/牛熊证 行情数据
*/
export const getHKStockData = param => {
    let APIName = 'v1/hq/hk_data'
    return get(APIName, param)
}

/**
 * @description 个股 -- 一致预期数据
*/
export const getSelfConsensus = param => {
    let APIName = 'v1/zt/get_dm_con_sensus'
    return get(APIName, param)
}

/**
 * @description 个股 -- 添加到最近访问
*/
export const addMyRecent = param => {
    let APIName = 'v1/mystock/add_recent'
    return post(APIName, param)
}

/**
 * @description 个股 -- 判断股票是否在我的自选股分组
*/
export const getMyStockIsAdd = param => {
    let APIName = 'v1/mystock/get_isdefined'
    return get(APIName, param)
}

/**
 * @description 个股 -- 获取股票所属板块
*/
export const getIndustryBelongPlate = param => {
    let APIName = 'v1/hq/get_stock_plate_component'
    return get(APIName, param)
}

/**
 * @description 个股 -- 获取公司荣誉信息
*/
export const getCompanyHonor = param => {
    let APIName = 'v1/stock/get_tag_v2'
    return get(APIName, param)
}

/**
 * @description 个股 -- 获取最近访问列表
*/
export const getStockRecent = (param = {}) => {
    let APIName = 'v1/user/get_visit_recent'
    return get(APIName, param)
}

/**
 * @description 个股 -- A股新闻
*/
export const getStockNews = param => {
    let APIName = 'v1/news/get_newmystock_info'
    return get(APIName, param)
}

/**
 * @description 个股 -- A股公告
*/
export const getNoticeList = (param = {}) => {
    let APIName = 'v1/announcement/get_stock_new_announcement_list'
    Reflect.set(param, 'token', getToken())
    return get(APIName, param)
}

/**
 * @description 个股 -- A股研报
*/
export const getResearchReport = (param = {}) => {
    let APIName = 'v1/report/search'
    Reflect.set(param, 'token', getToken())
    return get(APIName, param)
}

/**
 * @description 个股 -- A股投资问答
*/
export const getInvestmentQAData = param => {
    let APIName = 'v1/news/get_investment_qa'
    return get(APIName, param)
}

/**
 * @description 个股 -- A股大事件
*/
export const getEventList = param => {
    let APIName = 'v1/stock/get_announcement_notice'
    return get(APIName, param)
}

/**
 * @description 个股 -- A股同业股票
*/
export const getSameIndustryStock = param => {
    let APIName = 'v1/stock/get_same_industry_stock_data'
    return get(APIName, param)
}

/**
 * @description 个股 -- A股关联品种
*/
export const getRelatedStock = param => {
    let APIName = 'v1/stock/get_associated_varieties'
    return get(APIName, param)
}

/**
 * @description 个股 -- 获取 A股/B股/基金/债券 成交明细
*/
export const getTransaction = param => {
    let APIName = 'v1/hq/get_transaction'
    return get(APIName, param)
}

/**
 * @description 个股 -- 获取 港股股票/指数/基金/债券/涡轮/牛熊证 成交明细
*/
export const getHKTransaction = param => {
    let APIName = 'v1/hq/get_transaction_hk'
    return get(APIName, param)
}

/**
 * @description 个股 -- A股 / 沪深指数 短线精灵获取历史数据
*/
export const getShortLine = param => {
    let APIName = 'v1/hq/get_stock_history_dynamic'
    return get(APIName, param)
}

/**
 * @description 个股 -- A股简易财务
*/
export const getStockFinance = param => {
    let APIName = 'v1/stock/get_hq_header_list'
    return get(APIName, param)
}

/**
 * @description 个股 -- 沪深指数 -- 成分股
*/
export const getIndexStocks = param => {
    let APIName = 'v1/hq/list'
    return get(APIName, param)
}

/**
 * @description 个股 -- 沪深指数 -- 其他指数
*/
export const getOtherIndicators = param => {
    let APIName = 'v1/hq/fullcodes'
    return get(APIName, param)
}

/**
 * @description 个股 -- 沪深指数新闻
*/
export const getHSIndexNews = param => {
    let APIName = 'v1/news/get_ask_news_info'
    return get(APIName, param)
}

/**
 * @description 个股 -- 沪深指数公告
*/
export const getIndexNotice = (param = {}) => {
    let APIName = 'v1/announcement/search_new_announcement'
    Reflect.set(param, 'token', getToken())
    return get(APIName, param)
}

/**
 * @description 个股 -- 港股股票新闻
*/
export const getHKStockNews = (param = {}) => {
    let APIName = 'v1/news/get_hk_newmystock_info'
    Reflect.set(param, 'token', getToken())
    return get(APIName, param)
}

/**
 * @description 个股 -- 港股股票同业股票
*/
export const getHKSameIndustryStock = param => {
    let APIName = 'v1/stock/get_hk_same_industry_stock_data'
    return get(APIName, param)
}

/**
 * @description 个股 -- 港股股票关联品种
*/
export const getHKRelatedStock = param => {
    let APIName = 'v1/stock/get_associated_varieties'
    return get(APIName, param)
}

/**
 * @description 个股 -- 判断传入日期是否是交易日
*/
export const isDealDay = param => {
    let APIName = 'v1/hq/is_edate'
    return get(APIName, param)
}
