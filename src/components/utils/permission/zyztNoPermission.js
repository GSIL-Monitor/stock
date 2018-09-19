import {
  openNewWin,
} from '../callQt'
import {
  getToken,
} from '../util'

const getOpenParams = () => {
  const width = window.screen.availWidth
  const height = window.screen.availHeight

  const coefficient = 0.7
  const popWidth = Math.floor(width * coefficient)
  const popHeight = Math.floor(height * coefficient)
  const top = Math.floor(height * (1 - coefficient) / 2)
  const left = Math.floor(width * (1 - coefficient) / 2)

  return {
    width: popWidth,
    height: popHeight,
    top,
    left
  }
}

const getEnv = () => {
  let host = location.hostname;
  if (/localhost/.test(host)) {
    return 'localhost'
  } else if (/sandbox.gofund.cn/.test(host)) {
    return 'sandbox'
  } else if (/pre.gofund.cn/.test(host)) {
    return 'pre'
  } else {
    return 'pro'
  }
}

const getUrlDomain = () => {
  var env = getEnv()

  if (Object.is(env, 'pro')) {
    return 'http://zyzt.66966.cn'
  } else if (Object.is(env, 'pre')) {
    return 'http://investpre.gofund.cn:8093'
  } else if (Object.is(env, 'sandbox')) {
    return 'http://investtest.gofund.cn:8093'
  } else if (Object.is(env, 'localhost')) {
    return 'http://investpre.gofund.cn:8093'
  }
}

const zyztNoPermissionPop = () => {
  const selfProp = getOpenParams()
  const width = selfProp.width
  const height = selfProp.height
  const domain = getUrlDomain()
  const token = getToken()
  const default_url =
    `${domain}/html/zyztNoPermission.html?token=${token}&winWidth=${width}&winHeight=${height}`
  const params = {
    width,
    height,
    minWidth: width,
    minHeight: height,
    url: default_url,
    title: '系统通知',
    top: 20,
    left: 20,
    resizeable: false
  }
  openNewWin(params)
}

export default zyztNoPermissionPop
