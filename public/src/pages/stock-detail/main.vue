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
    <div
        class="root_right"
    >
        <component
            :is="currentRightRouter"
        ></component>
        <!-- <StockATemp
                v-if="isAStock"
            />
            <StockBTemp
                v-if="isBStock"
            />
            <FundTemp
                v-if="isFund"
            />
            <BondTemp
                v-if="isBond"
            />
            <MarketTemp
                v-if="isHSIndex"
            /> -->
    </div>
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
} from 'vuex'
import {
    getUrlParam,
    getCookie,
} from '@c/utils/util'
import {
    CURRENT_TYPE,
    STOCK_CODE,
    SOURCE,
    FULL_CODE,
} from '@store/stock-detail-store/config/mutation-types'
import * as TYPE from '@formatter/config/stock-type-config'
import {
    LOCAL_LATEST_CODE,
    EVENT_CHANGES_CODE,
    EVENT_KEY_BOARD,
} from './storage'

// vue template --------------------------------------
import LeftTemplate from './left/Left'
import MiddleTemplate from './middle/Middle'
// 右侧
import StockATemp from './right/StockA'
import StockBTemp from './right/StockB'
import FundTemp from './right/Fund'
import BondTemp from './right/Bond'
import MarketTemp from './right/Market'
// 盘口设置
import TapeSet from './tape/TapeSet'
// 成交明细过滤
import TransaFilter from './right/TransaFilter'
// 短线精灵设置
import ShortElvesFilter from './right/ShortElvesFilter'

const stockVerify = [{
        type: TYPE.ASTOCK,
        regexp: /^[01345678][0-9]{5}/,
    },
    {
        type: TYPE.SHBSTOCK,
        regexp: /^900\d{3}$/,
    },
    {
        type: TYPE.SZBSTOCK,
        regexp: /^200\d{3}$/,
    },
    {
        type: TYPE.FUND,
        regexp: /^fund(\w+)?[0-9]{1,}$/,
    },
    {
        type: TYPE.BOND,
        regexp: /^bond(\w+)?[0-9]{1,}$/,
    },
    {
        type: TYPE.HKSTOCK,
        regexp: /^hk[0-9]{1,}/,
    },
    {
        type: TYPE.HKINDEX,
        regexp: /^hk[a-zA-Z]+[0-9]*/,
    },
    {
        type: TYPE.HKFUND,
        regexp: /^fund_H\w+/,
    },
    {
        type: TYPE.HKBOND,
        regexp: /^bond_H\w+/,
    },
    {
        type: TYPE.HKWARRANT,
        regexp: /^warrants\w+/,
    },
    {
        type: TYPE.HKCBBC,
        regexp: /^cbbc\w+/,
    },
    {
        type: TYPE.INDEX,
        regexp: /^[a-zA-Z]{2,}[0-9]{1,}$/,
    },
    {
        type: TYPE.FUTURES,
        regexp: /^qh_\w+/,
    },
]

export default {
    name: 'App',
    beforeCreate() {
        // 监听 hash 改变
        window.onhashchange = event => {
            let hash = location.hash.substr(1)

            this.changeCurrentStockState(hash)
        }
    },
    created() {
        goGoal.event.listen(EVENT_CHANGES_CODE, this.changeScode)
        goGoal.ws.onmessage = this.socketOnMessage
        goGoal.event.listen(EVENT_KEY_BOARD, this.keyBoardEvent)
        this.$eventBus.$on(this.tapeSetName, this.changeTapeSetState)

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
        TapeSet,
        StockATemp,
        StockBTemp,
        FundTemp,
        BondTemp,
        MarketTemp,
        TransaFilter,
        ShortElvesFilter,
    },
    computed: {
        ...mapGetters([
            'isAStock',
            'isBStock',
            'isFund',
            'isBond',
            'isHSIndex',
        ]),
        currentRightRouter() {
            return this.isAStock ? 'StockATemp' :
                this.isBStock ? 'StockBTemp' :
                this.isFund ? 'FundTemp' :
                this.isBond ? 'BondTemp' :
                this.isHSIndex ? 'MarketTemp' : 'StockATemp'
        },
        isShowTape() {
            return this.tapeState && (this.isAStock || this.isBStock)
        },
    },
    methods: {
        init() {
            let hash = location.hash.substr(1)
            if (hash) {
                this.changeCurrentStockState(hash)
            } else {
                let stock_code = getUrlParam('stock_code') || localStorage.getItem(LOCAL_LATEST_CODE) || '000001'
                // 第一次无 hash 改写 hash，触发 hashchange 事件
                window.location.hash = `#${stock_code}`
            }
        },
        changeTapeSetState() {
            // 改变盘口设置状态
            this.tapeState = !this.tapeState
        },
        getSource(stock_code) {
            // 获取A、B股证券前缀
            let code = stock_code.substr(0, 2)
            if (['60', '90'].includes(code)) {
                return 'sh'
            } else {
                return 'sz'
            }
        },
        getInfo(type, hash) {
            // 获取当前 hash 类型 具体字段
            let full_code, source, stock_code
            if ([TYPE.ASTOCK, TYPE.SHBSTOCK, TYPE.SZBSTOCK, TYPE.BSTOCK].includes(type)) {
                // 拼接 source
                source = this.getSource(hash)
                stock_code = hash
                full_code = `${source}${stock_code}`
            } else if (
                [
                    TYPE.FUND,
                    TYPE.BOND,
                    TYPE.HKFUND,
                    TYPE.HKBOND,
                    TYPE.HKWARRANT,
                    TYPE.HKCBBC,
                ].includes(type)
            ) {
                // 抹去前缀
                full_code = hash.replace(/fund|bond|fund_H|bond_H|warrants|cbbc/, '')
                source = full_code.substr(0, 2)
                stock_code = full_code.substr(2)
            } else if (Object.is(type, TYPE.FUTURES)) {
                // 期货
                let splitArr = hash.split(';')
                full_code = splitArr.join('')
                source = splitArr[0]
                stock_code = splitArr[1]
            } else if (Object.is(type, TYPE.INDEX)) {
                // 沪深指数里 source 有 sh sz BK csi
                full_code = hash
                source = hash.match(/[A-Za-z]{2,}/)[0]
                stock_code = hash.replace(source, '')
            } else {
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
            let info = this.getInfo(type, hash)

            localStorage.setItem(LOCAL_LATEST_CODE, hash)
            this.$store.commit(STOCK_CODE, info.stock_code)
            this.$store.commit(SOURCE, info.source)
            this.$store.commit(FULL_CODE, info.full_code)
            this.$store.commit(CURRENT_TYPE, type)
        },
        itemVerify(arr, hash) {
            return arr.regexp.test(hash)
        },
        enSureStockType(hash) {
            let ele = stockVerify.find(ele => {
                return this.itemVerify(ele, hash)
            })

            return ele.type
        },
        changeScode(data) {
            var d = JSON.parse(data)

            if (d.stock_code) {
                location.hash = d.stock_code
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
        goGoal.ws.onmessage = null
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
