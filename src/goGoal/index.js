import {
    getCookie,
} from '@c/utils/util'
import ReconnectingWebSocket from './web-socket'

const goGoal = window.goGoal || {}

const changeThemeFun = (theme) => {
    const WHITE_SKIN = 'w'
    const WHITE_SKIN_CLASS_NAME = 'skin_white'
    if (Object.is(theme, WHITE_SKIN)) {
        document.documentElement.classList.add(WHITE_SKIN_CLASS_NAME)
    } else {
        document.documentElement.classList.remove(WHITE_SKIN_CLASS_NAME)
    }
}

goGoal.detectSelectedTheme = () => {
    let skin = getCookie('skin')
    changeThemeFun(skin)
}

goGoal.changeTheme = (theme) => {
    changeThemeFun(theme)
}

goGoal.event = (function() {
    var clientList = {};
    var listen,
        trigger,
        remove;
    listen = function(key, fn) {
        if (!clientList[key]) {
            clientList[key] = [];
        }
        clientList[key].push(fn);
    };

    trigger = function() {
        var key = [].shift.call(arguments);
        var fns = clientList[key];

        if (!fns || fns.length === 0) {
            return false;
        }

        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments);
        }
    };


    remove = function(key, fn) {
        var fns = clientList[key];

        // key对应的消息么有被人订阅
        if (!fns) {
            return false;
        }

        // 没有传入fn(具体的回调函数), 表示取消key对应的所有订阅
        if (!fn) {
            fns && (fns.length = 0);
        } else {
            // 反向遍历
            for (var i = fns.length - 1; i >= 0; i--) {
                var _fn = fns[i];
                if (_fn === fn) {
                    // 删除订阅回调函数
                    fns.splice(i, 1);
                }
            }
        }
    };

    return {
        listen: listen,
        trigger: trigger,
        remove: remove
    }
}());

/**
 * @description 默认的刷新事件
*/
goGoal.event.listen('reloadPage', () => {
    location && location.reload();
})

goGoal.subEvent = function(event, params) {
    switch (event) {
        case 'keyboardPress':
            goGoal.event.trigger('keyBoardEvent', params);
            break
        default:
            goGoal.event.trigger(event, params);
            break
    }
}

const getSocketLink = () => {
    let socketAddr
    if (Number(getCookie('hk_now'))) {
        socketAddr = 'ws:ggservice-ws-now.go-goal.cn:5188';
    } else if(location.pathname === '/html/stockMarket.html'){
        socketAddr = 'ws://ggservice-ws.pre.gofund.cn:8093';
    } else {
        socketAddr = 'ws://ggservice-ws.go-goal.cn:5188';
    }

    return socketAddr
}

goGoal.ws = new ReconnectingWebSocket(getSocketLink());

const sendSocketLink = (isCancel) => {
    goGoal.sockets.forEach((element, index) => {
        if (element) {
            let link
            if (isCancel) {
                link = `${element}|status:0`
                goGoal.sockets[index] = link
            } else {
                if (element.includes('status:0')) {
                    link = element.split('|status:0')[0]
                    goGoal.sockets[index] = link
                } else {
                    link = element
                }
            }
            goGoal.ws.send(link)
        }
    })
}

const isForbiddenState = () => {
    if (!goGoal.sockets || Object.is(goGoal.sockets.length, 0)) {
        return true
    } else if (goGoal.ws.readyState !== 1) {
        return true
    } else {
        return false
    }
}

const isLinkCanceled = () => {
    return goGoal.sockets.some((element) => {
        if (typeof element === 'string') {
            return element.includes('status:0')
        } else {
            return false
        }
    })
}

goGoal.ws.onopen = function () {
    if (isForbiddenState()) {
        return false
    }

    sendSocketLink()
}

goGoal.creatNewSocket = () => {
    if (isForbiddenState()) {
        return false
    }

    sendSocketLink()
}

goGoal.closeSocket = () => {
    if (isForbiddenState()) {
        return false
    }

    sendSocketLink(true)
}

// websocket 重连
const INTERVAL_STEP = 1000 * 60
setInterval(() => {
    if (isForbiddenState()) {
        return false
    } else if (isLinkCanceled()) { //判断是否是取消的订阅，取消的订阅不用轮询连接
        return false
    } else {
        goGoal.ws.send('')
    }
}, INTERVAL_STEP)

export default goGoal
