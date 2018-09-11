<template>
<div
    class="root"
>
    <LeftTemplate
        class="root_left"
    />
    <MiddleTemplate
        class="root_main"
    />
    <RightTemplate
        class="root_right"
    />
    <TapeSet
        v-show="isShowTape"
        :isHide="isBStock"
    />
    <TransaFilter/>
    <ShortElvesFilter/>
</div>
</template>

<script>
import {
    mapState,
    mapGetters,
    mapMutations,
} from 'vuex'
import {
    getUrlParam,
    getCookie,
    changeUrlParam,
} from '@c/utils/util'
import stockVerifyMixin from './mixins/stock-verify-mixin'
import {
    CURRENT_TYPE,
    STOCK_CODE,
    SOURCE,
    FULL_CODE,
    LEFT_STATE,
    RIGHT_STATE,
    INFO_STATE,
    KLINE_JUMP_PARAM,
} from '@store/stock-detail-store/config/mutation-types'
import {
    LOCAL_LATEST_CODE,
    LOCAL_IS_LEFT_SHOW,
    LOCAL_IS_RIGHT_SHOW,
    LOCAL_IS_INFO_FULL,
    LOCAL_LEFT_TAB,
    EVENT_CHANGE_LEFT_RIGHT,
    EVENT_CHANGES_CODE,
    EVENT_KEY_BOARD,
    SESSION_ASTOCK_FUNC_TAB,
} from './storage'

// vue template --------------------------------------
import LeftTemplate from './left/LeftMain'
import MiddleTemplate from './middle/MiddleMain'
import RightTemplate from './right/RightMain'
// 盘口设置
import TapeSet from './tape/TapeSet'
// 成交明细过滤
import TransaFilter from './right/TransaFilter'
// 短线精灵设置
import ShortElvesFilter from './right/ShortElvesFilter'

export default {
    name: 'App',
    mixins: [
        stockVerifyMixin,
    ],
    beforeCreate() {
        // 监听 hash 改变
        window.onhashchange = event => {
            let hash = location.hash.substr(1)

            this.changeCurrentStockState(hash)
        }
    },
    created() {
        goGoal.ws.onmessage = this.socketOnMessage
        goGoal.event.listen(EVENT_CHANGES_CODE, this.changeScode)
        goGoal.event.listen(EVENT_CHANGE_LEFT_RIGHT, this.changeLeftRight)
        goGoal.event.listen(EVENT_KEY_BOARD, this.keyBoardEvent)
        this.$eventBus.$on(this.tapeSetName, this.changeTapeSetState)

        this.initState()
        this.init()
    },
    data() {
        return {
            tapeState: false,
            tapeSetName: 'tapeSet',
            sendClientId: false,
            client_id: null,
        }
    },
    components: {
        LeftTemplate,
        MiddleTemplate,
        RightTemplate,
        TapeSet,
        TransaFilter,
        ShortElvesFilter,
    },
    computed: {
        ...mapState([
            'leftState',
            'rightState',
            'infoState',
        ]),
        ...mapGetters([
            'isAStock',
            'isBStock',
            'isHkFund',
            'isHkBond',
            'isHkWarrant',
            'isHkCbbc',
            'isHSIndex',
            'isFuture',
        ]),
        isShowTape() {
            return this.tapeState && (this.isAStock || this.isBStock)
        },
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
        ]),
        init() {
            let hash = location.hash.substr(1)
            if (hash) {
                this.changeCurrentStockState(hash)
            } else {
                let stock_code = getUrlParam('stock_code') || this.getLocalStorage(LOCAL_LATEST_CODE) || '000001'
                // 第一次无 hash 改写 hash，触发 hashchange 事件
                window.location.hash = `#${stock_code}`
            }
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
        setPositionModule(data) {
            if (Object.is(data, 'tags')) {
                // 若左侧为收起状态，则设置为展开状态
                if (Object.is(this.leftState, false)) {
                    let state = true
                    this.setLeftState(state)
                }
                // 左侧选中设置为推荐标签
                localStorage.setItem(LOCAL_LEFT_TAB, 'tags')
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
            this[LEFT_STATE](this.initLeftState())
            this[RIGHT_STATE](this.initRightState())
            this[INFO_STATE](this.initInforState())
        },
        getLocalStorage(name) {
            return localStorage.getItem(name)
        },
        initLeftState() {
            let state = this.getLocalStorage(LOCAL_IS_LEFT_SHOW)
            if (!state) {
                // 第一次加载默认展开
                const DEFAULT_STATE = true
                localStorage.setItem(LOCAL_IS_LEFT_SHOW, DEFAULT_STATE)
                return DEFAULT_STATE
            } else {
                // true 为 展开
                return Object.is(state, 'true')
            }
        },
        initRightState() {
            let state = this.getLocalStorage(LOCAL_IS_RIGHT_SHOW)
            if (!state) {
                // 第一次加载默认展开
                const DEFAULT_STATE = true
                localStorage.setItem(LOCAL_IS_RIGHT_SHOW, DEFAULT_STATE)
                return DEFAULT_STATE
            } else {
                // true 为 展开
                return Object.is(state, 'true')
            }
        },
        initInforState() {
            let state = this.getLocalStorage(LOCAL_IS_INFO_FULL)
            if (!state) {
                // 第一次加载默认收起
                const DEFAULT_STATE = false
                localStorage.setItem(LOCAL_IS_INFO_FULL, DEFAULT_STATE)
                return DEFAULT_STATE
            } else {
                // true 为 展开
                return Object.is(state, 'true')
            }
        },
        changeLeftRight(d) {
            let data = JSON.parse(d)
            if (data.left) {
                let state = Object.is(data.left, 'true')
                this.setLeftState(state)
                this.$eventBus.$emit('setKlineStyle', 'left', state)
            } else if (data.right) {
                let state = Object.is(data.right, 'true')
                this.setRightState(state)
                this.$eventBus.$emit('setKlineStyle', 'right', state)
            } else if (data.fullScreen) {
                let nextState = data.fullScreen
                if (Object.is(nextState, 'true')) {
                    let state = false
                    if (this.leftState) {
                        this.setLeftState(state)
                    }
                    if (this.rightState) {
                        this.setRightState(state)
                    }
                    if (this.infoState) {
                        this.setInfoState(state)
                    }
                } else if (Object.is(nextState, 'false')) {
                    let state = true
                    if (!this.leftState) {
                        this.setLeftState(state)
                    }
                    if (!this.rightState) {
                        this.setRightState(state)
                    }
                    if (!this.infoState) {
                        this.setInfoState(state)
                    }
                }
            }
        },
        setLeftState(state) {
            this[LEFT_STATE](state)
            localStorage.setItem(LOCAL_IS_LEFT_SHOW, state)
        },
        setRightState(state) {
            this[RIGHT_STATE](state)
            localStorage.setItem(LOCAL_IS_RIGHT_SHOW, state)
        },
        setInfoState(state) {
            this[INFO_STATE](state)
            localStorage.setItem(LOCAL_IS_INFO_FULL, state)
        },
        changeTapeSetState() {
            // 改变盘口设置状态
            this.tapeState = !this.tapeState
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
            } else if (
                this.isFund ||
                this.isBond ||
                this.isHkFund ||
                this.isHkBond ||
                this.isHkWarrant ||
                this.isHkCbbc
            ) {
                // 抹去前缀
                full_code = hash.replace(/fund|bond|fund_H|bond_H|warrants|cbbc/, '')
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
            let type = this.enSureStockType(hash)
            this[CURRENT_TYPE](type)

            let info = this.getInfo(hash)
            // 提交到 vuex
            this[STOCK_CODE](info.stock_code)
            this[SOURCE](info.source)
            this[FULL_CODE](info.full_code)
            localStorage.setItem(LOCAL_LATEST_CODE, hash)
        },
        changeScode(d) {
            var data = JSON.parse(d)
            if (data.jump) {
                this.setJumpStoreState(data.jump)
                if (Object.is(location.hash.substr(1), data.stock_code)) {
                    // 与之前相同的股票，设置 K 线图状态，不同的股票则等到full_code改变时设置
                    this.$eventBus.$emit('setKlineTabs')
                }
            }
            if (data.stock_code) {
                location.hash = data.stock_code
            }
            if (data.codeList) {
                // TODO:设置K线图滚轮列表，与快捷键一起开发

            }
            if (data.positionModule) {
                this.setPositionModule(data.positionModule)
                if (Object.is(data.positionModule, 'tags') ) {
                    this.$eventBus.$emit('changeSelectKey', 'tags')
                }
            }
        },
        getNewLink(client_id) {
            let index = goGoal.sockets.findIndex((element) => {
                return !!element
            })
            if (index > -1) {
                let preLink = goGoal.sockets[index]
                let accountName = getCookie('accountName')
                let newLink = `${preLink}|client_id:${accountName}-${client_id}`
                return {
                    link: newLink,
                    index,
                }
            } else {
                return null
            }
        },
        socketOnMessage(event) {
            const data = JSON.parse(event.data)
            const client_id = data.client_id
            if (data.code && data.code == '4') {
                return false
            }
            if (client_id) {
                this.client_id = client_id
            }
            if (!this.sendClientId && this.client_id) {
                // 将此 ID 传回服务端
                let newLink = this.getNewLink(this.client_id)
                if (newLink) {
                    goGoal.sockets[newLink.index] = newLink.link
                    goGoal.ws.send(newLink.link)

                    this.sendClientId = true
                    this.client_id = null
                }
                return false
            } else {
                // 处理推送内容
                let id = data.request_id

                let receiveContent = JSON.parse(data.receive_content)
                let requestContent = data.request_content
                this.$eventBus.$emit(id, receiveContent, requestContent)
            }
        },
        keyBoardEvent(data) {
            console.log(data)
        },
    },
    beforeDestroy() {
        // goGoal.ws.onmessage = null
        this.$eventBus.$off(this.tapeSetName, this.changeTapeSetState)
        goGoal.event.remove(EVENT_CHANGES_CODE, this.changeScode)
        goGoal.event.remove(EVENT_KEY_BOARD, this.keyBoardEvent)
    },
    destroyed() {
        window.onhashchange = null
    },
}
</script>

<style lang="less">
@import '../../less/stockDetail.less';
</style>
