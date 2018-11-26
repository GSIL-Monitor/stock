
export const MODULE_NAME = 'stockDetail'

/*--------------------------------------------------------------------------*/
/**
 * 自选缓存 Id
*/
export const MY_STOCK_CACHE = `operate-stock-tags`

/**
 * Local Storage
*/
// 盘口设置 -- 委托明细、默认盘口内容、样式
// export const LOCAL_TAPE_SET_DFT = `${MODULE_NAME}-tapeSet-default`
// // 盘口设置 -- 功能显隐
// export const LOCAL_TAPE_SET_FUNC = `${MODULE_NAME}-tapeSet-func`
// 左侧显隐
// export const LOCAL_IS_LEFT_SHOW = `${MODULE_NAME}-left-content-state`
// // 右侧显隐
// export const LOCAL_IS_RIGHT_SHOW = `${MODULE_NAME}-right-content-state`
// // 资讯栏显隐
// export const LOCAL_IS_INFO_FULL = `${MODULE_NAME}-info-content-state`
// 左侧 tab
// export const LOCAL_LEFT_TAB = `${MODULE_NAME}-left-tab`
// 股票代码
export const LOCAL_LATEST_CODE = `${MODULE_NAME}-stock-code`
// 行情图状态
// export const LOCAL_MAP_STATE = `${MODULE_NAME}-map-state`
// 成交明细过滤
export const LOCAL_TRANSATION_STORE = `${MODULE_NAME}-transation-store`
// 短信精灵设置
export const LOCAL_SHORT_LINE_SET = `${MODULE_NAME}-short-line-set`

/*--------------------------------------------------------------------------*/

/**
 * Session Storage
*/
// 选中的自选股
export const SESSION_SELECT_STOCK_GROUP = `${MODULE_NAME}-select-group`
// A 股 成交明细过滤
// export const SESSION_TRANSCATION_FILTER = `${MODULE_NAME}-transcation-filter`
// A 股 右下最近选择的tab
// export const SESSION_ASTOCK_FUNC_TAB = `${MODULE_NAME}-astock-funcTab`
// 指数 右下最近选择的tab
export const SESSION_INDEX_FUNC_TAB = `${MODULE_NAME}-index-funcTab`

/*--------------------------------------------------------------------------*/

/**
 * GoGoal Event Name
*/
export const EVENT_CHANGES_CODE = `changeScode`
export const EVENT_KEY_BOARD = `keyBoardEvent`
export const EVENT_CHANGE_STOCK = `changeMystock`
export const EVENT_TRANSATION_CHANGE = `transcation-change`
export const EVENT_CHANGE_LEFT_RIGHT = `${MODULE_NAME}-leftRight`

/*--------------------------------------------------------------------------*/

/**
 * Frame SubScription Id
*/
// 分价表
export const FRAME_PRICE_POINT = `${MODULE_NAME}-time-price`
// 自选股分组
export const FRAME_MY_STOCK = `${MODULE_NAME}-list`
// 最近访问
export const FRAME_RECENT_LIST = `${MODULE_NAME}-recentList`
// 自选股分组缓存
export const FRAME_MYSTOCK_GROUP = `${MODULE_NAME}-get-mystock-group`
// 自选股单一分组详情
export const FRAME_MYSTOCK_LIST = `${MODULE_NAME}-get-mystock-list`
// 自选股变色
export const FRAME_STOCK_COLOR = `${MODULE_NAME}-check-mystocks`
// 沪深指数 -- 成分股
export const FRAME_CONSTITUENT_STOCK = `${MODULE_NAME}-onePlate-stocks`
// 沪深指数 -- 其他指数
export const FRAME_OTHER_INDEXS = `${MODULE_NAME}-index-list`
// A股 -- 同业股票
export const FRAME_TRADE_STOCK = `${MODULE_NAME}-trade-stock`
// 关联品种
export const FRAME_RELATED_STOCK = `${MODULE_NAME}-related-stock`

// A 股行情
export const FRAME_A_MARKET = `${MODULE_NAME}-a-market`
// 沪深指数
export const FRAME_HS_INDEX = `${MODULE_NAME}-hs-index`
// B 股行情
export const FRAME_B_MARKET = `${MODULE_NAME}-b-market`
// 基金行情
export const FRAME_FUND_MARKET = `${MODULE_NAME}-fund-market`
// 债券行情
export const FRAME_BOND_MARKET = `${MODULE_NAME}-bond-market`
// 港股行情
export const FRAME_HK_STOCK = `${MODULE_NAME}-hk-stock`
// 港股指数
export const FRAME_HK_INDEX = `${MODULE_NAME}-hk-index`

// 资金流向
export const FRAME_FUND_FLOW = `${MODULE_NAME}-fund-flow`
// 短线精灵
export const FRAME_SHORT_LINE = `${MODULE_NAME}-short-line`
// 涨跌分布
export const FRAME_CHANGE_DISTRIBUTION = `${MODULE_NAME}-change-distribution`

/*--------------------------------------------------------------------------*/

/**
 * Tabs Key
*/
// 推荐标签
export const TAB_RECOMMEND_TAGS = 'tab-tags'
// 自选股
export const TAB_MY_STOCK = 'tab-stock'
// 最近访问
export const TAB_RECENT_VISITED = 'tab-recent'
