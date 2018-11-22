import {
    TAB_MY_STOCK,
} from '@pages/stock-detail/storage.js'

export default {
    current_type: null, // 当前类型
    stock_code: null,
    source: null,
    full_code: null,
    stock_name: null,
    leftState: true,  // 左侧栏，默认展开
    rightState: true, // 右侧栏，默认展开
    infoState: false, // 资讯栏，默认收起
    leftActiveKey: TAB_MY_STOCK, // 左侧选中 tab，默认自选股
    hsIndexCategory: null,
    isJumpFromTradeStock: false, // 是否从同业股票跳转过来
    isJumpFromRecentList: false, // 是否从最近访问跳转
}
