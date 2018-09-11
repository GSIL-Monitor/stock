import axios from 'axios'
import qs from 'qs'
import {
    relogin,
} from '@c/utils/callQt'

// axios default config
axios.defaults.baseURL = '/api/'
axios.defaults.timeout = 10000
axios.defaults.headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
}
//去除 passed = true 重新登录
const revertPassed = () => {
    let userInfo = localStorage.getItem('zyztUser')
    userInfo = userInfo ? JSON.parse(userInfo) : {}
    userInfo.passed = false
    localStorage.setItem('zyztUser', JSON.stringify(userInfo))
}

let cancel, promiseArr = {}
const CancelToken = axios.CancelToken
const errorHandler = () => {
    let errMap = {
        400() {},
        401() {},
        405() {
            errMap['1100']()
        },
        1009() { /* alert('您的电脑系统时间不正确,请修改！') */},
        1100() {
            /* token失效 */
            revertPassed()
            if (location.hostname == 'localhost') {
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
    // 发起请求时，取消掉当前正在进行的相同请求
    let url = Reflect.get(config, 'url')
    if (Reflect.has(promiseArr, url)) {
        Reflect.get(promiseArr, url)('操作取消')
        Reflect.set(promiseArr, url, cancel)
    } else {
        Reflect.set(promiseArr, url, cancel)
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

const handleDataResponse = ({
    callback0 = () => {},
    callback1001 = () => {},
}) => {
    return {
        0: callback0,
        1001: callback1001,
    }
}

const dealResponseData = (data, param) => {
    const code = Reflect.get(data, 'code')
    const handle = handleDataResponse(param)
    const completeName = 'afterResponse'
    switch (code) {
    case 0:
        Reflect.get(handle, code)(Reflect.get(data, 'data'))
        break
    case 1001:
        Reflect.get(handle, code)()
        break
    }
    if (typeof Reflect.get(param, completeName) === 'function') {
        Reflect.get(param, completeName)()
    }
}

const promise = (url = '', param, type = 'get') => {
    return new Promise((resolve, reject) => {
        let options = Reflect.get(param, 'options')

        const axiosParams = {
            method: type,
            cancelToken: new CancelToken(c => {
                cancel = c
            })
        }

        if (Object.is(type, 'get')) {
            Object.assign(axiosParams, {
                url: `${url}?${qs.stringify(options)}`,
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