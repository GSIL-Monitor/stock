<!-- 研报原文权限 -->
<template>
    <div id="report-auth">
        <pop-up v-if="noticePop" :options="popOptions1" class="gpoints-notice" @close="closeGpoints">
            <div class="gpoints-page" style="position:relative">
                <div class="gpoints-top clearfix">
                    <span class="gpoints-title" >您没有权限原文阅读该研报原文，且G分不足，无法兑换！您可以购买G分兑换。</span><br>
                    <div class="gpoints-zfb" >支付方式：支付宝 </div>
                </div>
                <div  class="gpoints-bottom">
                    <div class="gpoints-select">选择购买方案：</div>
                    <div class="gpoints-container">
                        <span class="gpoints-choice" :class="{active:selectedChoice==1}" @click="toggleChoice(1)">
                            <span class="gpoints-amount">1000G分</span><br>
                            <span class="gpoints-cost">¥1000人民币</span>
                        </span>
                        <span class="gpoints-choice" :class="{active:selectedChoice==2}" @click="toggleChoice(2)">
                            <span class="gpoints-amount">2000G分</span><br>
                            <span class="gpoints-cost">¥2000人民币</span>
                        </span>
                    </div>
                    <span class="gpoints-btn">
                        <search-btn class="gpoints-pay" font="14" width="200" height="34" @click="confirmPay">立即支付</search-btn>
                    </span>
                    <div class="gpoints-alert">确认购买G分即代表您同意
                        <a @click="rulesPop=true" class="gpoints-rules">《G分购买及使用规则》</a>
                    </div>
                </div>
            </div>
            <pop-up v-if="rulesPop && noticePop" class="gpoints-rules-popup" :options="popOptions3" @close="rulesPop=false">
                <div class="gpoints-rules_container">
                    <div class="gpoints-rules_main">
                        <div class="gpoints-rules_title">1.G分的用途：</div><div class="gpoints-rules_content"><div class="gpoints-rules_row">1) G分可以直接用来阅读或下载本终端中的研报</div><div class="gpoints-rules_row">2) 当需要消耗G分时，系统会有明显的弹框提示是否需要消耗G分</div></div>
                        <div class="gpoints-rules_title">2.G分的获取：</div><div class="gpoints-rules_content"><div class="gpoints-rules_row">用户可以通过充值获取G分，兑换比率为1元（RMB）=1G分</div></div>
                        <div class="gpoints-rules_title">3.G分的减少：</div><div class="gpoints-rules_content"><div class="gpoints-rules_row">用户阅读或下载研报时，点击确定使用G分后系统会扣除20G分</div></div>
                        <div class="gpoints-rules_title">4.G分的退现：</div><div class="gpoints-rules_content"><div class="gpoints-rules_row">一般情况下，G分不支持退现</div></div>
                        <div class="gpoints-rules_title">5.本办法解释权归朝阳永续所有</div>
                    </div>
                </div>
            </pop-up>
        </pop-up>
        <pop-up v-if="confirmPop" :options="popOptions2" class="confirmPay" @close="closeConfirm" @confirm="exchangeGpoints">
            <div class="exchangeReport">您没有该研报原文阅读权限，阅读该研报原文需要20G分兑换，<br>您当前G分足够，请确认是否兑换</div>
        </pop-up>
        <pop-up v-if="alert" class="alert-popup" :options="alertPop"  @close="closeAlert" @confirm="closeAlert">
            <div class="alert-text" v-html="alertText"></div>
        </pop-up>
    </div>
</template>
<script>
    import popUp from '@c/popUp.vue';
    import searchBtn from '@c/button.vue';

    import zyztNoPermissionPop from './utils/permission/zyztNoPermission'
    import {
        getCookie,
        getToken,
        getUrlDomain,
    } from './utils/util'
    import {
        getNoticeUrl,
        getReportAuth,
        exchangeReport,
        userOperation,
        contactServer,
    } from '@service/'
    import {
        openNewWin,
        downloadFile,
        JsToQtEventInterface,
    } from './utils/callQt'
    import {
        openFile,
        buyPointsUrl,
    } from './utils/openContent'

    export default{
        components:{
            popUp,
            searchBtn
        },
        props:{
            report:{
                type:Object,
                default(){
                    return null
                }
            }
        },
        data(){
            return {
                reportData:null,
                noticePop:false,
                confirmPop:false,
                rulesPop:false,
                alert:false,
                helpNotice:false,
                alertText:null,
                selectedChoice:1,
                fee:1000,
                userType:null,
                openFile:null,
                popOptions1:{
                    title:'Go-Goal提示',
                    width:'680',
                    mask:true,
                    disabledrag:true
                },
                popOptions3:{
                    title:'G分购买及使用规则',
                    width:'410',
                    mask:true,
                    disabledrag:true
                },
                popOptions2:{
                    mask:true,
                    title: 'Go-Goal提示',
                    confirmText:'确认兑换',
                    confirmPadding:15,
                    confirmButton:true,
                    cancelButton:true,
                    cancelText:'取消',
                    cancelPadding:15,
                    width:355,
                    height:130,
                    disabledrag:true
                },
                alertPop:{
                    title:'Go-Goal提示',
                    //确认按钮
                    confirmPadding:15,
                    confirmButton:true,
                    confirmText:'确认',
                    closeButton:true,
                    width: 300,
                    height: 150,
                    mask:true,
                    disabledrag:true
                },
                //  研报权限统一（1可阅读，0不可，弹出购买终端包）
                show:false,
                options:{
                    mask:false,
                    title: 'Go-Goal提示',
                    confirmButton:false,
                    cancelButton:false,
                    cancelText:'取消',
                    width:680,
                    enableClickOut:true
                },
                phone:''
            }
        },
        mounted(){
            this.getUserType();
            if(this.report){
                this.auth(this.report);
            }
        },
        methods:{
            getUserType(){
                let user = getCookie('userType');
                let userType = null;
                if(user){
                    this.userType = JSON.parse(user).user_type;
                }
            },
            auth(data){
                let title = (data.create_date||data.createdate||(data.declare_date?data.declare_date.substr(0, 10):''))+' '+(data.organ_name||data.org_name||data.milestone||'')+'-'+(data.report_title||data.title||data.stock_name||''),
                    type = data.format||data.file_type,
                    id = data.guid;
                type = type?type.toLowerCase():'';
                const isNotice = data.original_type == 'announcement';
                this.reportData = {
                    guid:id,
                    title:title,
                    type:type
                }
                let options = null;
                if(isNotice){
                    options = {
                        format:type,
                        guid:id,
                        token: getToken()
                    }
                }else{
                    options = {
                        guid:id,
                        user_type:this.userType,
                        token: getToken()
                    }
                }
                if(!isNotice){
                    options.product_line = 901;
                }
                if(isNotice){
                    getNoticeUrl({
                        options:options,
                        callback0:(data)=>{
                            if(type == 'pdf'){
                                openFile(data.browse_url, title,getToken(),3)
                            }else{
                                let fileTitle;
                                switch(type){
                                    case 'doc':
                                    case 'docx':
                                        fileTitle = title+'.doc';
                                        break;
                                    case 'xlsx':
                                    case 'xls':
                                        fileTitle = title+'.xls';
                                        break;
                                    case 'text':
                                    case 'txt':
                                        fileTitle = title+'.txt';
                                        break;
                                    default:
                                        fileTitle = title +'.'+ type;
                                        break;
                                }
                                downloadFile(data.browse_url,fileTitle,false)
                            }
                            this.finish();
                        }
                    })
                }else{
                    getReportAuth({
                        options:options,
                        callback0:(data)=>{
                            this.openFile = data.open_file;
                            if(this.openFile == 1){
                                this.userOperation(title, id);
                                if(type == 'pdf' || !type){
                                    let fileUrl;
                                    if(data.browse_url.indexOf('?')>=0){
                                        fileUrl = data.browse_url + '&guid=' + id;
                                    }else{
                                        fileUrl = data.browse_url + '?guid=' + id;
                                    }
                                    openFile(fileUrl, title,getToken())
                                }else{
                                    let fileTitle;
                                    if(type == 'text'){
                                        fileTitle = title+'.txt';
                                    }else{
                                        fileTitle = title +'.'+ type;
                                    }
                                    fileTitle = fileTitle.replace(/[\\/:<>|?*]/g, '');
                                    downloadFile(data.browse_url,fileTitle,false)
                                }
                                this.finish();
                            }else{
                                //  投顾无G分相关内容
                                let agent = navigator.userAgent
                                if (agent.includes('zyzt')) {
                                  zyztNoPermissionPop()
                                } else if (agent.includes('zytg')) {
                                  JsToQtEventInterface(JSON.stringify({
                                      fun: 'AccountDeadlineTip'
                                  }));
                                }

                                this.finish();
                            }
                        }
                    })
                }

            },
            exchangeGpoints(){
                let {guid ,title ,type} = this.reportData;
                exchangeReport({

                    options:{
                        guid:guid
                    },
                    callback0:(data)=>{
                        this.userOperation(title, id);
                        if(type == 'pdf' || !type){
                            let fileUrl;
                            if(data.browse_url.indexOf('?')>=0){
                                fileUrl = `${data.browse_url}&guid=${guid}`;
                            }else{
                                fileUrl = `${data.browse_url}?guid=${guid}`;
                            }
                            openFile(fileUrl, title,getToken())
                        }else{
                            let fileTitle;
                            if(type == 'text'){
                                fileTitle = title+'.txt';
                            }else{
                                fileTitle = title +'.'+ type;
                            }
                            fileTitle = fileTitle.replace(/[\\/:<>|?*]/g, '');
                            downloadFile(data.browse_url,fileTitle,false);
                        }
                    },
                    afterResponse: () => {
                        this.afterExchangePoints();
                    }
                })
            },
            //  埋点
            userOperation(title,id){
                userOperation({
                    options:{
                        code: 'D2_001',
                        remark: 'title='+title+',guid='+id,
                        type:3
                    }
                })
            },
            afterExchangePoints(){
                this.confirmPop =  false;
                this.finish();
            },
            toggleChoice(index){
                if(index == this.selectedChoice){
                    return;
                }
                this.selectedChoice = index;
                if(index == 1){
                    this.fee = 1000;
                }else{
                    this.fee = 2000;
                }
            },
            closeGpoints(){
                this.noticePop = false;
                this.selectedChoice = 1;
                this.finish();
            },
            confirmPay(){
                let buyUrl = buyPointsUrl() + '/pay/ali_pc_pay?subject=G分充值&business_type=1007'+
                '&business_code='+ ( +new Date ) +'&total_amount='+this.fee+'&synch_url='+getUrlDomain()+'/html/buySuccess.html&token='+getToken();
                const { clientWidth,clientHeight } = document.documentElement;
                openNewWin({
                    width: clientWidth,
                    height: clientHeight,
                    url: buyUrl,
                    title: 'G分充值',
                    left: 0,
                    top: 40,
                    resizeable: true
                })
                this.afterPay();
            },
            afterPay(){
                this.noticePop = false;
                this.finish();
            },
            getHelp(){
                contactServer({

                    callback0:()=>{
                        this.helpNotice = true;
                    }
                })
                setTimeout(()=>{
                    this.helpNotice = false;
                    this.closeGpoints();
                },2000)
            },
            closeAlert(){
                this.alert = false;
                this.alertPop.width = '300';
                this.finish();
            },
            alertContent(text){
                this.alertText = text;
                this.alert = true;
            },
            finish(){
                this.$emit('finish');
            },
            closeConfirm(){
                this.confirmPop = false;
                this.finish();
            },
            close(){
                this.finish();
                if(event.target && event.target.getAttribute('title') == '点击阅读原文'){
                    return;
                }else{
                    this.show = false;
                }
            }
        },
        watch:{
            report(data){
                if(data){
                    this.auth(data);
                }
            }
        }
    }
</script>
<style lang="less">
    @import '~@less/common/variables.less';
    .permissionTip {
        width: 500px;
        padding: 25px;
        background: @color-white;
        color: @item-text-color;
        .messageBox-p{
            margin-top: 10px;
        }
        p {
            //    margin: 0;
        }
        .tipTitle {
            text-indent: 2em;
            line-height: 30px;
        }
        .tipBorder {
            padding-bottom: 20px;
            //    margin-bottom: 20px;
            border-bottom: 1px solid @popupWindow-line2;
        }
        .tipTel {
            margin: 30px 0;
        }
        .tipEndDate {
            //    margin-left: 138px;
            text-align: center;
            color: @color-gray3;
            margin-top: 20px;
        }
        .tipBuyBtn {
            margin-left: 30px;
            button {
                display: inline-block;
                width: 150px;
                height: 30px;
                color: @color-white;
                border-radius: 2px;
                background: @color-blue;
                border: none;
                outline: none;
                &.active {
                    background: @color-gray3;
                }
            }
        }
        .changeUser{
            margin-left: 50px;
            color: @color-blue;
            cursor: pointer;
            cursor: hand;
        }
        .boxCenter {
            text-align: center;
            color: @color-gray3;
        }
        .telInput,
        .messageInput {
            width: 174px;
            height: 27px;
            background: @color-white;
            border: 1px solid @color-gray3;
            outline: none;
            padding-left: 5px;
            vertical-align: top;
            border-radius: 2px;
        }
        .messageInputWidth {
            width: 118px;
        }
        .infoInput {
            margin-left: 30px;
        }
        .errorTip {
            height: 25px;
            line-height: 25px;
            margin-left: 30px;
            color: @color-tips-red;
        }
        .sendTelBtn {
            //    width: 86px;
            height: 25px;
            outline: none;
            background: @color-blue;
            color: @color-white;
            border-radius: 2px;
            border: none;
            margin-left: 8px;
            padding: 2px 15px;
            &.active {
                background: @color-gray3;
            }
        }
        .imgBox {
            height: 95px;
            margin-top: 20px;
            overflow: hidden;
            text-align: center;
        }
        .errorTip2 {
            width: 100%;
            text-align: center;
        }
    }
    .exchangeReport{
        padding:10px;
        line-height:20px;
    }
    .alert-text{
        height:100%;
        text-align: center;
        line-height:85px;
    }
    .alert-popup{
        z-index: 999;
    }
    .gpoints-notice .popup{
        left:e('calc(50% - 340px)') ;
        top:e('calc(50% - 190px)') ;
    }
    .gpoints-page{
        line-height:20px;
        padding-top:5px;
        padding-bottom:0;
        font-size:12px;
        text-align: left;
    }
    .gpoints-top{
        padding-left:20px;
        padding-top:20px;
    }
    .gpoints-title{
        color:@item-text-color;
        font-weight:bold;
        font-size:14px;
    }
    .gpoints-gethelp{
        display:inline-block;
        outline:none;
    }
    .gpoints-zfb{
        padding:10px 0;
        color:@color-gray2;
    }
    .gpoints-bottom{
        background:@popup-left-bg;
        padding-bottom:5px;
    }
    .gpoints-select{
        text-indent:3em;
        line-height:35px;
        color:@color-gray3;
    }
    .gpoints-btn{
        display:inline-block;
        width:100%;
        text-align: center;
        margin-top:35px;
        padding-bottom:8px;
    }
    .gpoints-mask{
        position: absolute;
        width:200px;
        height:70px;
        background:@color-black;
        opacity:0.7;
        left:240px;
        top:120px;
        color:@color-white;
        text-align:center;
        line-height:70px;
        border-radius:10px;
        font-size:12px;
    }
    .gpoints-container{
        text-align:center;
    }
    .gpoints-choice{
        display:inline-block;
        width:200px;
        height:112px;
        padding:35px 30px;
        background:@color-white;
        text-align:center;
        border:2px solid @color-white;
        cursor:pointer
    }
    .gpoints-choice:nth-of-type(2){
        margin-left:20px
    }
    .gpoints-choice.active{
        border-color:@color-yellow;
        position: relative;
    }
    .gpoints-choice.active:after{
        position: absolute;
        width: 0;
        right: 0;
        bottom: 0;
        content: '√';
        text-indent: -16px;
        line-height: 41px;
        border-bottom: 30px solid @color-yellow;
        border-left: 30px solid transparent;
        height: 0;
        color: @color-white;
        font-size: 17px;
        font-weight: bold;
        font-family:SimHei,@font-family-sans-serif;
    }
    .gpoints-choice.active .gpoints-cost,.gpoints-choice.active .gpoints-amount{
        color:@color-yellow;
    }
    .gpoints-amount{
        color:#666;
        font-size:26px;
    }
    .gpoints-cost{
        color:@color-gray3;
        font-size:14px;
    }
    .gpoints-cover{
        left:0;
        top:0;
        z-index: 2;
        position:absolute;
        width:100%;
        height:100%;
        background:rgba(0,0,0,0.4);
    }
    .gpoints-pay{
        background:@color-yellow !important;
        outline: none;
    }
    .gpoints-alert{
        color:@color-gray3;
        text-align: center;
        line-height:30px;
    }
    .gpoints-rules{
        color:@color-blue;
        cursor:pointer;
    }
    .gpoints-rules:hover{
        color:@color-blue;
    }
    .gpoints-rules-popup .popup{
        left:e('calc(50% - 205px)');
        top:e('calc(50% - 160px)');
    }
    .gpoints-rules_container{
        font-size:12px;
        color:#666;
        width:410px;
        background:@color-white;
        text-align: left;
        border:1px solid @popup-border-color;
    }
    .gpoints-rules_main{
        padding:20px;
    }
    .gpoints-rules_top{
        background:@color-blue;
        height:30px;
        color:@color-white;
    }
    .gpoints-rules_top_title{
        float:left;
        line-height:30px;
        margin-left:10px;
    }
    .gpoints-rules_top_close{
        float:right;
        width:26px;
        height:26px;
        line-height:26px;
        margin-top:2px;
        margin-right:5px;
        text-align:center;
        cursor:pointer;
    }
    .gpoints-rules_top_close:hover{
        background:@color-red;
    }
    .gpoints-rules_title{
        color:@item-text-color;
        font-size:14px;
        margin-bottom:10px;
        line-height:20px;
    }
    .gpoints-rules_title:last-of-type{
        margin-bottom:0;
    }
    .gpoints-rules_row{
        margin-bottom:6px;
        line-height:17px;
    }
    .gpoints-notice > .popup{
        position: fixed !important;
        left: e('calc(50% - 340px)') !important;
        top: e('calc(50% - 190px)') !important;
    }
    .confirmPay > .popup{
        position: fixed !important;
        left: e('calc(50% - 177px)') !important;
        top: e('calc(50% - 65px)') !important;
    }
    .alert-popup > .popup{
        position: fixed !important;
        left: e('calc(50% - 150px)') !important;
        top: e('calc(50% - 75px)') !important;
    }
</style>
