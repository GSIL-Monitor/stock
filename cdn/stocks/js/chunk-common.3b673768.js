(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[1],{1927:function(t,e,n){"use strict";n.d(e,"a",function(){return o}),n.d(e,"i",function(){return r}),n.d(e,"d",function(){return c}),n.d(e,"b",function(){return s}),n.d(e,"g",function(){return i}),n.d(e,"c",function(){return a}),n.d(e,"k",function(){return u}),n.d(e,"j",function(){return d}),n.d(e,"f",function(){return f}),n.d(e,"e",function(){return l}),n.d(e,"h",function(){return y});n("386d"),n("a481"),n("4917"),n("3b2b"),n("551c"),n("097d");Object.prototype.hasOwnProperty;const o=function(t,e){var n=window.location.href,o=new RegExp("[&?]"+t+"((=[^&#]*)|(&|#|$))"),r=n.match(o);if(r){var c,s=r[0];c=0===s.indexOf("&")?"&"+t+"="+e:"?"+t+"="+e,["&","#"].indexOf(s.charAt(s.length-1))>-1&&(c+=s.substring(s.length-1,s.length)),history.pushState("","",n.replace(o,c))}},r=function(t){var e=new RegExp("(^|&)"+t+"=([^&]*)(&|$)"),n=window.location.search.substr(1).match(e);return null!==n?decodeURIComponent(n[2]):null},c=function(t,e){if(!t)t="ton";var n,o=new RegExp("(^| )"+t+"=([^;]*)(;|$)");return(n=document.cookie.match(o))?e?n[2]:unescape(n[2]):null},s=function(t,e,n){var o;return o=isNaN(parseFloat(t))&&isNaN(parseInt(t))&&0!=t?null==t||void 0==t||"null"==t||"undefined"==t||""==t||"[]"==t||t==[]?"--":t:"%"===e?Number(100*t).toFixed(2)+"%":"%2f"===e?Number(t).toFixed(2)+"%":","===e?parseFloat(Number(t).toFixed(0)).toLocaleString():Number(t).toFixed(2),o},i=function(){const t=new RegExp("(^| )token=([^;]*)(;|$)"),e=document.cookie.match(t);return e.length>0?decodeURIComponent(e[2]):null},a=(t,e)=>{let n=e||0,o=Math.pow(10,n),r=+(n?t*o:t).toFixed(8),c=Math.floor(r),s=r-c,i=1e-8,a=s>.5-i&&s<.5+i?c%2==0?c:c+1:Math.round(r);return n?a/o:a},u=()=>{const t="zyzt";return navigator.userAgent.toLowerCase().includes(t)},d=()=>{const t="zytg";return navigator.userAgent.toLowerCase().includes(t)},f=()=>{return u()?28:d()?901:4},l=()=>{if(u()||d())return 19},p=t=>{return t.some(function(t){return location.host.includes(t)})},_=()=>{const t=["66966","go-goal"];return p(t)&&!h()},g=()=>{const t=["pre"];return p(t)},h=()=>{const t=["sandbox","test"];return p(t)},v=()=>{return location.host.includes("localhost")},b=()=>{return _()?"pro":g()?"pre":h()?"sandbox":v()?"localhost":"pro"},y=()=>{const t=b();return Object.is(t,"pro")?"http://zyzt.66966.cn":Object.is(t,"pre")?"http://investpre.gofund.cn:8093":Object.is(t,"sandbox")?"http://investtest.gofund.cn:8093":Object.is(t,"localhost")?"http://investpre.gofund.cn:8093":void 0}},5071:function(t,e,n){"use strict";n("ac6a");var o={signal:1,propertyUpdate:2,init:3,idle:4,debug:5,invokeMethod:6,connectToSignal:7,disconnectFromSignal:8,setProperty:9,response:10},r=function(t,e){if("object"===typeof t&&"function"===typeof t.send){var n=this;this.transport=t,this.send=function(t){"string"!==typeof t&&(t=JSON.stringify(t)),n.transport.send(t)},this.transport.onmessage=function(t){var e=t.data;switch("string"===typeof e&&(e=JSON.parse(e)),e.type){case o.signal:n.handleSignal(e);break;case o.response:n.handleResponse(e);break;case o.propertyUpdate:n.handlePropertyUpdate(e);break;default:console.error("invalid message received:",t.data);break}},this.execCallbacks={},this.execId=0,this.exec=function(t,e){e?(n.execId===Number.MAX_VALUE&&(n.execId=Number.MIN_VALUE),t.hasOwnProperty("id")?console.error("Cannot exec message with property id: "+JSON.stringify(t)):(t.id=n.execId++,n.execCallbacks[t.id]=e,n.send(t))):n.send(t)},this.objects={},this.handleSignal=function(t){var e=n.objects[t.object];e?e.signalEmitted(t.signal,t.args):console.warn("Unhandled signal: "+t.object+"::"+t.signal)},this.handleResponse=function(t){t.hasOwnProperty("id")?(n.execCallbacks[t.id](t.data),delete n.execCallbacks[t.id]):console.error("Invalid response message received: ",JSON.stringify(t))},this.handlePropertyUpdate=function(t){for(var e in t.data){var r=t.data[e],c=n.objects[r.object];c?c.propertyUpdate(r.signals,r.properties):console.warn("Unhandled property update: "+r.object+"::"+r.signal)}n.exec({type:o.idle})},this.debug=function(t){n.send({type:o.debug,data:t})},n.exec({type:o.init},function(t){for(var r in t)new c(r,t[r],n);for(var r in n.objects)n.objects[r].unwrapProperties();e&&e(n),n.exec({type:o.idle})})}else console.error("The QWebChannel expects a transport object with a send function and onmessage callback property. Given is: transport: "+typeof t+", transport.send: "+typeof t.send)};function c(t,e,n){this.__id__=t,n.objects[t]=this,this.__objectSignals__={},this.__propertyCache__={};var r=this;function s(t,e){var c=t[0],s=t[1];r[c]={connect:function(t){"function"===typeof t?(r.__objectSignals__[s]=r.__objectSignals__[s]||[],r.__objectSignals__[s].push(t),e||"destroyed"===c||n.exec({type:o.connectToSignal,object:r.__id__,signal:s})):console.error("Bad callback given to connect to signal "+c)},disconnect:function(t){if("function"===typeof t){r.__objectSignals__[s]=r.__objectSignals__[s]||[];var i=r.__objectSignals__[s].indexOf(t);-1!==i?(r.__objectSignals__[s].splice(i,1),e||0!==r.__objectSignals__[s].length||n.exec({type:o.disconnectFromSignal,object:r.__id__,signal:s})):console.error("Cannot find connection of signal "+c+" to "+t.name)}else console.error("Bad callback given to disconnect from signal "+c)}}}function i(t,e){var n=r.__objectSignals__[t];n&&n.forEach(function(t){t.apply(t,e)})}function a(t){var e=t[0],c=t[1];r[e]=function(){for(var t,e=[],s=0;s<arguments.length;++s)"function"===typeof arguments[s]?t=arguments[s]:e.push(arguments[s]);n.exec({type:o.invokeMethod,object:r.__id__,method:c,args:e},function(e){if(void 0!==e){var n=r.unwrapQObject(e);t&&t(n)}})}}function u(t){var e=t[0],c=t[1],i=t[2];r.__propertyCache__[e]=t[3],i&&(1===i[0]&&(i[0]=c+"Changed"),s(i,!0)),Object.defineProperty(r,c,{configurable:!0,get:function(){var t=r.__propertyCache__[e];return void 0===t&&console.warn('Undefined value in property cache for property "'+c+'" in object '+r.__id__),t},set:function(t){void 0!==t?(r.__propertyCache__[e]=t,n.exec({type:o.setProperty,object:r.__id__,property:e,value:t})):console.warn("Property setter for "+c+" called with undefined value!")}})}for(var t in this.unwrapQObject=function(t){if(t instanceof Array){for(var e=new Array(t.length),o=0;o<t.length;++o)e[o]=r.unwrapQObject(t[o]);return e}if(!t||!t["__QObject*__"]||void 0===t.id)return t;var s=t.id;if(n.objects[s])return n.objects[s];if(t.data){var i=new c(s,t.data,n);return i.destroyed.connect(function(){if(n.objects[s]===i){delete n.objects[s];var t=[];for(var e in i)t.push(e);for(var o in t)delete i[t[o]]}}),i.unwrapProperties(),i}console.error("Cannot unwrap unknown QObject "+s+" without data.")},this.unwrapProperties=function(){for(var t in r.__propertyCache__)r.__propertyCache__[t]=r.unwrapQObject(r.__propertyCache__[t])},this.propertyUpdate=function(t,e){for(var n in e){var o=e[n];r.__propertyCache__[n]=o}for(var c in t)i(c,t[c])},this.signalEmitted=function(t,e){i(t,e)},e.methods.forEach(a),e.properties.forEach(u),e.signals.forEach(function(t){s(t,!1)}),e.enums)r[t]=e.enums[t]}var s=r;n.d(e,"c",function(){return d}),n.d(e,"g",function(){return f}),n.d(e,"d",function(){return l}),n.d(e,"f",function(){return p}),n.d(e,"e",function(){return _}),n.d(e,"b",function(){return g}),n.d(e,"a",function(){return h});let i=[];const a=function(){let t;while(t=i.shift())u.apply(null,t);i=null};"undefined"!==typeof qt&&new s(qt.webChannelTransport,function(t){window.top.webMsg=t.objects.webMsg,a()});const u=function(t,...e){if("undefined"!==typeof qt&&!window.top.webMsg)return void i.push(arguments);const n=window.top[t]||window.top.webMsg[t];n?n.apply(null,e):console.warn("Qt function not found: %s",t)},d=(t,e,n)=>{u("DownloadFile",t,e,n)},f=(t,e,n,o)=>{u("SendEvent",t,e,n,o)},l=function(t){u("OpenPopWindow",t)},p=function(){u("Relogin")},_=function(t,e){u("SubscriptionMarketData",t,e)},g=function(t){u("UnSubscriptionMarketDate",t)},h=function(t){u("JsToQtEventInterface",t)}},"52a1":function(t,e,n){"use strict";var o=n("bc3a"),r=n.n(o),c=n("4328"),s=n.n(c),i=n("5071");const a=r.a.CancelToken,u={},d=[],f="Operation canceled by the user.";r.a.defaults.baseURL="/api/",r.a.defaults.timeout=1e4,r.a.defaults.headers={"Content-Type":"application/x-www-form-urlencoded; charset=utf-8"};const l=()=>{const t="stock-user";let e=localStorage.getItem(t);e=e?JSON.parse(e):{},e.passed=!1,localStorage.setItem(t,JSON.stringify(e))},p=()=>{const t={400(){},401(){},405(){t["1100"]()},1009(){},1100(){l(),Object.is(location.hostname,"localhost")&&(location.href=location.origin),Object(i["f"])()},1101(){}};return t},_=p(),g=Reflect.ownKeys(_).map(t=>Number(t));r.a.interceptors.request.use(t=>{return d.length&&(d.forEach(t=>{t(f)}),d.length=0),t},t=>{return Promise.resolve(t)}),r.a.interceptors.response.use(t=>{let e=t.data.code;return g.includes(e)&&Reflect.get(_,e)(),t},t=>{return Promise.resolve(t)});const h=(t,e)=>{const n=Reflect.get(t,"code"),o="callback0",r="callback1001",c="afterResponse";Object.is(n,0)&&Reflect.has(e,o)&&Reflect.get(e,o)(Reflect.get(t,"data")),Object.is(n,1001)&&Reflect.has(e,r)&&Reflect.get(e,r)(),Reflect.has(e,c)&&Reflect.get(e,c)()},v=(t,e,n)=>{const o={method:e,cancelToken:new a(e=>{Reflect.has(u,t)&&d.push(u[t]),u[t]=e})};return Object.is(e,"get")?Object.assign(o,{url:t,params:n}):Object.is(e,"post")&&Object.assign(o,{url:t,data:s.a.stringify(n)}),o},b=(t="",e,n="get")=>{return new Promise((o,c)=>{const s=Reflect.get(e,"options"),i=v(t,n,s);r()(i).then(t=>{if(Object.is(t.message,f))return!1;const n=Reflect.get(t,"data");h(n,e),o(n)}).catch(n=>{console.error(t,e),console.error(n)})})},y=(t,e)=>{return b(t,e)},k=(t,e)=>{return b(t,e,"post")};var w=n("1927");n.d(e,"O",function(){return m}),n.d(e,"L",function(){return j}),n.d(e,"v",function(){return O}),n.d(e,"x",function(){return R}),n.d(e,"h",function(){return x}),n.d(e,"I",function(){return S}),n.d(e,"u",function(){return C}),n.d(e,"p",function(){return E}),n.d(e,"j",function(){return N}),n.d(e,"f",function(){return P}),n.d(e,"o",function(){return q}),n.d(e,"F",function(){return U}),n.d(e,"a",function(){return M}),n.d(e,"w",function(){return I}),n.d(e,"b",function(){return F}),n.d(e,"d",function(){return z}),n.d(e,"s",function(){return J}),n.d(e,"g",function(){return Q}),n.d(e,"K",function(){return T}),n.d(e,"J",function(){return A}),n.d(e,"y",function(){return L}),n.d(e,"D",function(){return B}),n.d(e,"t",function(){return D}),n.d(e,"i",function(){return $}),n.d(e,"E",function(){return G}),n.d(e,"B",function(){return K}),n.d(e,"M",function(){return V}),n.d(e,"m",function(){return W}),n.d(e,"G",function(){return H}),n.d(e,"H",function(){return X}),n.d(e,"r",function(){return Y}),n.d(e,"A",function(){return Z}),n.d(e,"n",function(){return tt}),n.d(e,"q",function(){return et}),n.d(e,"l",function(){return nt}),n.d(e,"k",function(){return ot}),n.d(e,"N",function(){return rt}),n.d(e,"z",function(){return ct}),n.d(e,"C",function(){return st}),n.d(e,"e",function(){return it}),n.d(e,"R",function(){return at}),n.d(e,"c",function(){return ut}),n.d(e,"P",function(){return dt}),n.d(e,"Q",function(){return ft});const m=t=>{const e="v1/user/login";return y(e,t)},j=t=>{const e="v1/zt/get_stock_tags";return y(e,t)},O=(t={})=>{const e="v1/mystock/get_group";return Reflect.set(t.options,"token",Object(w["g"])()),y(e,t)},R=(t={})=>{const e="v1/mystock/mystock_list";return Reflect.set(t.options,"token",Object(w["g"])()),y(e,t)},x=t=>{const e="v1/zt/get_stock_discount";return y(e,t)},S=t=>{const e="v1/zt/get_stock_buoy";return y(e,t)},C=t=>{const e="v1/stock/data";return y(e,t)},E=t=>{const e="v1/hq/details";return y(e,t)},N=t=>{const e="v1/hq/fund_data";return y(e,t)},P=t=>{const e="v1/hq/bond_data";return y(e,t)},q=t=>{const e="v1/hq/hk_data";return y(e,t)},U=t=>{const e="v1/zt/get_dm_con_sensus";return y(e,t)},M=(t={})=>{const e="v1/mystock/add_recent";return Reflect.set(t.options,"token",Object(w["g"])()),k(e,t)},I=t=>{const e="v1/mystock/get_isdefined";return Reflect.set(t.options,"token",Object(w["g"])()),y(e,t)},F=t=>{const e="v1/mystock/add";return Reflect.set(t.options,"token",Object(w["g"])()),Reflect.set(t.options,"source",Object(w["e"])()),k(e,t)},z=t=>{const e="v1/mystock/delete_stocks";return Reflect.set(t.options,"token",Object(w["g"])()),k(e,t)},J=(t={})=>{const e="v1/hq/get_stock_plate_component";return Reflect.set(t.options,"token",Object(w["g"])()),y(e,t)},Q=t=>{const e="v1/stock/get_tag_v2";return y(e,t)},T=(t={})=>{const e="v1/user/get_visit_recent";return Reflect.set(t.options,"token",Object(w["g"])()),y(e,t)},A=(t={})=>{const e="v1/news/get_newmystock_info";return Reflect.set(t.options,"token",Object(w["g"])()),y(e,t)},L=(t={})=>{const e="v1/announcement/get_stock_new_announcement_list";return Reflect.set(t.options,"token",Object(w["g"])()),y(e,t)},B=(t={})=>{const e="v1/report/search";return Reflect.set(t.options,"token",Object(w["g"])()),Reflect.set(t.options,"product_line",Object(w["f"])()),y(e,t)},D=t=>{const e="v1/news/get_investment_qa";return y(e,t)},$=t=>{const e="v1/stock/get_announcement_notice";return y(e,t)},G=t=>{const e="v1/stock/get_same_industry_stock_data";return y(e,t)},K=t=>{const e="v1/stock/get_associated_varieties";return y(e,t)},V=t=>{const e="v1/hq/get_transaction";return y(e,t)},W=t=>{const e="v1/hq/get_transaction_hk";return y(e,t)},H=t=>{const e="v1/hq/get_stock_history_dynamic";return y(e,t)},X=t=>{const e="v1/stock/get_hq_header_list";return y(e,t)},Y=t=>{const e="v1/hq/list";return y(e,t)},Z=t=>{const e="v1/hq/fullcodes";return y(e,t)},tt=(t={})=>{const e="v1/news/get_ask_news_info";return Reflect.set(t.options,"token",Object(w["g"])()),y(e,t)},et=(t={})=>{const e="v1/announcement/search_new_announcement";return Reflect.set(t.options,"token",Object(w["g"])()),y(e,t)},nt=(t={})=>{const e="v1/news/get_hk_newmystock_info";return Reflect.set(t.options,"token",Object(w["g"])()),y(e,t)},ot=t=>{const e="v1/stock/get_hk_same_industry_stock_data";return y(e,t)},rt=t=>{const e="v1/hq/is_edate";return y(e,t)},ct=t=>{const e="v1/announcement/get_announcement_file_url";return y(e,t)},st=t=>{const e="v1/gpoints/get_gpoint_report_read";return Reflect.set(t.options,"product_line",Object(w["f"])()),y(e,t)},it=t=>{const e="v1/gpoints/add_report_read_record";return y(e,t)},at=t=>{const e="v1/userop/add";return k(e,t)},ut=t=>{const e="v1/renew/sendsmsmail";return y(e,t)},dt=t=>{const e="v1/news/read_mark";return Reflect.set(t.options,"token",Object(w["g"])()),Reflect.set(t.options,"type",8),y(e,t)},ft=t=>{const e="v1/report/marks";return Reflect.set(t.options,"token",Object(w["g"])()),Reflect.set(t.options,"type",11),y(e,t)}},d569:function(t,e,n){"use strict";var o=n("1927");const r=window.goGoal||{},c=t=>{const e="w",n="skin_white";Object.is(t,e)?document.documentElement.classList.add(n):document.documentElement.classList.remove(n)};r.detectSelectedTheme=(()=>{let t=Object(o["d"])("skin");c(t)}),r.changeTheme=(t=>{c(t)}),r.event=function(){var t,e,n,o={};return t=function(t,e){o[t]||(o[t]=[]),o[t].push(e)},e=function(){var t=[].shift.call(arguments),e=o[t];if(!e||0===e.length)return!1;for(var n,r=0;n=e[r++];)n.apply(this,arguments)},n=function(t,e){var n=o[t];if(!n)return!1;if(e)for(var r=n.length-1;r>=0;r--){var c=n[r];c===e&&n.splice(r,1)}else n&&(n.length=0)},{listen:t,trigger:e,remove:n}}(),r.event.listen("reloadPage",()=>{location&&location.reload()}),r.subEvent=function(t,e){switch(t){case"keyboardPress":r.event.trigger("keyBoardEvent",e);break;default:r.event.trigger(t,e);break}},r.closeSocket=(()=>{}),r.creatNewSocket=(()=>{}),e["a"]=r}}]);