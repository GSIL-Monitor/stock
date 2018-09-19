import zyztNoPermissionPop from './zyztNoPermission'
import zytgNoPermissionOperation from './zytgNoPermission'
import {
    getCookie,
} from '../util'

const isZyzt = () => {
    return navigator
            .userAgent
            .toLowerCase()
            .includes('zyzt')
}

const isZytg = () => {
    return navigator
            .userAgent
            .toLowerCase()
            .includes('zytg')
}

const getPermissionList = (function() {
    let buttonCode
    return function() {
        if (buttonCode) {
            return buttonCode
        } else {
            let userType = JSON.parse(getCookie('userType')) || {}
            buttonCode = userType.button_code || []
            return buttonCode
        }
    }
})()

const noPermissionOperation = () => {
    if (isZyzt()) {
        zyztNoPermissionPop()
    } else if (isZytg()) {
        zytgNoPermissionOperation()
    }
}

const isHavePermission = (moduleCode) => {
    let codeList = getPermissionList()

    return typeof moduleCode === 'string'
            ? codeList.includes(moduleCode)
            : moduleCode.some(function(n) {
                return codeList.includes(n)
            })
}

const verifyPermission = (buttonCode) => {
    const havePermission = isHavePermission(buttonCode)

    if (!havePermission) {
        noPermissionOperation()
    }
    return havePermission
}

export {
    verifyPermission,
    isHavePermission,
}
