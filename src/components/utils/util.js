const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = function(obj, key) {
    return hasOwnProperty.call(obj, key)
}

function extend(to, _from) {
    for (let key in _from) {
        to[key] = _from[key]
    }
    return to
}

export const toObject = function(arr) {
    var res = {}
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
            extend(res, arr[i])
        }
    }
    return res
}

export const changeUrlParam = function(key, value) {
    var href = window.location.href
    var pattern = new RegExp('[&?]' + key + '((=[^&#]*)|(&|#|$))')
    var matcher = href.match(pattern)
    if (matcher) {
        var matcherValue = matcher[0]
        var replaceValue
        if (matcherValue.indexOf('&') === 0) {
            replaceValue = '&' + key + '=' + value
        } else {
            replaceValue = '?' + key + '=' + value
        }
        if (['&', '#'].indexOf(matcherValue.charAt(matcherValue.length - 1)) > -1) {
            replaceValue += matcherValue.substring(matcherValue.length - 1, matcherValue.length)
        }
        history.pushState('', '', href.replace(pattern, replaceValue))
    }
}

/**
 * 频率控制 函数连续调用时，func 执行频率限定为 1 次 / time
 *
 * @param  {function}   fn      传入函数
 * @param  {number}     time      表示时间窗口的间隔
 * @return {function}             返回调用函数
 */
export const throttle = function(fn, time) {
    let _self = fn,
        timer,
        firstTime = true

    return function() {
        let args = arguments,
            _me = this

        if (firstTime) {
            _self.apply(_me, args)
            return (firstTime = false)
        }

        if (timer) {
            return false
        }

        timer = setTimeout(function() {
            clearTimeout(timer)
            timer = null
            _self.apply(_me, args)
        }, time || 500)
    }
}

/**
 * 空闲控制 函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} fn        传入函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @return {function}             返回客户调用函数
 */
export const debounce = function(fn, wait) {
    var timer = null
    return function() {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn()
        }, wait)
    }
}

/**
 * 修改url中的queryString部分
 * @param queryString
 * @param isAppend 是否追加 true 追加，false 替换
 */
export const changeQueryString = function(queryString, isAppend) {
    var search = window.location.search
    if (search === '') {
        search = '?' + queryString
    } else {
        if (!isAppend) {
            search = '?' + queryString
        } else {
            search += '&' + queryString
        }
    }
    var newHref =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        search +
        window.location.hash
    history.pushState('', '', newHref)
}

//获取HTTP GET请求参数
export const getUrlParam = function(key) {
    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
    var value = window.location.search.substr(1).match(reg)
    if (value !== null) {
        return decodeURIComponent(value[2])
    }
    return null
}

//判断变量是否为空
export const isVariableBlank = function(variable) {
    var str = /^ /
    if (variable) {
        variable = variable.replace(str, '')
    }
    if (variable === 0 || variable === '0') {
        return false
    }
    return (
        variable == null ||
        variable == undefined ||
        variable == 'null' ||
        variable == 'undefined' ||
        variable == '' ||
        variable == '[]' ||
        variable == []
    )
}

export const getCookie = function(name, encodeUrl) {
    if (!name) {
        var name = 'ton'
    }
    var arr,
        reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if ((arr = document.cookie.match(reg))) {
        if (encodeUrl) {
            //不需要unescape方式的解码 解码方式方式不对
            return arr[2]
        } else {
            return unescape(arr[2])
        }
    } else {
        return null
    }
}

//数据处理
export const dataFixed = function(params, unit, type) {
    var dataResult
    // var str = /^[-]?[0-9]+.?[0-9]*$/;str.test(params)
    // console.log((!isNaN(parseFloat(params)) || !isNaN(parseInt(params))));
    if (!isNaN(parseFloat(params)) || !isNaN(parseInt(params)) || params == 0) {
        if (unit === '%') {
            dataResult = Number(params * 100).toFixed(2) + '%'
        } else if (unit === '%2f') {
            dataResult = Number(params).toFixed(2) + '%'
        } else if (unit === ',') {
            dataResult = parseFloat(Number(params).toFixed(0)).toLocaleString()
        } else {
            dataResult = Number(params).toFixed(2)
            // dataResult = Number(params + 10).toFixed(2);
            // dataResult = Number(dataResult - 10).toFixed(2);
        }
    } else if (
        params == null ||
        params == undefined ||
        params == 'null' ||
        params == 'undefined' ||
        params == '' ||
        params == '[]' ||
        params == []
    ) {
        //(params == null || params == undefined || params == "null" || params == "undefined" || params == "" || params == '[]' || params == [])
        dataResult = '--'
    } else {
        dataResult = params
    }
    return dataResult
}

export const getToken = function() {
    const reg = new RegExp('(^| )token=([^;]*)(;|$)')
    const arr = document.cookie.match(reg)
    if (arr.length > 0) {
        return decodeURIComponent(arr[2])
    } else {
        return null
    }
}

/**
 * 四舍六入五成双
 * @param {number} num 待处理数字
 * @param {number} decimalPlaces 保留位数
 * @return {number}
*/
export const evenRound = (num, decimalPlaces) => {
    let d = decimalPlaces || 0
    let m = Math.pow(10, d)
    let n = +(d ? num * m : num).toFixed(8) // Avoid rounding errors
    let i = Math.floor(n),
        f = n - i
    let e = 1e-8 // Allow for rounding errors in f
    let r = f > 0.5 - e && f < 0.5 + e ? (i % 2 == 0 ? i : i + 1) : Math.round(n)
    return d ? r / m : r
}

// /**
//  * @description 判断是否有自选股缓存
// */
// export const hasMyStockCache = () => {
//     const MYSTOCK_CACHE = 'mystock_cache'
//     const cache = getCookie(MYSTOCK_CACHE)

//     return Object.is(String(cache), '1')
// }

export const isZyzt = () => {
    const ZYZT = 'zyzt'
    return navigator
                .userAgent
                .toLowerCase()
                .includes(ZYZT)
}

export const isZytg = () => {
    const ZYTG = 'zytg'
    return navigator
            .userAgent
            .toLowerCase()
            .includes(ZYTG)
}

// 智投、投顾，是否是内部用户
export const isInnerUser = ()=> {
    let user_type = getCookie('userType')
    let is_inner = user_type ? JSON.parse(user_type).is_inner : 0

    return Object.is(String(is_inner), '1')
}

/**
 * @description 研报产品线参数
*/
export const getReportLine = () => {
    if (isZyzt()) {
        return 28
    } else if (isZytg()) {
        return 901
    } else {
        return 4
    }
}

/**
 * @description 添加自选股api参数
*/
export const getMyStockLine = () => {
    if (isZyzt()
        || isZytg()
    ) {
        return 19
    }
}

const hostSome = (arr) => {
    return arr.some(function(n) {
        return location.host.includes(n)
    })
}

const isProductionDomain = () => {
    const arr = ['66966', 'go-goal']

    // 部分沙盒域名不规范，含有 go-goal
    return hostSome(arr) && !isSandBoxDomain()
}

const isPreDomain = () => {
    const arr = ['pre']

    return hostSome(arr)
}

const isSandBoxDomain = () => {
    const arr = ['sandbox', 'test']

    return hostSome(arr)
}

const isLocalhostDomain = () => {
    return location.host.includes('localhost')
}

/**
 * @description 获取域名对应环境
*/
export const getEnvironment = () => {
    if (isProductionDomain()) {
        return 'pro'
    } else if (isPreDomain()) {
        return 'pre'
    } else if (isSandBoxDomain()) {
        return 'sandbox'
    } else if (isLocalhostDomain()) {
        return 'localhost'
    } else {
        return 'pro'
    }
}

/**
 * @description 获取远程主域地址
*/
export const getUrlDomain = () => {
    const env = getEnvironment()
    let protocol = location.protocol
    let port = protocol === 'https:' ? '8094' : '8093'

    if (Object.is(env, 'pro')) {
      return `${protocol}//zyzt.66966.cn`
    } else if (Object.is(env, 'pre')) {
      return `${protocol}//zyzt-pre.gofund.cn:${port}`
    } else if (Object.is(env, 'sandbox')) {
      return `${protocol}//zyzt-test.gofund.cn:${port}`
    } else if (Object.is(env, 'localhost')) {
      return `http://zyzt-pre.gofund.cn:8093`
    }
}
