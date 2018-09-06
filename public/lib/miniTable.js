/**
 * Created by liuyjx on 2017/9/1.
 */
function DefinitionTable (param){
    this.time = null;
    this.oldHoverIndex = 0;
    this.tableMainBox = typeof param.tableMainBox == 'string' ? document.getElementById(param.tableMainBox) : param.tableMainBox;
    this.scrollValue = param.scrollValue;
    this.scrollCallback = param.scrollCallback;
    this.tdClick = param.tdClick;
    this.mainThTr = '';
    this.trClick = param.trClick;
    this.thClick = param.thClick;
    this.tdMove = param.tdMove;
    this.trMove = param.trMove;
    this.fixedTbody = null;
    this.childTh = [];
    this.fixedThTr = '';
    this.fixedTdTr = '';
    this.tdTr = '';
    this.fixedTd = '';
    this.tr = '';
    this.randomStr = '';
    this.trIndex = 0;
    this.th = param.th;
    this.td = param.td;
    this.downSpan = param.downSpan ? param.downSpan : 50;
    this.scrollDownCallback = param.scrollDownCallback;     //滚动回调
    this.mainTbodyBox = null;
    this.mainTbodyBlock = null;
    this.theadBlock = null;
    this.fixedTheadBlock = null;
    this.tbodyBlockElement = null;
    this.fixedTbodyElement = null;
    this.tbodyBlock = null;
    this.fixedTbodyBlock = null;
    this.fixedThead = null;
    this.fixedThead2 = null;
    this.thead = null;
    this.thead2 = null;
    this.oldMoveTd = null;
    this.init();
}
DefinitionTable.prototype = {
    thWeight:function(th){
        var str=[];
        var str1=[];
        var ab = {};
        var rowspan = {};
        var col = [];
        for(var i=0;i<th.length;i++){
            if(str1.indexOf(th[i][1])<0){
                str.push([th[i][0],th[i][1]]);
                str1.push(th[i][1]);
            }else{
                ab[th[i][1]] = ab[th[i][1]] ? ab[th[i][1]] + 1 : 1;
                col.push([i,ab['colspan'+i]])
            }
            if(th[i][2]){
                rowspan[th[i][1]] = th[i][2];
            }
        }
        return{
            th:str,
            rowspan:rowspan,
            col:col,
            colspan:ab
        }
    },
    thStr:function(thArray){
        var me = this;
        var newThObj = me.thWeight(thArray);
        var newTh = newThObj.th;
        var row = newThObj.rowspan;
        var col = newThObj.colspan;
        var thS = '';
        var a = 1;
        for(var i = 0,len = newTh.length; i < len ; i ++){
            var threeStr = newTh[i][0].substring(3,newTh[i][0].length);
            var itemRow = 1;
            var itemCol = 1;
            if(typeof col === 'object'){
                itemCol = col[newTh[i][1]] ? col[newTh[i][1]] + 1 : 1;
            }
            if(typeof row === 'object'){
                itemRow = row[newTh[i][1]] ? row[newTh[i][1]]  : 1;
            }
            thS += '<th colspan="'+ itemCol +'" rowspan="'+ itemRow +'" '+ threeStr;
            a++;
            if(me.fixed.length>0 && me.fixed[1].indexOf(i)>=0){
                me.fixedTh += '<th colspan="'+ itemCol +'" rowspan="'+ itemRow +'" '+ threeStr;
                if(i == len - 1){
                    me.fixedTh += '<tr>'+ me.fixedTh +'</tr>';
                }
            }
        }
        return thS;
    },
    thCreate:function(param){
        var text = param.text ? param.text : '';
        var style = param.style ? param.style : '';
        var attr = param.attr ? param.attr : '';
        var name = param.name ? param.name : '';
        return '<th '+ attr +' data-name="'+ name +'" style="'+ style +'" >'+ text +'</th>';
    },
    thTrCreate:function(thArray){
        var me = this;
        var th_str = '';
        var fixed_th_str = '';
        var childTh = [];
        for(var i = 0,len = thArray.length; i < len ; i ++){
            var th_ = '';
            if(thArray[i].child){
                childTh = childTh.concat(thArray[i].child);
                if(thArray[i].$this){
                    th_ = me.thCreate(thArray[i].$this);
                }
            }else{
                var singleThis = thArray[i].$this || thArray[i];
                th_ = me.thCreate(singleThis);
            }
            if(thArray[i].fixed){           //固定
                fixed_th_str += th_;
            }else{
                th_str += th_;
            }
            if(i === len - 1){
                for(var j = 0; j<childTh.length; j ++){
                    me.childTh[j] = childTh[j];
                }
                me.mainThTr += '<tr>'+ th_str +'</tr>';
                me.fixedThTr += '<tr>'+ fixed_th_str +'</tr>';
                th_str = '';
                fixed_th_str = '';
                if(childTh.length>0){
                    me.thTrCreate(childTh);
                }else{
                }
            }
        }
        var fixedTableThead_style = 'position: absolute;left: 0;top: 0;z-index: 99;',
            tableTheadBlock_style = 'position: relative;top: 0;left: 0;width: 100%;overflow: hidden;z-index: 99;',
            tableThead_style = 'position: relative;overflow:hidden;',
            tableTbodyBlock_style = 'position: relative;width: 100%;height: auto;overflow: auto;z-index: 0;', //position: relative;
            fixedTableTbody_style = 'position: absolute;left: 0;top: 0;';
            
        var bodyMainStyle = 'position: relative;'

        var html = '<div class="table-thead-block" style="'+ tableTheadBlock_style +'" id="headBlock'+ this.randomStr +'">' +
            '<div class="table-thead" style="'+ tableThead_style +'" id="headBlockDiv'+ this.randomStr +'"><table><thead class="table-thead-el"  id="headBlockThead'+ this.randomStr +'">'+ me.mainThTr +'</thead></table></div>' +
            '</div>' +
            '<div class="table-tbody-main" style="'+ bodyMainStyle +'" id="mainTbodyBox'+ this.randomStr +'">'+
            '<div class="table-tbody-block" style="'+ tableTbodyBlock_style +'" id="mainBlock'+ this.randomStr +'">' +
            '<div class="table-tbody" id="bodyBlockDiv'+ this.randomStr +'"><table><thead class="table-thead-el2"   id="bodyBlockThead'+ this.randomStr +'">'+ me.mainThTr +'</thead><tbody  id="bodyBlockTbody'+ this.randomStr +'" class="table-tbody-el"></tbody></table></div>'+
            '</div>'+
            '</div>';
        if(me.fixedThTr){
            html = '<div class="table-thead-block" style="'+ tableTheadBlock_style +'" id="headBlock'+ this.randomStr +'">' +
            '<div class="fixed-table-thead" style="'+ fixedTableThead_style +'" id="headBlockFixedDiv'+ this.randomStr +'"><table><thead class="fixed-table-thead-el"  id="headBlockFixedThead'+ this.randomStr +'">'+ me.fixedThTr +'</thead></table></div>' +
            '<div class="table-thead" style="'+ tableThead_style +'" id="headBlockDiv'+ this.randomStr +'"><table style="width:auto;"><thead class="table-thead-el"  id="headBlockThead'+ this.randomStr +'">'+ me.mainThTr +'</thead></table></div>' +
            '</div>' +
            '<div class="table-tbody-main" style="'+ bodyMainStyle +'" id="mainTbodyBox'+ this.randomStr +'">'+
            '<div class="table-tbody-block" style="'+ tableTbodyBlock_style +'" id="mainBlock'+ this.randomStr +'">' +
            '<div class="fixed-table-tbody" style="'+ fixedTableTbody_style +'" id="bodyBlockFixedDiv'+ this.randomStr +'"><table><thead class="fixed-table-thead-el2" id="bodyBlockFixedThead'+ this.randomStr +'">'+ me.fixedThTr +'</thead><tbody id="bodyBlockFixedTbody'+ this.randomStr +'" class="fixed-table-tbody-el"></tbody></table></div>'+
            '<div class="table-tbody" id="bodyBlockDiv'+ this.randomStr +'"><table><thead class="table-thead-el2" id="bodyBlockThead'+ this.randomStr +'">'+ me.mainThTr +'</thead><tbody  id="bodyBlockTbody'+ this.randomStr +'" class="table-tbody-el"></tbody></table></div>' +
            '</div>' +
            '</div>';
        }
        this.tableMainBox.innerHTML = html;
        this.tableMainBox.style.position = 'relative';

        this.mainTbodyBox = document.getElementById('mainTbodyBox'+me.randomStr);

        this.fixedTheadBlock = me.fixedThTr ? document.getElementById('headBlockFixedDiv'+me.randomStr) : '';
        this.tbodyBlockElement = document.getElementById('bodyBlockTbody'+ me.randomStr);
        this.fixedTbodyElement = me.fixedThTr ? document.getElementById('bodyBlockFixedTbody'+ me.randomStr) : '';
        this.theadBlock = document.getElementById('headBlockDiv'+ me.randomStr);
        this.tbodyBlock = document.getElementById('bodyBlockDiv'+ me.randomStr);
        this.fixedTbodyBlock = this.fixedThTr ? document.getElementById('bodyBlockFixedDiv'+ me.randomStr) : '';
        this.mainTbodyBlock = document.getElementById('mainBlock'+ me.randomStr);
        this.fixedThead = this.fixedThTr ? document.getElementById('headBlockFixedThead'+ me.randomStr) : '';       //固定th
        this.fixedThead2 = this.fixedThTr ? document.getElementById('bodyBlockFixedThead'+ me.randomStr) : '';       //固定th
        this.thead = document.getElementById('headBlockThead'+ me.randomStr);       //不固定th
        this.thead2 = document.getElementById('bodyBlockThead'+ me.randomStr);       //不固定th
        //this.theadHeight = this.theadBlock.offsetHeight;
        this.oldHoverIndex = 0;
        this.tableCompute();
        this.tableScroll();
        this.eventBind();
    },
    tdStr:function(td,clear){
        var me = this;
        var tdArray = td ? td : me.td;
        if(!tdArray || tdArray.length === 0){
            var hint = '<p class="-tableNoData-" style="text-align: center;">无数据</p>';
            if(typeof me.noDataCallback === 'function'){
                hint = me.noDataCallback();
            }
            return '';
        }
        for(var i = 0, len = tdArray.length; i < len ; i++){
            var itemTd = tdArray[i];
            var tdS = '';
            var fixed_td = '';
            for(var j = 0; j < itemTd.length ; j ++){
                var itemAttr = itemTd[j].attr ? itemTd[j].attr :'';
                var itemStyle = itemTd[j].style ? itemTd[j].style :'';
                if(itemTd[j].fixed){
                    fixed_td += '<td '+ itemAttr +'  style="'+ itemStyle +'">'+ itemTd[j].text +'</td>';
                }else{
                    tdS += '<td '+ itemAttr +'  style="'+ itemStyle +'">'+ itemTd[j].text +'</td>';
                }
            }
            me.tdTr += '<tr id="tr'+ me.randomStr+ me.trIndex+'" trIndex="'+ me.trIndex +'" class="a" indexVal="'+ me.trIndex+'">'+ tdS +'</tr>';
            me.fixedTdTr += '<tr id="fixedTr'+ me.randomStr+ me.trIndex+'" class="b" fixedFlag'+ me.randomStr +'="1" indexVal="'+ me.trIndex +'">'+ fixed_td +'</tr>';
            me.trIndex++
        }
        if(clear){
            this.tbodyBlockElement.innerHTML = me.tdTr;
            if(this.fixedTbodyElement) this.fixedTbodyElement.innerHTML = me.fixedTdTr;
        }else{
            this.tbodyBlockElement.innerHTML += me.tdTr;
            if(this.fixedTbodyElement) this.fixedTbodyElement.innerHTML += me.fixedTdTr;
        }
        me.tdTr = '';
        me.fixedTdTr = '';
        me.tableCompute(true);
    },
    tableCompute : function(f,table_h,table_w){     //f是否重算th宽度 table_h table_w 当浏览器不支持calc时传入
        if(f){
            var fixed_th = this.fixedThead.getElementsByTagName('th');
            var fixed_head_th = this.fixedThead2.getElementsByTagName('th');
            for(var i = 0,length = fixed_th.length ; i < length ; i ++){
                fixed_th[i].style.width = fixed_head_th[i].offsetWidth+'px';
                fixed_th[i].style.minWidth = fixed_head_th[i].offsetWidth+'px';
                fixed_th[i].style.maxWidth = fixed_head_th[i].offsetWidth +'px';
            }
        }
        var thead_h = this.thead.offsetHeight,
            main_h = table_h ? table_h : this.tableMainBox.offsetHeight,
            main_w = table_w ? table_w : this.tableMainBox.offsetWidth,
            scroll_x = this.mainTbodyBlock.scrollLeft;
        this.mainTbodyBlock.style.maxHeight = main_h - thead_h +'px';
        this.tbodyBlock.style.marginTop = -thead_h+'px';
        this.fixedTbodyBlock.style.marginTop = -thead_h+'px';
        this.fixedTbodyBlock.style.left =  scroll_x +'px';//'0px';        //重置表格位置

        var fixed_w = this.fixedTheadBlock.offsetWidth;
        this.theadBlock.style.marginLeft = fixed_w -scroll_x+'px';        //重置表格位置
        this.tbodyBlock.style.marginLeft = fixed_w+'px';        //重置表格位置
        // this.tbodyBlock.style.width = main_w ? main_w-fixed_w +'px' : 'calc(100% - '+fixed_w+'px)';

        var th = this.thead.getElementsByTagName('th');
        var head_th = this.thead2.getElementsByTagName('th');
        for(var j = 0,leng = th.length ;j < leng ; j ++){
            th[j].style.width = head_th[j].offsetWidth+'px';
            th[j].style.minWidth = head_th[j].offsetWidth+'px';
            th[j].style.maxWidth = head_th[j].offsetWidth +'px';
        }
    },
    showData: function(param,clear){      //显示内容
        this.tdStr(param,clear)
    },
    getAttr: function(target,attr){
        var result;
        if(getComputedStyle){
            result = window.getComputedStyle(target,null)[attr];
        }else{
            result = target.currentStyle[attr];
        }
        return result;
    },
    tableScroll: function (){
        var $this = this;
        this.mainTbodyBlock.onscroll = function(e){
            var l = e.target.scrollLeft,
                ol = e.target.oldScrollLeft,
                t = e.target.scrollTop,
                ot = e.target.oldScrollTop,
                show_h = e.target.clientHeight,
                direction = '';
            if(l != ol){
                this.scrollLeft = ol;
                $this.fixedTbodyBlock.style.left = l+'px';
                var fixed_w = $this.fixedTheadBlock.offsetWidth;
                $this.theadBlock.style.marginLeft = fixed_w - l +'px';
                this.oldScrollLeft = l;
                this.scrollLeft = l;
                if(l>ol){
                    direction = 'right'
                    // console.log('向右')
                }else{
                    direction = 'left'
                    // console.log('向左')
                }
            }
            if(t != ot){
                if(t>ot){
                    var span = this.scrollTop +$this.downSpan +this.clientHeight;
                    if(span >= this.scrollHeight && $this.scrollDownCallback && typeof $this.scrollDownCallback == 'function'){
                        $this.scrollDownCallback({
                            $this:this
                        });
                    }
                    direction = 'down'
                    // console.log('向下');
                }else{                    
                    direction = 'right'
                    // console.log('向上');
                }
                this.oldScrollTop = this.scrollTop;
            }
            if($this.scrollDirection && typeof $this.scrollDirection == 'function'){
                $this.scrollDirection({
                    left: l,
                    top: t,
                    direction: direction
                });
            }
        }
    },
    searchElement: function(target,element,endLabel){            //只能查找下一层
        var r = new RegExp('<'+ element +'.*?>','gi'),
            child = target.innerHTML,
            id_str = /^[#]/,
            class_str = /^[.]/,
            result = null,
            parent = target.parentNode;
        if(parent.nodeName.toLowerCase() == element){       //就是自己
            result = parent;
        }
        else if(class_str.test(element)){        //查找的元素class名
            var className = element.replace(/^[.]/,'');
            result = target.getElementsByClassName(className)[0]
        }
        else if(id_str.test(element)){           //查找的元素ID名
            var idName = element.replace(/^[#]/,'');
            result = document.getElementById(idName);
        }
        else if(target.nodeName.toLowerCase() == element){
            result = target;
        }
        else if(child && r.test(child)){
            result = target.getElementsByTagName(element)[0];
        }else {
            var newParent = parent.parentNode,
                flag = true;
            while(flag){
                if(!newParent || !newParent.nodeName) {
                    result = null;
                    flag = false;
                    break;
                }
                if(newParent.nodeName.toLowerCase() == element){
                    result = newParent;
                    flag = false;
                }else if(newParent.nodeName.toLowerCase() == endLabel){
                    result = null;
                    flag = false;
                }else{
                    newParent = newParent.parentNode;
                }
            }
        }
        return result;
    },
    addClass: function(element,className){
        var elementClass = element.getAttribute('class'),
            r = new RegExp(className,'gi');
        elementClass = elementClass ? elementClass.replace(/\s+/g,' ') : '';
        if(!r.test(elementClass)){
            elementClass = className +' '+ elementClass;
        }
        elementClass = elementClass.replace(/\s+/g,' ');
        element.setAttribute('class',elementClass);
    },
    removeClass: function (element,className){
        var elementClass = element.getAttribute('class'),
            r = new RegExp(className,'g');
        elementClass = elementClass ? elementClass.replace(r,'') : '';
        elementClass = elementClass.replace(/\s+/g,' ');
        element.className = elementClass;
        element.setAttribute('class',elementClass);
    },
    eventBind:function(){
        var $this = this;
        window.onresize = function(){
            $this.tableCompute();
        };
        this.tableMainBox.onmouseleave = function(e){
            var hoverLabel = $this.tableMainBox.getElementsByClassName('-trHoverFlag-'),
                i = 0;
            $this.oldHoverIndex = -1;
            while(hoverLabel[i]){
                var oldClass = hoverLabel[i].className;
                if(oldClass) oldClass = oldClass.replace(/-trHoverFlag-/g,'');
                hoverLabel[i].setAttribute('class',oldClass);
                if(hoverLabel[i]) hoverLabel[i].className = oldClass;
                i++;
            }
        }
        this.tableMainBox.onmousemove = function(e){
            var isTh = $this.searchElement(e.target,'th','table');
            if(isTh) return false;
            var isTr = $this.searchElement(e.target,'tr','table'),
                isTd = $this.searchElement(e.target,'td','table');
            if(isTr){
                var fixedFlag = isTr.getAttribute('fixedFlag'+$this.randomStr),
                    index = isTr.getAttribute('indexval'),
                    hoverLabel = this.getElementsByClassName('-trHoverFlag-'),
                    i = 0;
                fixedFlag = Number(fixedFlag);
                index = Number(index);
                if($this.oldHoverIndex == index+1) return false;
                if(!$this.oldHoverIndex) {
                    $this.oldHoverIndex = index+1;
                }else{
                    $this.oldHoverIndex = index+1;
                }
                while(hoverLabel[i]){
                    var oldClass = hoverLabel[i].className;
                    if(oldClass) oldClass = oldClass.replace(/-trHoverFlag-/g,'');
                    hoverLabel[i].setAttribute('class',oldClass);
                    if(hoverLabel[i]) hoverLabel[i].className = oldClass;
                    i++;
                }
                if(fixedFlag){
                    var tr = $this.tbodyBlockElement.getElementsByTagName('tr')[index];
                    if(tr) $this.addClass(tr,'-trHoverFlag-');
                }else{
                    if($this.fixedTbodyElement){
                        var fixedTr = $this.fixedTbodyElement.getElementsByTagName('tr')[index];
                        if(fixedTr) $this.addClass(fixedTr,'-trHoverFlag-');
                    }
                }
                $this.addClass(isTr,'-trHoverFlag-');
                if($this.trMove && typeof  $this.trMove == 'function') $this.trMove({
                    tbodyBox: $this.mainTbodyBlock,
                    $this: isTr,
                    target:isTr,
                    e:e
                });
            }
            if(isTd){
                if($this.oldMoveTd && $this.oldMoveTd.moveId === isTd.moveId) return false;    //同一个
                var moveType = 'in';
                isTd.moveId = $this.randomString(6);
                if($this.oldMoveTd) $this.oldMoveTd.moveId = '';    //先去除移动ID
                $this.oldMoveTd = isTd;         //再去替换td                
                if($this.tdMove && typeof  $this.tdMove == 'function') $this.tdMove({
                    type: 'in',
                    tbodyBox: $this.mainTbodyBlock,
                    $this: isTd,
                    target:isTd,
                    e:e
                });
            }
        };
        if(this.tableMainBox) this.tableMainBox.addEventListener('click',function(e){   //if(this.tableMainBox) this.tableMainBox.onclick = function (e){
            var target = e.target;
            var isTd = $this.searchElement(target,'td','table');
            var isTr = $this.searchElement(target,'tr','table');
            var isTh = $this.searchElement(target,'th','table');
            if(isTr && !isTh){
                var fixedFlag = isTr.getAttribute('fixedFlag'+$this.randomStr),
                    index = isTr.getAttribute('indexval'),
                    hoverLabel = this.getElementsByClassName('-trClickFlag-'),
                    i = 0;
                while(hoverLabel[i]){
                    var oldClass = hoverLabel[i].className;
                    if(oldClass) oldClass = oldClass.replace(/-trClickFlag-/g,'');
                    hoverLabel[i].setAttribute('class',oldClass);
                    if(hoverLabel[i]) hoverLabel[i].className = oldClass;
                    i++;
                }
                if(fixedFlag){
                    var tr = $this.tbodyBlockElement.getElementsByTagName('tr')[index];
                    if(tr) $this.addClass(tr,'-trClickFlag-');
                }else{
                    if($this.fixedTbodyElement){
                        var fixedTr = $this.fixedTbodyElement.getElementsByTagName('tr')[index];
                        if(fixedTr) $this.addClass(fixedTr,'-trClickFlag-');
                    }
                }
                $this.addClass(isTr,'-trClickFlag-');
                if($this.trClick && typeof  $this.trClick == 'function'){
                    $this.trClick({
                        tbodyBox: $this.mainTbodyBlock,
                        $this: isTr,
                        target:isTr,
                        e:e
                    });
                }
            }
            if(isTd){
                if($this.tdClick && typeof  $this.tdClick == 'function'){
                    $this.tdClick({
                        tbodyBox: $this.mainTbodyBlock,
                        $this: isTd,
                        target:isTd,
                        e:e
                    });
                }
            }
            if(isTh){
                if($this.thClick && typeof  $this.thClick == 'function'){
                    $this.thClick({
                        tbodyBox: $this.mainTbodyBlock,
                        $this: isTh,
                        target:isTh,
                        e:e
                    });
                }
            }
        },false);
    },
    clearTd: function (param){
        this.trIndex = 0;
        if(this.fixedTbodyElement){ this.fixedTbodyElement.innerHTML = '';}
        if(this.tbodyBlockElement) this.tbodyBlockElement.innerHTML = '';
        this.mainTbodyBlock.scrollTop = 0;
        // this.mainTbodyBlock.scrollLeft = 0;
        this.mainTbodyBlock.oldScrollTop = 0;
        // this.mainTbodyBlock.oldScrollLeft = 0;
        this.oldHoverIndex = 0;
        if(param && typeof param.callback == 'function'){
            param.callback();
        }
    },
    randomString: function(len) {
        len = len || 6;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';
        var maxPos = $chars.length;
        var str = '';
        for (var i = 0; i < len; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str
    },
    tableType: function (){
        var me = this;
        me.thTrCreate(me.th);
    },
    init:function(){
        var me = this;
        this.randomStr = me.randomString(6);
        this.tableType();
    }
};
exports.definitionTable = function(param){
    return new DefinitionTable(param);
};