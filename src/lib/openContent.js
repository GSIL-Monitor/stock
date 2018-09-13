/* 点击文章 */
import callQt from '../src/components/utils/callQt';
var returnHost = function(){
    var host = location.hostname;
    var ggAddress;
    if(/localhost/.test(host)){
        ggAddress = 'http://ggweb-pre.gofund.cn:8093';
    }else if(/sandbox.gofund.cn/.test(host)){
        ggAddress = 'http://ggweb.sandbox.gofund.cn:8093';
    }else if(/pre.gofund.cn/.test(host)){
        ggAddress = 'http://ggweb-pre.gofund.cn:8093';
    }else{
        ggAddress = 'http://ggweb.go-goal.cn';
    }
    return ggAddress;
}
var openContentHost = function(){
    //朝阳智投下，点击标题，弹框域名
    var info_browser = navigator.userAgent;
    if(/zyzt/.test(info_browser)){
        return 'http://zyzt.66966.cn';
    }
    var host = location.hostname;
    var ggAddress;
    if(/localhost/.test(host)){
        ggAddress = 'http://ggweb-pre.gofund.cn:8093';
    }else if(/sandbox.gofund.cn/.test(host)){
        ggAddress = 'http://ggweb.sandbox.gofund.cn:8093';
    }else if(/pre.gofund.cn/.test(host)){
        ggAddress = 'http://ggweb-pre.gofund.cn:8093';
    }else{
        ggAddress = 'http://ggweb.go-goal.cn';
    }
    return ggAddress;
}
var openContentHost = function(){
    //朝阳智投下，点击标题，弹框域名
    var info_browser = navigator.userAgent;
    var host = location.hostname;
    if(/zyzt/.test(info_browser)){
        if(/pre.gofund.cn/.test(host)){
            return 'http://investpre.gofund.cn:8093';
        }else{
            return 'http://zyzt.66966.cn';
        }
    }

    var ggAddress;
    if(/localhost/.test(host)){
        ggAddress = 'http://ggweb-pre.gofund.cn:8093';
    }else if(/sandbox.gofund.cn/.test(host)){
        ggAddress = 'http://ggweb.sandbox.gofund.cn:8093';
    }else if(/pre.gofund.cn/.test(host)){
        ggAddress = 'http://ggweb-pre.gofund.cn:8093';
    }else{
        ggAddress = 'http://ggweb.go-goal.cn';
    }
    return ggAddress;
}
var protoWindow = function (param,type) {   //type 0->资讯，带列表,1->资讯，无列表,2->公告，带列表,3->资讯（未来大事件-自选股-带列表）,4->研报，默认0
    var token = (function () {
        var arr, reg = new RegExp("(^| )token=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return decodeURIComponent(arr[2]);
        } else {
            return null;
        }
    })();
    var width = document.documentElement.clientWidth,
        height = document.documentElement.clientHeight,
        width_ = (width - 100) < 1200 ? (width - 100) : 1000,//width_?width_:840;
        height_ = (height - 100) < 980 ? (height - 100) : 620,//height_?height_:570;
        window_w = (width - 100)<1200?(width - 100):1000,
        window_h = (height - 100)<980?(height - 100):620,
        marginTop = height/2 - window_h/2,
        marginLeft = width/2 - window_w/2;
    var ggAddress = openContentHost();
    if(!type){
        var paramObj = {
            dataType:'news',
            title:param.title,
            windowHeight:height,
            windowWidth:width,
            position:param.position+1,
            listApi:param.listApi,
            contentId:param.id,
            contentApi:param.contentApi,
            stock_code:param.stock_code,
            stock_name:param.stock_name,
            token:token,
            params:{
                rows:6,
                token:token,
                page:Math.ceil(param.position/6),
                key_word:param.key_word,
                news_type:param.news_type
            },
            path:'G3_08_10'
        };
        var fileUrl = JSON.stringify(paramObj);
        var pdAddress = ggAddress+'/html/window-openContent.html?openParams=' + fileUrl + '&token=' + token + '&winWidth=' + JSON.parse(fileUrl).windowWidth + '&winHeight=' + JSON.parse(fileUrl);
    }else if(type == 1){
        var fileUrl = JSON.stringify({
            winWidth:width,
            winHeight:height,
            source_type:4,
            id:param.id,
            api:param.contentApi
        });
        var pdAddress =  ggAddress+'/html/single_details.html?openParams='+fileUrl+'&token='+token+'&winWidth='+JSON.parse(fileUrl).windowWidth+'&winHeight='+JSON.parse(fileUrl).winHeight;
        //公告中心
    }else if(type == 2){
        var paramObj = {
            dataType:'announcement',
            noScroll:true,
            title:param.title,
            windowHeight:height,
            windowWidth:width,
            position:param.position+1,
            listApi:param.listApi,
            contentId:param.contentId,
            contentApi:param.contentApi,
            stock_code:param.stock_code,
            stock_name:param.stock_name,
            token:token,
            params:{
                rows:param.rows,
                token:token,
                page:param.page,
                id:param.id,
                type:param.type,
                key_word:param.key_word,
                class_name:param.class_name,
                class_code:param.class_code,
                start_date:param.start_date,
                end_date:param.end_date,
                stock_code:param.stock_code,
                order:param.order,
                order_type:param.order_type
            },
            path:'G3_08_10'
        };
        var fileUrl = JSON.stringify(paramObj);
        var pdAddress = ggAddress+'/html/window-openContent.html?openParams=' + fileUrl + '&token=' + token + '&winWidth=' + JSON.parse(fileUrl).windowWidth + '&winHeight=' + JSON.parse(fileUrl).windowHeight;
    }else if(type === 3){
        var paramObj = {
            title: param.title,
            dataType: 'events',
            path: 'G3_01_02_05',
            contentId: param.contentId,
            windowHeight: height,
            windowWidth: width,
            position: param.position + 1,
            listApi: param.listApi,
            params: {
                page: param.page,
                rows: param.rows,
                start_date: param.start_date,
                end_date: param.end_date,
                token: token
            }
        };
        var fileUrl = JSON.stringify(paramObj);
        var pdAddress = ggAddress+'/html/window-openContent.html?openParams=' + fileUrl + '&token=' + token + '&winWidth=' + JSON.parse(fileUrl).windowWidth + '&winHeight=' + JSON.parse(fileUrl).windowHeight;
    }else if(type == 4){
        // --- 用guid获取文章内容的
        var paramObj = {
            dataType:'research',
            contentId:param.guid,
            title:param.title,
            listApi:param.listApi,
            params:param.params,
            windowHeight:height,
            windowWidth:width,
            noScroll:true,//不滚动加载
            path:param.basecode,
            position:param.position
        };
        var fileUrl = JSON.stringify(paramObj);
        var pdAddress = ggAddress+'/html/window-openContent.html?openParams='+fileUrl+'&token='+token+'&winWidth='+JSON.parse(fileUrl).windowWidth+'&winHeight='+JSON.parse(fileUrl);
    }else if(type == 5){
        // --- 首页 - 搜索资讯结果页 - 新闻
        var paramObj = {
            dataType:'news',
            title:param.title,
            windowHeight:height,
            windowWidth:width,
            position:param.position+1,
            listApi:param.listApi,
            contentId:param.id,
            contentApi:param.contentApi,
            stock_code:param.stock_code,
            stock_name:param.stock_name,
            token:token,
            params:{
                rows:6,
                token:token,
                page:Math.ceil(param.position/6),
                expression:param.expression,
                news_type:param.news_type
            },
            path:'G3_08_10'
        };
        var fileUrl = JSON.stringify(paramObj);
        var pdAddress = ggAddress+'/html/window-openContent.html?openParams=' + fileUrl + '&token=' + token + '&winWidth=' + JSON.parse(fileUrl).windowWidth + '&winHeight=' + JSON.parse(fileUrl);
    }
    var newWinParams = {
        width: width_,
        height: height_,
        url: pdAddress,
        title: param.title,
        top: marginTop,
        left: marginLeft,
        newsList: true,
        resizeable: true,
        minimumVisible: true
    };
    try {
        callQt.openNewWin(newWinParams);
    } catch (error) {
        console.warn('window.top.webMsg.OpenPopWindow: ', error)
    }

}
var openFile = function(fileUrl, title,token,sourceType) {
    var info_browser = navigator.userAgent,
        type = '',
        source_type = '';
    if(/zyzt/.test(info_browser)){
        type = '&type=104';
    }else{
        type = '&type=3';
    }
    if(sourceType){
        source_type = '&sourceType=3';
    }
    var host = location.hostname;
    var ggAddress;
    if(/sandbox.gofund.cn/.test(host)){
        ggAddress = 'http://pdf.sandbox.go-goal.cn:8093';
    }else if(/pre.gofund.cn/.test(host)){
        ggAddress = 'http://pdf-pre.go-goal.cn:8093';
    }else{
        ggAddress = 'http://pdf.go-goal.cn';
    }
    if(fileUrl.indexOf('?')>=0){
        var pdAddress = ggAddress+'/pdfreader.html?pdfUrl=' + encodeURIComponent(fileUrl + '&Origin='+ggAddress) + '&title=' + encodeURIComponent(title) + '&token=' + encodeURIComponent(token)+type+source_type;
    }else{
        var pdAddress = ggAddress+'/pdfreader.html?pdfUrl=' + encodeURIComponent(fileUrl + '?Origin='+ggAddress) + '&title=' + encodeURIComponent(title) + '&token=' + encodeURIComponent(token)+type+source_type;
    }
    var width = document.documentElement.clientWidth, height = document.documentElement.clientHeight;
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
        callQt.openNewWin(newWinParams);
    } catch (error) {
        console.warn('window.top.webMsg.OpenPopWindow: ', error)
    }
}
export default {
    returnHost:returnHost,
    protoWindow:protoWindow,
    openFile:openFile
}
