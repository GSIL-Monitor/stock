/**
 * Created by liuyjx on 2017/9/7.
 */
function BigEvent(param,$this){
    this.param = param;
    this.$this = $this;
    this.title = param.title;
    this.event_ids = param.event_ids;
    this.timeFun = param.timeFun;
    this.noDataCallback = param.noDataCallback;
    this.apiError = param.apiError;
    this.e = param.event;
    this.leaveCallback = param.leaveCallback;
    this.htmlText = param.htmlText;             //自由生成HTML
    this.closeObj = null;
    this.data = null;
    this.listData = null;
    this.popupMainBox = null;
    this.popupListBox = null;
    this.timeObj = null;
    this.initHtml();
}
BigEvent.prototype = {
    paramInit:function(){
        this.param = null;
        this.$this = null;
        this.listData = null;
        this.event_ids = null;
        this.e = null;
        this.data = null;
        this.htmlText = null;
    },
    initHtml : function(){
        var me = this;
        var title = me.title ? me.title : '<span>未来事件提示</span>';
        var body = document.getElementsByTagName('body')[0];
        if(!document.getElementById('big-event-popup')){
            var mainBox = document.createElement('div');
            mainBox.style.cssText = 'position: fixed;display: none;z-index: -1;';
            mainBox.setAttribute('class','big-event-popup');
            mainBox.setAttribute('id','big-event-popup');
            mainBox.innerHTML = '<div class="big-event-popup-head"><p class="big-event-popup-title" style="display: inline-block;float:left;margin:0;">'+ title +'</p><span id="big-event-popup-close">X</span></div>'+
            '<div class="big-event-popup-box">'+
                //'<div id="big-event-popup-ico" class="big-event-popup-ico"></div>'+
            '<div class="event-list" id="event-list">'+
                //列表内容
            '</div>'+
                //'<div class="event-hint">'+
                //'<p>注：展示催化剂线索发布时间一定范围内可能有影响的事件</p>'+
                //'</div>'+
            '</div>';
            body.appendChild(mainBox);
        }else{
            document.getElementsByClassName('big-event-popup-title')[0].innerHTML = title;
        }
        me.popupMainBox = document.getElementById('big-event-popup');
        me.popupListBox = document.getElementById('event-list');
        me.closeObj = document.getElementById('big-event-popup-close');
        //me.eventBind();

        //if(me.timeFun && !isNaN(me.timeFun)){             //划过触发时防止多次触发
        //    var time = Number(me.timeFun);
        //    me.timeObj = window.setTimeout(function(){
        //        clearTimeout(me.timeObj);
        //        me.timeObj = null;
        //        me.initFun();
        //    },time);
        //}else if(me.timeFun && typeof me.timeFun === 'function'){
        //    me.timeFun();
        //}else{
        //    me.initFun();
        //}
        me.initFun();
    },
    initFun:function(){
        var me = this;
        me.popupListBox.getFlag = true;     //调取标示  true不可以调数据
        me.listData = me.param.listData;
        //    .done(function(data){
            me.dataService(me.listData);
        //});
    },
    dataService:function(data){
        var code = data?data.code:'';
        var me = this;
        switch (code){
            case 0:
                me.htmlShow(data.data);
                break;
            case 1001:
                var hintHtml = '<p>无数据</p>';
                if(me.noDataCallback){
                    hintHtml = me.noDataCallback;
                }
                me.popupListBox.innerHTML = hintHtml;
                me.popupShow();
                break;
            default :
                if(me.apiError && typeof me.apiError === 'function'){
                    hintHtml = me.apiError(data);
                }
                break;
        }
    },
    htmlShow:function(data){
        var itemHtml = '';
        var me = this;
        for(var j= 0,length=data.length;j<length;j++){
            var radar_name = data[j].radar_name;
            var date = data[j].date?data[j].date.substring(0,10):'';
            var radar_name_html = '';
            if(radar_name && radar_name.length>0){
                for(var i= 0,len=radar_name.length;i<len;i++){
                    //radar_name_html += '<li>'+ radar_name[i] +'</li>';
                    radar_name_html += radar_name[i] +' ';
                }
            }
            var lineHtml = '<div class="left-line"></div>';
            if(data.length == 0 || j == data.length-1){
                lineHtml = '';
            }
            if(me.htmlText && typeof me.htmlText === 'function'){
                itemHtml += me.htmlText({
                    data:data[j],
                    index:j
                });
            }else{
                itemHtml += '<div class="event-list-item">'+
                '<div class="event-list-item-left">'+
                '<div class="left-spot">'+
                '<div class="left-center-spot"></div>'+
                '</div>'+
                lineHtml+
                '</div>'+
                '<div class="event-list-item-right">'+
                '<p class="event-list-item-title">'+date+' '+radar_name_html +'</p>'+
                '<p class="event-list-item-content">'+ data[j].title +'</p>'+
                    //'<ul>'+
                    //radar_name_html+
                    //'</ul>'+
                    //'<p class="event-list-item-date">'+ date +'</p>'+
                '</div>'+
                '</div>'
            }
        }
        me.popupListBox.innerHTML = itemHtml;
        me.eventBind();
        me.popupShow();
    },
    position:function(){
        var me = this;
        var bigEventHeight = 336;//me.popupMainBox.offsetHeight;
        var winWidth = window.innerWidth || document.clientWidth;
        var winHeight = window.innerHeight || document.clientHeight;
        var mainBoxWidth = 460;//me.popupMainBox.offsetWidth;
        //me.popupMainBox.css({'top':(winHeight - bigEventHeight)/2,'left':(winWidth - mainBoxWidth)/2,display:'block','z-index':9999});
        me.popupMainBox.style.cssText = 'top:'+(winHeight - bigEventHeight)/2+'px;left:'+(winWidth - mainBoxWidth)/2+'px;display:block;z-index:99999';
        return false;           //新版只要居中
        var coordX = 0;
        var coordY = 0;
        var x = me.e.pageX;
        //var x = me.e.clientX;
        //var y = me.e.pageY;
        var y = me.e.clientY;
        var $this = me.$this;
        var body = document.getElementsByTagName('body')[0];
        var bodyScrollTop = body.scrollTop;
        var popupIc = document.getElementById('big-event-popup-ico');
        if((winWidth - x)>mainBoxWidth/2 + 15){
            coordY = y +bodyScrollTop;
            coordX = x-mainBoxWidth/2;
            popupIc.style.left = mainBoxWidth/2;
        }else{
            coordY = y +bodyScrollTop;
            coordX = winWidth - mainBoxWidth - 15;
            me.popupMainBox.style.cssText = 'top:'+y-2+'px;left:'+winWidth - mainBoxWidth - 15;
            popupIc.style.left = mainBoxWidth -(winWidth-x -15);
        }
        if(x<mainBoxWidth/2 + 15){
            coordY = y +bodyScrollTop;
            coordX = 0;
            popupIc.style.left = x+'px';
        }
        if((winHeight -y)<bigEventHeight + 40){
            coordY = y - bigEventHeight - $this.offsetHeight - 10  +bodyScrollTop;
            popupIc.setAttribute('class','big-event-popup-down-ico');
        }else{
            popupIc.setAttribute('class','big-event-popup-ico');
        }
        //me.popupMainBox.css({'top':coordY,'left':coordX,display:'block','z-index':9999});
        me.popupMainBox.style.cssText = 'top:'+ coordY +';left:'+coordX+';display:block;z-index:9999';
    },
    popupShow:function(){
        var me = this;
        if(!me.e){
            return false;
        }

        me.position();
        window.onresize = function (e){
            if(me.popupMainBox && me.popupMainBox.style.display === 'none'){return false;}
            me.position();
        };
    },
    coordService:function(e){
        var me = this;
        var thisParent = document.getElementsByTagName('body')[0] || me.popupMainBox.parentNode;
        var scrollTop=document.documentElement.scrollTop||thisParent.scrollTop;//document.body.scrollTop;
        var scrollLeft=document.documentElement.scrollLeft||thisParent.scrollLeft;//document.body.scrollLeft;
        return {x: e.clientX+scrollLeft, y: e.clientY+scrollTop};
    },
    drag:function(e,disX,disY){
        var me = this;
        var oEvent=e||event;
        var pos=me.coordService(oEvent);
        //防止div跑出可视框
        var l=pos.x-disX;
        var t=pos.y-disY;

        var win_w = window.innerWidth || document.clientWidth;
        var win_h = window.innerHeight || document.clientHeight;
        if(l<0) {l=0;}
        else if(l>document.documentElement.clientWidth - document.offsetWidth) {   //document.documentElement.clientWidth - me.popupMainBox.offsetWidth
            l=document.documentElement.clientWidth - document.offsetWidth;   // document.documentElement.clientWidth - me.popupMainBox.offsetWidth
        }

        if(l>win_w - me.popupMainBox.offsetWidth){
            l = win_w - me.popupMainBox.offsetWidth
        }
        if(t<0) {t=0;}
        else if(t>document.documentElement.clientHeight - document.offsetHeight)  //popupElement.offsetHeight
        {
            t=document.documentElement.clientHeight - document.offsetHeight;  //popupElement.offsetHeight
        }
        if(t>win_h - me.popupMainBox.offsetHeight){
            t = win_h - me.popupMainBox.offsetHeight
        }
        //me.popupMainBox.css({'left':l,'top':t});
        me.popupMainBox.style.left = l +'px';
        me.popupMainBox.style.top = t +'px';
        return false;
    },
    hide:function(){
        var me = this;
        me.popupMainBox.style.display = 'none';//不要移出隐藏
        me.paramInit();
    },
    eventBind:function(){
        var me = this;
        var $thisObj = me.$this;
        $thisObj.onmouseout = function (e){
            if(me.timeObj){
                window.clearTimeout(me.timeObj);
                me.timeObj = null;
            }
            //me.popupMainBox.style.display = 'none';//不要移出隐藏
            me.paramInit();
            if(typeof me.leaveCallback == 'function'){
                me.leaveCallback({
                    flag:true,
                    $this:$thisObj
                });
            }
        };
        me.popupMainBox.onmouseover = function (e){
            this.style.display = 'block';
        };
        me.popupMainBox.onmouseout = function (e){
            if(me.timeObj){
                window.clearTimeout(me.timeObj);
                me.timeObj = null;
            }
            //this.style.display = 'block';//不要移出隐藏
            me.paramInit();
            if(typeof me.leaveCallback == 'function'){
                me.leaveCallback({
                    flag:true,
                    $this:$thisObj
                });
            }
        };
        var titleBar = me.popupMainBox.getElementsByClassName('big-event-popup-head')[0];
        titleBar.onmousedown = function (e){
            e.stopPropagation();
            this.style.cursor = 'move';
            var oEvent=e||event;
            var pos = me.coordService(oEvent);  //这样就可以获取鼠标坐标，比如pos.x表示鼠标横坐标
            var disX=pos.x - me.popupMainBox.offsetLeft;
            var disY=pos.y - me.popupMainBox.offsetTop;
            document.onmousemove = function(e){
                me.drag(e,disX,disY);
            };
        };
        titleBar.onmouseup = function (e){
            document.onmousemove=null; //将move清除
            document.onmouseup=null;
            this.style.cursor = 'default';
        };

        me.popupMainBox.onclick = function (e){
            e.stopPropagation();
            if(e.target.getAttribute('id') != 'big-event-popup-close'){
                this.style.display = 'block';
            }
        };
        document.onclick = function(e){
            me.hide();
        };
        me.closeObj.onclick = function(e){
            me.hide();
        };
    }
};
exports.bigEvent = function (param,$this){
    return new BigEvent(param,$this);
};