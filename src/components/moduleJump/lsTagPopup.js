// --- 上市公司标签弹窗
import {
    openNewWin,
} from '@c/utils/callQt.js'
import {
    getUrlDomain,
} from '@c/utils/util.js'


const popupConfig = {
    helpPopup: {
        title: '自选股标签分类及说明',
        field: 'helpPopup',
        width: 640,
        height: 550
    },

    sunScore: {
        title: '',
        field: 'sunScore',
        width: 820,
        height: 600
    },
    selfScore: {
        title: '个股信任度评分系统',
        field: 'selfScore',
        width: 600,
        height: 550
    },
    achievementSeasonal: {
        title: '单季度营业收入占比',
        field: 'achievementSeasonal',
        width: 600,
        height: 300
    },
    ahPremium: {
        title: 'AH股折溢价',
        field: 'ahPremium',
        width: 600,
        height: 300
    },
    belongPlate: {
        title: '所属板块',
        field: 'belongPlate',
        width: 330,
        height: 401
    },
    businessStatus: {
        // --- 行业地位
        title: '',
        field: 'businessStatus',
        width: 464,
        height: 270
    },
    companyHonor: {
        // --- 公司荣誉
        title: '',
        field: 'companyHonor',
        width: 374,
        height: 295
    },
    companyStyle: {
        title: '个股风格',
        field: 'companyStyle',
        width: 602,
        height: 560
    },
    connectivityHoldCount: {
        title: '互联互通持仓量',
        field: 'connectivityHoldCount',
        width: 768,
        height: 600
    },
    connectivity: {
        title: '互联互通',
        field: 'connectivity',
        width: 346,
        height: 160
    },

    connectivityChange_hold: {
        title: '互联互通持仓量变化',
        field: 'connectivityChange_hold',
        width: 600,
        height: 440
    },
    connectivityChange_percent: {
        title: '互联互通持仓比率变化',
        field: 'connectivityChange_percent',
        width: 600,
        height: 440
    },
    connectivityHold_percent: {
        title: '互联互通持仓占比',
        field: 'connectivityHold_percent',
        width: 602,
        height: 327
    },
    divergence: {
        title: '分歧度',
        field: 'divergence',
        width: 420,
        height: 300
    },
    event_big: {
        title: '大事件提醒',
        field: 'event_big',
        width: 420,
        height: 300
    },
    event_financialReport: {
        title: '财报发布日提醒',
        field: 'event_financialReport',
        width: 420,
        height: 300
    },
    financingLinePopup_1: {
        title: '融资强度',
        field: 'financingLinePopup_1',
        width: 600,
        height: 310
    },
    financingLinePopup_2: {
        title: '融券余额',
        field: 'financingLinePopup_2',
        width: 600,
        height: 310
    },
    goodTarget:{
        title: '好标的',
        field: 'goodTarget',
        width: 346,
        height: 427
    },
    industryPrev: {
        // --- 行业业绩鉴定 - 上一季
        title: '',
        field: 'industryPrev',
        width: 422,
        height: 168
    },
    industryCur: {
        // --- 行业业绩鉴定 - 最新季
        title: '',
        field: 'industryCur',
        width: 422,
        height: 168
    },
    industryNext: {
        title: '行业业绩预判未来',
        field: 'industryNext',
        width: 602,
        height: 326
    },
    industryPeriodicity: {
        // --- 行业周期性
        title: '',
        field: 'industryPeriodicity',
        width: 722,
        height: 580
    },
    industryPeriodicity_new: {
        // --- 行业周期性
        title: '',
        field: 'industryPeriodicity_new',
        width: 722,
        height: 500
    },
    marginBalance:{
        title: '融资融券',
        field: 'marginBalance',
        width: 602,
        height: 488
    },
    organOpenInterest: {
        title: '主流机构持仓',
        field: 'organOpenInterest',
        width: 754,
        height: 460
    },
    overRate: {
        title: '超额收益率',
        field: 'overRate',
        width: 346,
        height: 117
    },
    peg: {
        title: 'PEG',
        field: 'peg',
        width: 600,
        height: 330
    },
    performance: {
        title: '公司业绩鉴定',
        field: 'performance',
        width: 422,
        height: 168,
    },
    performancePrev: {
        title: '公司业绩鉴定 - 上一季',
        field: 'performancePrev',
        width: 422,
        height: 168,
    },
    performanceCur: {
        title: '公司业绩鉴定 - 最新季',
        field: 'performanceCur',
        width: 422,
        height: 168,
    },
    performanceNext: {
        title: '公司业绩预判未来',
        field: 'performanceNext',
        width: 722,
        height: 420,
    },
    retainedProfits: {
        title: '预期利润',
        field: 'retainedProfits',
        width: 600,
        height: 410
    },
    seasonSuccessRate_cur: {
        // --- 季度胜率（跑赢大盘） - 当季
        title: '',
        field: 'seasonSuccessRate_cur',
        width: 346,
        height: 120
    },
    seasonSuccessRate_next: {
        // --- 季度胜率（跑赢大盘） - 下季
        title: '',
        field: 'seasonSuccessRate_next',
        width: 346,
        height: 120
    },
    swSecondName: {
        // --- 所属行业
        title: '',
        field: 'swSecondName',
        width: 482,
        height: 210
    },
    textOneMinute_business: {
        title: '诊股 - 文字一分钟 - 商业模式',
        field: 'textOneMinute_business',
        width: 600,
        height: 410
    },
    textOneMinute_grow: {
        title: '诊股 - 文字一分钟 - 成长空间',
        field: 'textOneMinute_grow',
        width: 600,
        height: 410
    },
    textOneMinute_risk: {
        title: '诊股 - 文字一分钟 - 风险提示',
        field: 'textOneMinute_risk',
        width: 600,
        height: 410
    },

}

const lsTagPopup = (row, flag, y0) => {
    const token = (function () {
        var arr, reg = new RegExp("(^| )token=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return decodeURIComponent(arr[2]);
        } else {
            return null;
        }
    })();
    var options = popupConfig[flag]
    var width = options.width || 1000;
    var height = options.height || 600;

    row.field = options.field

    if (y0) {
        row.y0 = y0
    }
    var title = options.title;
    if (row.stock_name && options.title) {
        title += '（' + row.stock_name + '）';
    }
    var offsetTop = Math.ceil(Math.max(window.innerHeight / 2 - height / 2, 100)),
        offsetLeft = Math.ceil(window.innerWidth / 2 - width / 2);

    var pdAddress = `${getUrlDomain()}/html/mystockPopup.html?openParams=${JSON.stringify(row)}&token=${token}&winWidth=${width}&winHeight=${height}`
    var newWinParams = {
        width: width,
        height: height,
        minWidth: width,
        minHeight: height,
        url: pdAddress,
        title: title,
        top: offsetTop || 100,
        left: offsetLeft || 100,
        resizeable: false
    };
    if (options.field == 'selfScore') {
        newWinParams.closeByWeb = true
    }

    openNewWin(newWinParams)
}

export default lsTagPopup
