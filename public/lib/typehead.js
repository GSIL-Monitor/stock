function Typehead(el, options) {
    this.el = el;
    this.el.setAttribute('autocomplete', 'off');
    this.suggestions = [];
    this.selectedIndex = -1;
    this.currentValue = this.el.value;
    this.intervalId = 0;
    this.cachedResponse = [];
    this.onChangeInterval = null;
    this.ignoreValueChange = false;
    this.getDataFun = options.getDataFun;
    this.handleData = options.handleData;
    this.flag = options.flag || '';
    this.noSuggestionsContainer = null;
    this.submitEle = document.querySelector('.submitSearch'); //submit search button
    this._this = options._this;
    this.theme = options.theme?options.theme:'black';
    this.className = options.className?options.className:'';
    this.options = {
        autoSubmit: false,
        minChars: 1,
        maxHeight: 300,
        deferRequestBy: 0,
        width: 0,
        highlight: true,
        getDataFun: null,
        handleData: null,
        delimiter: null,
        itmeConut: null,
        orientation: null,
        showNoSuggestionNotice: true,
        noSuggestionNotice: '未找到符合条件的结果',
        zIndex: 99999,
        showValueParam: null,
        reag: true,
        autoSelect:false
    };
    this.initialize();
    this.setOptions(options);
}

Typehead.prototype = {
    killerFn: null,
    initialize: function() {
        var me, uid, typeheadElId;
        me = this;
        uid = Math.floor(Math.random() * 0x100000).toString(16);
        typeheadElId = 'Typehead_' + uid;
        this.killerFn = function() {
            me.killSuggestions();
            me.disableKillerFn();
        };
        if (!this.options.width) {
            this.options.width = this.el.offsetWidth;
        }
        this.mainContainerId = 'TypeheadContainter_' + uid;
        var child = document.createElement('div');
        child.id = this.mainContainerId;
        child.style.position = 'absolute';
        child.style.zIndex = '9999';
        child.innerHTML = '<ul name="__DROPSEARCH" class="typehead '+this.flag+' '+this.theme+' '+this.className+'" id="' + typeheadElId + '" style="display:none;"></ul>';
        document.body.appendChild(child)
        this.container = document.querySelector('#' + typeheadElId);
        this.noSuggestionsContainer = document.createElement('li');
        this.noSuggestionsContainer.className = 'autocomplete-no-suggestion';
        this.noSuggestionsContainer.innerHTML =this.options.noSuggestionNotice;
        this.fixPosition();
        if (window.opera) {
            this.el.onkeypress = function(e) {
                me.onKeyPress(e);
            };
            //fix opera don't supprot keyup event
            this.el.onfocus = function() {
                this.onChangeInterval = setInterval(function() {
                    if (me.currentValue !== me.el.value) {
                        me.onValueChange();
                    }
                }, me.options.deferRequestBy);
            };
            this.el.onblur = function() {
                clearInterval(this.onChangeInterval);
            };
        } else {
            this.el.onkeydown = function(e) {
                me.onKeyPress(e);
            };

        }
        //			this.el.keypress(function (e) {
        //				me.onKeyPress(e);
        //			});
        if(navigator.userAgent.indexOf('GO-GOAL')){
            this.el.oninput = function(e) {
                me.onKeyUp(e);
            };
        }else{
            this.el.onkeyup = function(e) {
                me.onKeyUp(e);
            };
        }
        this.el.onblur = function() {
            me.enableKillerFn();
        };
        this.el.onfocus = function() {
            me.fixPosition();
            me.el.value = '';
            me.options.onSelect({clear:true});
        };
        if(!this.submitEle){
            return;
        }
        this.submitEle.onclick = function(e) {
            if (me.selectedIndex >= 0) {
                me.select(me.selectedIndex, e,true);
            } else {
                var $typehead = document.querySelector('ul.typehead');
                if (!me.el.value || $typehead.querySelectorAll('.selected').length < 1) {
                    me.options.onSelect({},true);
                    return false;
                } else {
                    var typeHeadItem = $typehead.querySelector('.selected'),
                        dataItem = {};
                    dataItem.name = typeHeadItem.getAttribute('data-name')?typeHeadItem.getAttribute('data-name'):typeHeadItem.getAttribute('title');
                    dataItem.stock_code = typeHeadItem.getAttribute('code');
                    dataItem.source = typeHeadItem.getAttribute('source');
                    dataItem.symbol_type = typeHeadItem.getAttribute('symbol_type');
                    me.options.onSelect(dataItem,true);
                }
            }

        }
    },

    setOptions: function(options) {
        var o = this.options;
        for(var key in options){
            o[key] = options[key];
        }
        document.querySelector('#' + this.mainContainerId).style.zIndex = o.zIndex;
        this.container.style.maxHeight = o.maxHeight + 'px';
        this.container.style.width = o.width;
    },

    clearCache: function() {
        this.cachedResponse = [];
        window.sessionStorage.clear();
    },

    disable: function() {
        this.disabled = true;
    },

    enable: function() {
        this.disabled = false;
    },
    getAbsoluteTop:function(){
        var ele = this.el;
        var rtn = ele.offsetTop;
        var o = ele.offsetParent;
        while(o!=null)
        {
            rtn += o.offsetTop;
            o = o.offsetParent;
        }
        return rtn;
    },
    getAbsoluteLeft:function(){
        var ele = this.el;
        var rtn = ele.offsetLeft;
        var o = ele.offsetParent;
        while(o!=null)
        {
            rtn += o.offsetLeft;
            o = o.offsetParent;
        }
        return rtn;
    },
    fixPosition: function() {
        var top = this.getAbsoluteTop();
        var left = this.getAbsoluteLeft();
        var container = document.querySelector('#' + this.mainContainerId);
        if (this.options.orientation === 'top') {
            //console.log(this.container.outerHeight());
            container.style.top = (top - this.container.outerHeight) + 'px';
            container.style.top = left + 'px';
        } else {
            container.style.left = left+3+'px';
            container.style.top = top + 8 + 'px';
        }

    },

    enableKillerFn: function() {
        var me = this;
        document.addEventListener('click', me.killerFn);
    },

    disableKillerFn: function() {
        var me = this;
        document.removeEventListener('click', me.killerFn);
    },

    killSuggestions: function() {
        var me = this;
        this.stopKillSuggestions();
        this.intervalId = window.setInterval(function(){
            me.hide();
            me.stopKillSuggestions();
        }, 300);
    },

    stopKillSuggestions: function() {
        window.clearInterval(this.intervalId);
    },

    onKeyPress: function(e) {
        var keyCode;
        if (window.event) {
            keyCode = event.keyCode;
        } else if (e.which) {
            keyCode = e.which;
        }
        if (this.disabled || !this.enabled) {
            //enter键搜索
            if(keyCode == 13){
                this.submitEle && this.submitEle.click();
            }
            return;
        }
        // return will exit the function
        // and event will not be prevented
        switch (keyCode) {
            case 27: //KEY_ESC:
                this.el.value = this.currentValue;
                this.hide();
                break;
            case 9: //KEY_TAB:
            case 13: //KEY_RETURN:
                if (this.selectedIndex === -1) {
                    this.hide();
                    return;
                }
                this.select(this.selectedIndex);
                if (keyCode === 9) {
                    return;
                }
                break;
            case 38: //KEY_UP:
                this.moveUp();
                break;
            case 40: //KEY_DOWN:
                this.moveDown();
                break;
            default:
                return;
        }
        e.stopImmediatePropagation();
        e.preventDefault();
    },

    onKeyUp: function(e) {
        if (this.disabled) {
            return;
        }
        switch (e.keyCode) {
            case 38: //KEY_UP:
            case 40: //KEY_DOWN:
                return;
        }
        clearInterval(this.onChangeInterval);
        //			if (this.currentValue !== this.el.val()) {
        //				if (this.options.deferRequestBy > 0) {
        //					// Defer lookup in case when value changes very quickly:
        //					var me = this;
        //					this.onChangeInterval = setInterval(function () {
        //						me.onValueChange();
        //					}, this.options.deferRequestBy);
        //				} else {
        //					this.onValueChange();
        //				}
        //			}
        if (this.options.deferRequestBy > 0) {
            // Defer lookup in case when value changes very quickly:
            var me = this;
            this.onChangeInterval = setInterval(function() {
                me.onValueChange();
            }, this.options.deferRequestBy);
        } else {
            this.onValueChange();
        }
        window.onresize = function(){
            me.fixPosition();
        };
    },

    onValueChange: function() {
        clearInterval(this.onChangeInterval);
        this.currentValue = this.el.value;
        var q = this.getQuery(this.currentValue);
        //			this.selectedIndex = -1;
        this.selectedIndex = 0;
        if (this.ignoreValueChange) {
            this.ignoreValueChange = false;
            return;
        }
        if (this.options.reag) {
            //除了拼音，数字和汉子，输入其他任意字符都不掉api接口
            var reag = /^[0-9a-zA-Z\u4e00-\u9fa5\s]+$/;
            for (var i = 0; i < q.length; i++) {
                if (!reag.test(q.charAt(i))) {
                    this.noSuggestions();
                    this.suggestions = [];//清理上一个数据 避免第一次添加成功后 输入非法字符会读取上一个的数据
                    return;
                };
            }
        }

        if (q === '' || q.length < this.options.minChars) {
            this.options.onSelect({});
            this.hide();
        } else {
            this.getSuggestions(q);
        }
    },

    getQuery: function(val) {
        var d, arr;
        d = this.options.delimiter;
        if (!d) {
            return val.trim();
        }
        arr = val.split(d);
        return arr[arr.length - 1].trim();
    },

    getSuggestions: function(q) {
        var cr, me;
        if (window.sessionStorage && !(typeof(JSON) == "undefined")) {
            cr = sessionStorage.getItem(q) ? JSON.parse(sessionStorage.getItem(q)) : '';
        } else {
            cr = this.cachedResponse[q];
        }
        if (cr && cr.suggestions instanceof Array) {
            this.suggestions = cr.suggestions;
            this.suggest();
        } else {
            me = this;
            var responseData = this.getDataFun({
                _this:this._this,
                options:{
                    key:q
                },
                callback0:function(res){
                    if (!res.body.data) {
                        me.hide();
                        return;
                    } else {
                        me.processResponse(res.body.data);
                    }
                },
                callback1001:function(){
                    var tempData = [];
                    me.processResponse(tempData);
                }
            })
        }
    },

    hide: function() {
        this.enabled = false;
        this.selectedIndex = -1;
        this.container.style.display = 'none';
    },

    suggest: function() {
        if (this.suggestions.length === 0) {
            if (this.options.showNoSuggestionNotice) {
                this.noSuggestions();
            } else {
                this.hide();
            }
            return;
        } else {
            var me, len, item, f, v, i, s, mOver, mClick;
            me = this;
            console.log(this.options.itmeConut);
            len = this.options.itmeConut && this.suggestions.length > this.options.itmeConut ? this.options.itmeConut : this.suggestions.length;
            v = this.getQuery(this.currentValue);
            mOver = function(xi) {
                return function() {
                    me.activate(xi);
                };
            };
            mClick = function(xi) {
                return function() {
                    me.select(xi);
                };
            };
            this.container.style.display = 'none';
            this.container.innerHTML='';
            for (var i = 0; i < len; i++) {
                var item = this.handleData(this.suggestions[i], i, me.selectedIndex);
                item.onmouseover= mOver(i);
                item.onclick = mClick(i);
                this.container.appendChild(item);
            }
            this.enabled = true;
            this.fixPosition();
            this.container.style.display = 'block';
        }

    },
    noSuggestions: function() {
        var that = this,
            container = that.container,
            noSuggestionsContainer = that.noSuggestionsContainer;
        noSuggestionsContainer.remove();
        container.innerHTML = ''; // clean suggestions if any
        //console.log(noSuggestionsContainer);
        container.appendChild(noSuggestionsContainer);
        that.enabled = true;
        that.fixPosition();
        this.container.style.display = 'block';
        this.options.onSelect({});
    },
    processResponse: function(data) {
        var response, passQuery;
        try {
            response = data;
            //response = eval('(' + data + ')');
        } catch (err) {
            return;
        }
        passQuery = this.currentValue;
        //add html5 session storge
        if (!this.options.noCache) {
            if (window.sessionStorage && !(typeof(JSON) == "undefined")) {
                sessionStorage[passQuery] = JSON.stringify(response);
            } else {
                this.cachedResponse[passQuery] = response;
            }
        }
        this.suggestions = response;

        this.suggest();
    },

    activate: function(index) {
        var items, activeItem;
        items = this.container.children;
        // Clear previous selection:
        if (this.selectedIndex !== -1 && items.length > this.selectedIndex) {
            items[this.selectedIndex].className = '';
        }
        this.selectedIndex = index;
        if (this.selectedIndex !== -1 && items.length > this.selectedIndex) {
            activeItem = items[this.selectedIndex];
            activeItem.classList.add('selected');
        }
        this.el.value = activeItem.getAttribute('data-name')?activeItem.getAttribute('data-name'):activeItem.getAttribute('title');
        // // new
        if(this.options.autoSelect){
            this.onSelect(index);
        }
        return activeItem;
    },

    deactivate: function(li, index) {
        li.className = '';
        if (this.selectedIndex === index) {
            this.selectedIndex = -1;
        }
    },

    select: function(i, e,search) {
        var selectedValue, f;
        if (!this.suggestions[i]) {
            this.ignoreValueChange = true;
            this.hide();
            return false;
        }
        selectedValue = this.suggestions[i][this.options.showValueParam];
        if (selectedValue) {
            this.el.value = selectedValue;
//                this.ignoreValueChange = true;
            this.ignoreValueChange = false;
            this.hide();
            this.onSelect(i,search);
        }
    },

    moveUp: function() {
        if (this.selectedIndex === -1) {
            return;
        }
        if (this.selectedIndex === 0) {
            this.container.children[0].className = '';
            this.selectedIndex = -1;
            this.el.value = (this.currentValue);
            return;
        }
        this.activate(this.selectedIndex - 1);
    },

    moveDown: function() {
        var itemlen =Math.min(this.options.itmeConut , this.suggestions.length); // this.options.itmeConut || this.suggestions.length;
        if (this.selectedIndex === (itemlen - 1)) {
            return;
        }
        this.activate(this.selectedIndex + 1);
    },

    onSelect: function(i,search) {

        var me, fn, s;
        me = this;
        fn = me.options.onSelect;
        s = me.suggestions[i];
        if (fn instanceof Function) {
            fn(s, search);
        }
    }
};
export default Typehead;
