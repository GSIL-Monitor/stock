import {
    isHavePermission,
} from '@c/utils/permission/index.js'
import zytgNoPermission from '@c/utils/permission/zytgNoPermission.js'
import zyztNoPermission from '@c/utils/permission/zyztNoPermission.js'
import {
    isZyzt,
    isZytg,
    getCookie,
} from '@c/utils/util.js'
import openBuyPrice from './open-buy-right.js'

const COMPANY_TAG_CODE = ['TG_002', 'ZT_stocks']

const getUserType = (function() {
    let type
    return () => {
        if (type !== void 0) {
            return type
        } else {
            let userType = getCookie('userType')
            userType = userType ? JSON.parse(userType) : {}
            type = Number(userType.user_type)
            return type
        }
    }
})()

const isFreeOrTrialVersion = () => {
    let type = getUserType()

    return [1, 2].includes(type)
}

/**
 * @description 是否是经典版用户
*/
const isClassfiyVersion = () => {
    const type = getUserType()

    return Object.is(type, 10)
}

const zyztScoreManage = () => {
    const SUN_SCORE_CODE = 'TG_020'
    let isHaveCertaintyPermission = isHavePermission(SUN_SCORE_CODE)

    if (isFreeOrTrialVersion()) {
        if (!isHaveCertaintyPermission) {
            // 打开购买页面
            openBuyPrice()
            return false
        } else {
            return true
        }
    } else if (isClassfiyVersion()) {
        if (!isHaveCertaintyPermission) {
            // 无权限弹框
            zyztNoPermission()
            return false
        } else {
            return true
        }
    } else {
        // 其余版本根据自选股权限做判断
        return zyztPermissionControlCommon()
    }
}

const zyztPermissionControlCommon = () => {
    // 是否拥有自选股权限
    let isHaveMyStockPermission = isHavePermission(COMPANY_TAG_CODE)

    if (!isHaveMyStockPermission) {
        zyztNoPermission()
        return false
    } else {
        return true
    }
}

const zyztPermissionControl = (tagName) => {
    // 确定性评分报告特殊处理
    if (Object.is(tagName, 'zyyx_score')) {
        return zyztScoreManage()
    } else {
        return zyztPermissionControlCommon()
    }
}

const zytgPermissionControl = () => {
    // 是否拥有自选股权限
    let isHaveMyStockPermission = isHavePermission(COMPANY_TAG_CODE)

    if (!isHaveMyStockPermission) {
        zytgNoPermission()
        return false
    } else {
        return true
    }
}

const permissionControl = (tagName) => {
    if (isZyzt()) {
        return zyztPermissionControl(tagName)
    } else if (isZytg()) {
        return zytgPermissionControl()
    }
}

export default permissionControl
