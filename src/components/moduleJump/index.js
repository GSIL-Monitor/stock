// 终端各种模块跳转方法集合
import {
    sendEvent,
    openNewWin,
} from '@c/utils/callQt.js'
import {
    getUrlDomain,
} from '@c/utils/util.js'

import lsTagPopup from './lsTagPopup.js'

export default function(module, params) {
    switch (module) {
        // 跳转到个股详情页
        case 'stockDetails':
            const param = JSON.stringify({
                stock_code: params.stock_code,
            })
            // qtobj.appendTab('stockDetail', param, '')
            sendEvent('stockDetail', 'changeScode', param, true)
            break
        // 打开所属行业弹窗
        case 'industryAlert':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    stock_name: params.stock_name,
                },
                'swSecondName'
            )
            break
        // 打开指定股票的确定性评分弹框
        case 'stockTotalScore':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    field: 'sunScore',
                    frequency: params.frequency,
                },
                'sunScore'
            )
            break
        // 打开指定股票的公司荣誉弹框
        case 'stockTag':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    stock_name: params.stock_name,
                },
                'companyHonor'
            )
            break
        // 打开指定股票的超额收益率弹框
        case 'stockOverRate':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    stock_name: params.stock_name,
                },
                'overRate'
            )
            break
        // 打开指定股票的敏感性分值变化弹框
        case 'stockMgxChange':
            openNewWin({
                width: 550,
                height: 410,
                title: '分值变化情况（含权重+）',
                url: `${location.origin}/topRank.html#/mgxChangeDialog/${
                    params.stock_code
                }/${params.frequency}`,
                resizeable: false,
            })
            break
        // 打开指定股票的公司业绩鉴定弹框
        case 'stockGSYJJD_prev':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    stock_name: params.stock_name,
                },
                'performancePrev'
            )
            break
        case 'stockGSYJJD_cur':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    stock_name: params.stock_name,
                },
                'performanceCur'
            )
            break
        // 打开指定股票的公司业绩预判未来弹框
        case 'stockGSYJYPWL':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    stock_name: params.stock_name,
                },
                'performanceNext'
            )
            break
        // 打开指定股票的行业地位
        case 'stockHYDW':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    stock_name: params.stock_name,
                },
                'businessStatus'
            )
            break
        // 打开指定股票的个股风格弹框
        case 'stockGGFG':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    stock_name: params.stock_name,
                },
                'companyStyle'
            )
            break
        // 打开指定股票的大事件提示弹框
        case 'stockDSJTS':
            break
        // 打开指定股票的互联互通弹框
        case 'stockHLHT':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    stock_name: params.stock_name,
                },
                'connectivity'
            )
            break
        // 打开指定股票的行业业绩鉴定弹框
        case 'stockHYYJJD_prev':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    stock_name: params.stock_name,
                },
                'industryPrev'
            )
            break
        case 'stockHYYJJD_cur':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    stock_name: params.stock_name,
                },
                'industryCur'
            )
            break
        // 打开指定股票的行业周期性(行业风格)弹框
        case 'stockHYZQX':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    stock_name: params.stock_name,
                },
                'industryPeriodicity'
            )
            break
        // 打开指定股票的季度胜率弹框
        case 'stockJDSL_cur':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    stock_name: params.stock_name,
                },
                'seasonSuccessRate_cur'
            )
            break
        case 'stockJDSL_next':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    stock_name: params.stock_name,
                },
                'seasonSuccessRate_next'
            )
            break
        // 打开指定股票的主流机构持仓弹框
        case 'stockZLJGCC':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    stock_name: params.stock_name,
                },
                'organOpenInterest'
            )
            break
        // 打开 添加股票到我的自选股 弹框
        case 'addMystock':
            openNewWin({
                width: 400,
                height: 300,
                title: '添加到我的自选股',
                url: `${getUrlDomain()}/html/addStock.html?codes=${params.codes}`,
                resizeable: false,
            })
            break
        case 'stockHTHTCCZB':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    stock_name: params.stock_name,
                },
                'connectivityHold_percent'
            )
            break;
        case 'stockHYYJYP':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    stock_name: params.stock_name,
                    sw_third_name: params.sw_third_name
                },
                'industryNext'
            )
            break;
        case 'stockRZRQ':
            lsTagPopup(
                {
                    stock_code: params.stock_code,
                    stock_name: params.stock_name,
                },
                'marginBalance'
            )
            break;
        default:
            break
    }
}
