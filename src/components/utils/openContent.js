import {
    openNewWin
} from './callQt';
import {
    getUrlDomain,
    getToken,
} from './util'

let zyzt = false;
const { userAgent } = navigator;
if(userAgent.includes('zyzt') || userAgent.includes('zytg')){
    zyzt = true;
}

var getPdfAddress = () => {
    var host = location.hostname;
    if(host.includes('localhost')){
        return 'http://pdf-pre.go-goal.cn:8093';
    }else if(host.includes('sandbox')){
        return 'http://pdf.sandbox.go-goal.cn:8093';
    }else if(host.includes('gofund')){
        return 'http://pdf-pre.go-goal.cn:8093';
    }else{
        return 'http://pdf.go-goal.cn';
    }
}

//  GO-GOAL报表研报股票专家详情
export const expertDetail = (row) => {
    let ggAddress = getUrlDomain();
    const WIDTH = document.documentElement.clientWidth;
    const HEIGHT = document.documentElement.clientHeight;
    var idealHeight = row.is_stock_expert ? 900 : 700;
    var window_w = 820;
    var window_h = Math.min(HEIGHT,idealHeight);
    var marginTop = (HEIGHT)/2 - window_h/2;
    var marginLeft = (WIDTH)/2 - window_w/2;
    const token = (function () {
        var arr, reg = new RegExp("(^| )token=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return decodeURIComponent(arr[2]);
        } else {
            return null;
        }
    })();
    if(location.hostname == 'localhost'){
        ggAddress = 'http://ggweb.sandbox.gofund.cn:8093';
    }
    var pageAddress = ggAddress+'/html/expertDetail.html?author_id='+row.author_id+'&expert='+row.is_stock_expert+'&stock='+row.stock_code+'&token='+token+'&winWidth='+window_w+'&winHeight='+window_h+'&qtFrame=1';
    var newWinParams = {
        width: window_w,
        height: window_h,
        minWidth: window_w,
        minHeight: window_h,
        url:pageAddress,
        title:'股票专家—'+row.author_name,
        top:parseInt(marginTop) + 40,
        left:marginLeft,
        resizeable:false
    };
    openNewWin(newWinParams);
}
//  3.0 和 投顾弹框头部颜色不一致
export const returnScoreHost = () => {
    var host = location.hostname;
    if(zyzt){
        if(host.includes('localhost')){
            return 'http://investpre.gofund.cn:8093';
        }else if(host.includes('sandbox')){
            return 'http://investtest.gofund.cn:8093';
        }else if(host.includes('gofund')){
            return 'http://investpre.gofund.cn:8093';
        }else{
            return 'http://zyzt.66966.cn';
        }
    }else{
        if(host.includes('localhost')){
            return 'http://ggweb-pre.gofund.cn:8093';
        }else if(host.includes('sandbox')){
            return 'http://ggweb.sandbox.gofund.cn:8093';
        }else if(host.includes('gofund')){
            return 'http://ggweb-pre.gofund.cn:8093';
        }else{
            return 'http://ggweb.go-goal.cn';
        }
    }
}

export const openScore = (row) => {
    var params = {
        stock_code: row.stock_code,
        stock_name: row.stock_name,
        full_code: row.full_code,
        field: 'sunScore'
    }
    const ggAddress = returnScoreHost();
    const WIDTH = document.documentElement.clientWidth;
    const HEIGHT = document.documentElement.clientHeight;
    var window_w = (WIDTH - 100)<1200?(WIDTH - 100):1000;
    var window_h = (HEIGHT - 100)<980?(HEIGHT - 100):620;
    var width_ = 820;//width_?width_:840;
    var height_ = 620;//height_?height_:570;
    var marginTop = (HEIGHT)/2 - window_h/2;
    var marginLeft = (WIDTH)/2 - window_w/2;
    const token = getToken();
    var pageAddress = ggAddress + '/html/mystockPopup.html?openParams='+JSON.stringify(params)+'&token='+token+'&winWidth='+width_+'&winHeight='+height_+'&qtFrame=1';
    var newWinParams = {
        width: width_,
        height:height_,
        url:pageAddress,
        top:marginTop,
        left:marginLeft,
        resizeable:false
    };
    // if(oldVersion){
    //     openSubWin(newWinParams);
    // }else{
        openNewWin(newWinParams);
    // }
}

//  pdf原文
export const openFile = function(fileUrl, title,token,sourceType) {
    let type = '',
        source_type = '',
        pdAddress = '';
    if(zyzt){
        type = '&type=104';
    }else{
        type = '&type=3';
    }
    if(sourceType){
        source_type = '&sourceType=3';
    }
    token = token || getToken();
    const ggAddress = getPdfAddress();
    if(fileUrl.indexOf('?')>=0){
        pdAddress = ggAddress+'/pdfreader.html?pdfUrl=' + encodeURIComponent(fileUrl + '&Origin='+ggAddress) + '&title=' + encodeURIComponent(title) + '&token=' + encodeURIComponent(token)+type+source_type;
    }else{
        pdAddress = ggAddress+'/pdfreader.html?pdfUrl=' + encodeURIComponent(fileUrl + '?Origin='+ggAddress) + '&title=' + encodeURIComponent(title) + '&token=' + encodeURIComponent(token)+type+source_type;
    }
    let width = document.documentElement.clientWidth, height = document.documentElement.clientHeight;
     /*var content = '<iframe width='+ pwinWidth +' height='+ pwinHeight +' src="'+ pdAddress + '">';
     var options = {
     // drageable:true,
     title:title,
     content:content,
     width:pwinWidth,
     height:'100%',
     offsetTop:0,
     offsetLeft:0
     }
     $.popUp(options)*/
    var newWinParams = {
        drageable:false,
        width:width-12,
        height:height,
        url:pdAddress,
        title:title,
        pdfReader:true,
        top:40,
        left:0,
        resizeable:true,
        minimumVisible:true         //最小化
    };
    try {
        openNewWin(newWinParams);
    } catch (error) {
        console.warn('window.top.webMsg.OpenPopWindow: ', error)
    }
}

//  购买G分链接
export const buyPointsUrl = function(){
    var host = location.hostname;
    if(host.includes('localhost')){
        return 'http://paypre.go-goal.cn';
    }else if(host.includes('sandbox')){
        return 'http://paytest.go-goal.cn';
    }else if(host.includes('gofund')){
        return 'http://paypre.go-goal.cn';
    }else{
        return 'http://pay.go-goal.cn';
    }
}

//  业绩线索 寻宝线索弹框
export const openTreasure = (paramObj)=>{
    const { clientHeight, clientWidth } = document.documentElement;
    var window_w = (clientWidth - 100)<1200?(clientWidth - 100):1000;
    var window_h = (clientHeight - 100)<980?(clientHeight - 100):620;
    var width_ = (clientWidth - 100)<1200?(clientWidth - 100):1000;//width_?width_:840;
    var height_ = (clientHeight - 100)<980?(clientHeight - 100):620;//height_?height_:570;
    var marginTop = (clientHeight)/2 - window_h/2;
    var marginLeft = (clientWidth)/2 - window_w/2;
    var pageAddress = getUrlDomain()+'/html/treasurePopup.html?openParams='+JSON.stringify(paramObj)+'&token='+getToken()+'&clickObj='+ paramObj.clickObj +'&showBox='+ paramObj.showObj +'&winWidth='+clientWidth+'&winHeight='+clientHeight;
    const newWinParams = {
        width: width_,
        height:height_,
        url:pageAddress,
        title:paramObj.popupTitle?paramObj.popupTitle:'寻宝书签',
        top:marginTop,
        left:marginLeft,
        newsList:true,
        resizeable:true,
        minimumVisible:true         //最小化
    };
    openNewWin(newWinParams);
}
