<template>
<div
    class="root"
>
    <AppLeft
        class="root_left"
    />
    <AppMiddle
        class="root_main"
    />
    <AppRight
        class="root_right"
    />
    <TapeSet
        v-show="isShowTape"
        :is-hide="isBStock"
    />
    <TransaFilter />
    <ShortElvesFilter />
</div>
</template>

<script>
import {
    mapState,
    mapGetters,
    mapMutations,
    mapActions,
} from 'vuex'
import {
    getUrlParam,
    getCookie,
    changeUrlParam,
} from '@c/utils/util.js'
import {
    skipF1,
    skipF10,
} from './components/module-jump.js'
import {
    CURRENT_TYPE,
    STOCK_CODE,
    SOURCE,
    FULL_CODE,
    LEFT_STATE,
    RIGHT_STATE,
    INFO_STATE,
    KLINE_JUMP_PARAM,
    LEFT_SELECT_TAB,
    CHANGE_WINDOW_CODE_LIST,
} from '@store/stock-detail-store/config/mutation-types.js'
import {
    ADD_TO_RECENT_LIST,
    GET_RECENT_LIST_DATA,
} from '@store/stock-detail-store/config/action-types.js'
import {
    MODULE_NAME,
    LOCAL_LATEST_CODE,
    LOCAL_IS_LEFT_SHOW,
    LOCAL_IS_RIGHT_SHOW,
    LOCAL_IS_INFO_FULL,
    LOCAL_LEFT_TAB,
    EVENT_CHANGE_LEFT_RIGHT,
    EVENT_CHANGES_CODE,
    EVENT_KEY_BOARD,
    EVENT_CHANGE_STOCK,
    SESSION_ASTOCK_FUNC_TAB,
    TAB_RECOMMEND_TAGS,
    TAB_MY_STOCK,
    TAB_RECENT_VISITED,
} from './storage.js'

import stockVerifyMixin from './mixins/stock-verify-mixin.js'
import tapeDisplayMixin from './mixins/tape-display-mixin.js'

import AppLeft from './left/AppLeft.vue'
import AppMiddle from './middle/AppMiddle.vue'
import AppRight from './right/AppRight.vue'
// 盘口设置
import TapeSet from './tape/TapeSet.vue'
// 成交明细过滤
import TransaFilter from './right/TransaFilter.vue'
// 短线精灵设置
import ShortElvesFilter from './right/ShortElvesFilter.vue'

export default {
    name: 'App',
    mixins: [
        stockVerifyMixin,
        tapeDisplayMixin,
    ],
    data() {
        return {
            keyBoardTimer: null,
        }
    },
    computed: {
        ...mapState([
            'leftState',
            'rightState',
            'infoState',
            'full_code',
            'leftActiveKey',
        ]),
        ...mapGetters([
            'isAStock',
            'isBStock',
            'isHSIndex',
            'isFund',
            'isBond',
            'isHkFund',
            'isHkBond',
            'isHkWarrant',
            'isHkCbbc',
            'isFuture',
            'canLoadF10',
            'canLoadF1',
            'hasInformation',
            'isShowTape',
        ]),
    },
    methods: {
        ...mapMutations([
            STOCK_CODE,
            SOURCE,
            FULL_CODE,
            CURRENT_TYPE,
            LEFT_STATE,
            RIGHT_STATE,
            INFO_STATE,
            KLINE_JUMP_PARAM,
            LEFT_SELECT_TAB,
            CHANGE_WINDOW_CODE_LIST,
        ]),
        ...mapActions([
            ADD_TO_RECENT_LIST,
            GET_RECENT_LIST_DATA,
        ]),
        init() {
            let hash = location.hash.substr(1)

            if (hash) {
                this.changeCurrentStockState(hash)
            } else {
                let stock_code = getUrlParam('stock_code') || localStorage.getItem(LOCAL_LATEST_CODE) || '000001'
                // 第一次无 hash 改写 hash，触发 hashchange 事件
                window.location.hash = `#${stock_code}`
            }

            // 添加最近访问列表
            // this[ADD_TO_RECENT_LIST]({
            //     options: {
            //         full_code: this.full_code,
            //     }
            // })
        },
        initUrlState() {
            this.initUrlKlineJump()
            this.initUrlPositionModule()
        },
        initUrlKlineJump() {
            const URL_KLINE_JUMP_PARAMS = 'jump'
            let klineJump = getUrlParam(URL_KLINE_JUMP_PARAMS)
            if (klineJump) {
                this.setJumpStoreState(klineJump)
                changeUrlParam(URL_KLINE_JUMP_PARAMS, '')
            }
        },
        initUrlPositionModule() {
            const URL_POSITION_MODULE = 'positionModule'
            let position = getUrlParam(URL_POSITION_MODULE)
            if (position) {
                this.setPositionModule(position.positionModule)
                changeUrlParam(URL_POSITION_MODULE, '')
            }
        },
        // setKlineJumpState() {

        // },
        setPositionModule(data, sendState) {
            if (Object.is(data, 'tags')) {
                // 若左侧为收起状态，则设置为展开状态
                if (Object.is(this.leftState, false)) {
                    let state = true
                    this.setLeftState(state)
                    // 行情图状态
                    if (sendState) {
                        this.$_eventBus.$emit('setKlineStyle', 'left', state)
                    }
                }
                // 左侧选中设置为推荐标签
                this[LEFT_SELECT_TAB](TAB_RECOMMEND_TAGS)
            }
        },
        setJumpStoreState(jump) {
            this[KLINE_JUMP_PARAM](jump)
            // 若为资金流向，A股右下方定位到资金流向
            if (Object.is(jump, 'flow')) {
                sessionStorage.setItem(SESSION_ASTOCK_FUNC_TAB, 'fund_flow')
            }
        },
        initState() {
            this.initUrlState()
        },
        changeLeftRight(d) {
            let data = JSON.parse(d)
            if (data.left) {
                let state = Object.is(data.left, 'true')
                this.setLeftState(state)
                this.$_eventBus.$emit('setKlineStyle', 'left', state)
            } else if (data.right) {
                let state = Object.is(data.right, 'true')
                if (Object.is(state, false) && this.$_tapeState) {
                    this.changeTapeSetState()
                }
                this.setRightState(state)
                this.$_eventBus.$emit('setKlineStyle', 'right', state)
            } else if (data.fullScreen) {
                let nextState = data.fullScreen
                if (Object.is(nextState, 'true')) {
                    let state = false
                    if (this.leftState) {
                        this.setLeftState(state)
                        this.$_eventBus.$emit('setKlineStyle', 'left', state)
                    }
                    if (this.rightState) {
                        this.setRightState(state)
                        this.$_eventBus.$emit('setKlineStyle', 'right', state)
                    }
                    if (this.hasInformation && this.infoState) {
                        this.setInfoState(state)
                        this.$_eventBus.$emit('setKlineStyle', 'bottom', state)
                    }
                    if (this.$_tapeState) {
                        this.changeTapeSetState()
                    }
                } else if (Object.is(nextState, 'false')) {
                    let state = true
                    if (!this.leftState) {
                        this.setLeftState(state)
                        this.$_eventBus.$emit('setKlineStyle', 'left', state)
                    }
                    if (!this.rightState) {
                        this.setRightState(state)
                        this.$_eventBus.$emit('setKlineStyle', 'right', state)
                    }
                    if (this.hasInformation && !this.infoState) {
                        this.setInfoState(state)
                        this.$_eventBus.$emit('setKlineStyle', 'bottom', state)
                    }
                }
            }
        },
        setLeftState(state) {
            this[LEFT_STATE](state)
        },
        setRightState(state) {
            this[RIGHT_STATE](state)
        },
        setInfoState(state) {
            this[INFO_STATE](state)
        },
        changeTapeSetState() {
            // 改变盘口设置状态
            this.$_changeTapeDisplay()
        },
        getSource(stock_code) {
            // 获取 A、B 股证券前缀
            let code = stock_code.substr(0, 2)
            if (['60', '90'].includes(code)) {
                return 'sh'
            } else {
                return 'sz'
            }
        },
        getInfo(hash) {
            // 获取当前 hash 类型 具体字段
            let full_code, source, stock_code
            if (this.isAStock || this.isBStock) {
                // 拼接 source
                source = this.getSource(hash)
                stock_code = hash
                full_code = `${source}${stock_code}`
            } else if (this.isFund || this.isBond) {
                full_code = hash.replace(/fund|bond/, '')
                source = full_code.substr(0, 2)
                stock_code = full_code.substr(2)
            } else if (this.isHkFund ||
                this.isHkBond ||
                this.isHkWarrant ||
                this.isHkCbbc
            ) {
                // 抹去前缀
                full_code = hash.replace(/fund_H|bond_H|warrants|cbbc/, '')
                source = full_code.substr(0, 2)
                stock_code = full_code.substr(2)
            } else if (this.isFuture) {
                // 期货
                let splitArr = hash.split(';')
                full_code = splitArr.join('')
                source = splitArr[0]
                stock_code = splitArr[1]
            } else if (this.isHSIndex) {
                // 沪深指数里 source 有 sh sz BK csi
                full_code = hash
                source = hash.match(/[A-Za-z]{2,}/)[0]
                stock_code = hash.replace(source, '')
            } else {
                // 默认
                full_code = hash
                source = full_code.substr(0, 2)
                stock_code = full_code.substr(2)
            }

            return {
                source,
                stock_code,
                full_code,
            }
        },
        changeCurrentStockState(hash) {
            let type = this.$_enSureStockType(hash)
            this[CURRENT_TYPE](type)

            let info = this.getInfo(hash)
            // 提交到 vuex
            this[STOCK_CODE](info.stock_code)
            this[SOURCE](info.source)
            this[FULL_CODE](info.full_code)
            localStorage.setItem(LOCAL_LATEST_CODE, hash)
        },
        changeScode(d) {
            const data = JSON.parse(d)

            if (data.jump) {
                this.setJumpStoreState(data.jump)
                if (Object.is(location.hash.substr(1), data.stock_code)) {
                    // 与之前相同的股票，设置 K 线图状态，不同的股票则等到full_code改变时设置
                    this.$_eventBus.$emit('setKlineTabs')
                }
            }

            // 触发 hashchange 事件
            if (data.stock_code) {
                location.hash = data.stock_code
            }

            if (data.positionModule) {
                this.setPositionModule(data.positionModule, true)
            }

            if (data.codeList) {
                this[CHANGE_WINDOW_CODE_LIST](data.codeList)
            }

            setTimeout(() => {
                // 延迟到 hashchange 事件执行之后执行
                this.recentVisitedRefresh(data.isRencent)
            }, 0)
        },
        recentVisitedRefresh(isRencent) {
            if (!isRencent) {
                if (this.leftState &&
                    Object.is(this.leftActiveKey, TAB_RECENT_VISITED)
                ) {
                    // 添加并刷新
                    this[ADD_TO_RECENT_LIST]({
                        options: {
                            full_code: this.full_code,
                        }
                    }).then((response) => {
                        if (!Object.is(response.code, 0)) {
                            return false
                        }

                        this[GET_RECENT_LIST_DATA]()
                    })
                    // 左侧展开状态且最近访问列表为选中状态
                } else {
                    this[ADD_TO_RECENT_LIST]({
                        options: {
                            full_code: this.full_code,
                        }
                    })
                }
            }
        },
        // getNewLink(client_id) {
        //     let index = goGoal.sockets.findIndex((element) => {
        //         return !!element
        //     })
        //     if (index > -1) {
        //         let preLink = goGoal.sockets[index]
        //         let accountName = getCookie('accountName')
        //         let newLink = `${preLink}|client_id:${accountName}-${client_id}`

        //         return {
        //             link: newLink,
        //             index,
        //         }
        //     } else {
        //         return null
        //     }
        // },
        // socketOnMessage(event) {
        //     const data = JSON.parse(event.data)
        //     const client_id = data.client_id

        //     if (data.code && data.code == '4') {
        //         return false
        //     }
        //     if (client_id) {
        //         this.client_id = client_id
        //     }
        //     if (!this.sendClientId && this.client_id) {
        //         // 将此 ID 传回服务端
        //         let newLink = this.getNewLink(this.client_id)

        //         if (newLink) {
        //             goGoal.sockets[newLink.index] = newLink.link
        //             goGoal.ws.send(newLink.link)

        //             this.sendClientId = true
        //             this.client_id = null
        //         }
        //         return false
        //     } else {
        //         // 处理推送内容
        //         let id = data.request_id
        //         let receiveContent = JSON.parse(data.receive_content)
        //         let requestContent = data.request_content

        //         this.$_eventBus.$emit(id, receiveContent, requestContent)
        //     }
        // },
        keyBoardSpace() {
            let state = !this.leftState
            this.setLeftState(state)
            this.$_eventBus.$emit('setKlineStyle', 'left', state)
        },
        keyBoardF10() {
            if (!this.canLoadF10) {
                return false
            }

            let hash = location.hash.substr(1)
            skipF10(hash, MODULE_NAME)
        },
        keyBoardF1() {
            if (!this.canLoadF1) {
                return false
            }

            let hash = location.hash.substr(1)
            skipF1(hash, MODULE_NAME)
        },
        // 全局快捷键
        keyBoardEvent(data) {
            const TIMER_STEP = 100

            clearTimeout(this.keyBoardTimer)
            this.keyBoardTimer = setTimeout(() => {
                if (['Up', 'Down'].includes(data)) {
                    return false
                }
                if (Object.is(data, 'Space')) {
                    this.keyBoardSpace()
                } else if (Object.is(data, 'F10')) {
                    this.keyBoardF10()
                } else if (Object.is(data, 'F1')) {
                    this.keyBoardF1()
                }
            }, TIMER_STEP)
        },
        changeMystock(data) {
            this.$_eventBus.$emit('refeatchMyStockGroup')
            this.$_eventBus.$emit('revalidateIsMyStock')
        },
    },
    components: {
        AppLeft,
        AppMiddle,
        AppRight,
        TapeSet,
        TransaFilter,
        ShortElvesFilter,
    },
    beforeCreate() {
        goGoal.detectSelectedTheme()
        // 监听 hash 改变
        window.onhashchange = event => {
            let hash = location.hash.substr(1)
            this.changeCurrentStockState(hash)
        }
    },
    created() {
        // goGoal.ws.onmessage = this.socketOnMessage
        goGoal.event.listen(EVENT_CHANGES_CODE, this.changeScode)
        goGoal.event.listen(EVENT_CHANGE_LEFT_RIGHT, this.changeLeftRight)
        goGoal.event.listen(EVENT_KEY_BOARD, this.keyBoardEvent)
        goGoal.event.listen(EVENT_CHANGE_STOCK, this.changeMystock)

        this.initState()
        this.init()
    },
    beforeDestroy() {
        // goGoal.ws.onmessage = null
        goGoal.event.remove(EVENT_CHANGES_CODE, this.changeScode)
        goGoal.event.remove(EVENT_CHANGE_LEFT_RIGHT, this.changeLeftRight)
        goGoal.event.remove(EVENT_KEY_BOARD, this.keyBoardEvent)
        goGoal.event.remove(EVENT_CHANGE_STOCK, this.changeMystock)
    },
}
</script>
