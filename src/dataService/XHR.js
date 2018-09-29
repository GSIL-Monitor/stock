import axios from 'axios'
import qs from 'qs'
import {
    relogin,
} from '@c/utils/callQt'

const CancelToken = axios.CancelToken;
const promiseList = {}
const cancelArray = []

// axios default config
axios.defaults.baseURL = '/api/'
axios.defaults.timeout = 10000
axios.defaults.headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
}

//去除 passed = true 重新登录
const revertPassed = () => {
    const STORAGE_USER = 'stock-user'
    let userInfo = localStorage.getItem(STORAGE_USER)
    userInfo = userInfo ? JSON.parse(userInfo) : {}
    userInfo.passed = false
    localStorage.setItem(STORAGE_USER, JSON.stringify(userInfo))
}

const errorHandler = () => {
    const errMap = {
        400() {},
        401() {},
        405() {
            errMap['1100']()
        },
        1009() { /* alert('您的电脑系统时间不正确,请修改！') */},
        1100() {
            /* token失效 */
            revertPassed()
            if (Object.is(location.hostname, 'localhost')) {
                location.href = location.origin //回到登录页
            }
            relogin()
        },
        1101() {},
    }

    return errMap
}
const handler = errorHandler()
const errorCodeArray = Reflect.ownKeys(handler).map(n => Number(n))

// 拦截请求
axios.interceptors.request.use(config => {
    // 发起请求时，取消掉当前正在进行的相同请求(同一个 api 不验证参数)
    if (cancelArray.length) {
        cancelArray.forEach((canCelFunc) => {
            canCelFunc('Operation canceled by the user.')
        })

        cancelArray.length = 0
    }

    return config
}, error => {
    return Promise.reject(error)
})

// 拦截响应
axios.interceptors.response.use(response => {
    // 错误处理
    let code = response.data.code
    if (errorCodeArray.includes(code)) {
        Reflect.get(handler, code)()
    }
    return response
}, error => {
    return Promise.resolve(error)
})

const dealResponseData = (data, param) => {
    const code = Reflect.get(data, 'code')
    const callback0 = 'callback0'
    const callbac1001 = 'callbac1001'
    const completeName = 'afterResponse'

    if (Object.is(code, 0) && Reflect.has(param, callback0)) {
        Reflect.get(param, callback0)(Reflect.get(data, 'data'))
    }
    if (Object.is(code, 1001) && Reflect.has(param, callbac1001)) {
        Reflect.get(param, callbac1001)()
    }
    if (Reflect.has(param, completeName)) {
        Reflect.get(param, completeName)()
    }
}

const promise = (url = '', param, type = 'get') => {
    return new Promise((resolve, reject) => {
        let options = Reflect.get(param, 'options')

        const axiosParams = {
            method: type,
            cancelToken: new CancelToken(c => {
                if (Reflect.has(promiseList, url)) {
                    cancelArray.push(promiseList[url])
                }
                promiseList[url] = c
            }),
        }

        if (Object.is(type, 'get')) {
            Object.assign(axiosParams, {
                // url: `${url}?${qs.stringify(options)}`,
                url,
                params: options,
            })
        } else if (Object.is(type, 'post')) {
            Object.assign(axiosParams, {
                url,
                data: qs.stringify(options),
            })
        }

        axios(axiosParams)
            .then(response => {
                if (!response) return
                let data = Reflect.get(response, 'data')
                // 被取消的操作不会有 data
                if (!data) return
                dealResponseData(data, param)
                resolve(data)
            })
            .catch((error) => {
                console.error(url, param)
                console.error(error)
                // reject(error)
            })
    })
}

const get = (url, param) => {
    return promise(url, param)
}

const post = (url, param) => {
    return promise(url, param, 'post')
}

export {
    get,
    post,
}
