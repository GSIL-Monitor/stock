<template>
    <object
        type="time-sharingplan"
        page_id="stockDetail"
        pos="300, 30"
        width="100%"
        height="100%"
        ref="stockKline"
    ></object>
</template>

<script>
import {
    mapState,
    mapGetters,
} from 'vuex'
import * as TYPE from '@formatter/config/stock-type-config.js'

export default {
    name: 'KLine',
    created() {
        this.$_eventBus.$on('setKlineTabs', this.setKlineTabs)
        this.$_eventBus.$on('setKlineStyle', this.changeKlineState)
        this.$_eventBus.$on('setKlineStockAdd', this.setAddStock)
        this.$_eventBus.$on('setKlineStockDel', this.setDelStock)
    },
    mounted() {
        this.initKLine()
        this.isShowLeft(this.leftState)
        this.isShowRight(this.rightState)
        this.isShowBottom(this.klineBottomState)

        if (this.full_code) {
            this.setKlineCode()
        }
    },
    computed: {
        ...mapState([
            'source',
            'full_code',
            'current_type',
            'leftState',
            'rightState',
            'infoState',
            'klineJumpState',
        ]),
        ...mapGetters([
            // 'isAStock',
            // 'isHSIndex',
            // 'isHkStock',
            'hasInformation',
        ]),
        klineBottomState() {
            if (this.hasInformation) {
                return this.infoState
            } else {
                return false
            }
        },
        codeType() {
            const maps = {
                [TYPE.ASTOCK]: 'stock',
                [TYPE.SHBSTOCK]: 'stock_B',
                [TYPE.SZBSTOCK]: 'stock_B',
                [TYPE.INDEX]: 'index',
                [TYPE.FUND]: 'fund',
                [TYPE.BOND]: 'bond',
                [TYPE.HKSTOCK]: 'stock_H',
                [TYPE.HKFUND]: 'fund_H',
                [TYPE.HKBOND]: 'bond_H',
                [TYPE.HKWARRANT]: 'warrants',
                [TYPE.HKCBBC]: 'cbbc',
                [TYPE.FUTURES]: this.source,
            }

            return maps[this.current_type]
        },
    },
    methods: {
        isShowLeft(state) {
            const KLINE_LEFT = 'left'
            this.setKlineState(KLINE_LEFT, state)
        },
        isShowRight(state) {
            const KLINE_RIGHT = 'right'
            this.setKlineState(KLINE_RIGHT, state)
        },
        isShowBottom(state) {
            const KLINE_BOTTOM = 'bottom'
            this.setKlineState(KLINE_BOTTOM, state)
        },
        lineParams() {
            // TODO: 跳转指标设置
            let curIndex,
                indicator;
            if (this.klineJumpState) {
                const TURN_NINE = 'turnNine' // 九转指标
                const SHORT_TRADER = 'shortTrader' // 多空操盘
                const FLOW = 'flow' // 资金流向
                const TIME_SHARE = 'timeShare' // 资金流向
                if (Object.is(this.klineJumpState, TIME_SHARE)) {
                    curIndex = 'ONE_DAY_MINUTE'
                    indicator = ''
                } else if (Object.is(this.klineJumpState, TURN_NINE)) {
                    curIndex = ''
                    indicator = 'NINE_TURN'
                } else if (Object.is(this.klineJumpState, SHORT_TRADER)) {
                    curIndex = ''
                    indicator = 'BBTRADING'
                } else if (Object.is(this.klineJumpState, FLOW)) {
                    curIndex = 'ONE_DAY_MINUTE'
                    indicator = 'MAIN_FUND'
                }
            } else {
                curIndex = ''
                indicator = ''
            }

            return {
                curIndex,
                indicator,
            }
        },
        initKLine() {
            try {
                const FUNC_NAME = 'SetVisibelOption'
                const kLineOptions = {
                    indexBtnVisibel: true,//设置底部指标按钮是否显示，默认显示(MACD、KDJ等等)
                    indexInfoVisibel: true,//设置浮动指标信息是否显示，默认显示(当前鼠标所在位置的股票价格、涨幅等信息)
                    sharingplanOnly: false,//设置是否只显示分时图，默认K线和分时都显示(只显示分时的话就不能选择日K、周K等指标)
                    mainWnd: true,//设置主K线图窗口是否显示, 默认显示
                    volWnd: true,//设置柱状图窗口是否显示，默认显示
                    macdWnd: true,//设置macd窗口是否显示，默认显示
                    recordRight: true, //是否需要记录复权
                    fun: FUNC_NAME
                }
                try {
                    this.$refs.stockKline.postMessage(kLineOptions)
                } catch(error) {
                    this.$refs.stockKline[FUNC_NAME](kLineOptions)
                }
            } catch(error) {
                console.error(error)
            }
        },
        setKlineState(direction, status) {
            try {
                const FUNC_NAME = 'SetElementVisibleState'
                try {
                    const options = {
                        fun: FUNC_NAME,
                        position: direction,
                        vasible: status
                    }
                    this.$refs.stockKline.postMessage(options)
                } catch(error) {
                    this.$refs.stockKline[FUNC_NAME](direction, status)
                }
            } catch(error) {
                console.error(error)
            }
        },
        setAddStock() {
            try {
                const FUNC_NAME = 'MyStockAdd'
                try {
                    const options = {
                        fun: FUNC_NAME,
                        code: this.full_code,
                    }
                    this.$refs.stockKline.postMessage(options)
                } catch(error) {
                    this.$refs.stockKline[FUNC_NAME](this.full_code)
                }
            } catch(error) {
                console.error(error)
            }
        },
        setDelStock() {
            try {
                const FUNC_NAME = 'MyStockDel'
                try {
                    const options = {
                        fun: FUNC_NAME,
                        code: this.full_code,
                    }
                    this.$refs.stockKline.postMessage(options)
                } catch(error) {
                    this.$refs.stockKline[FUNC_NAME](this.full_code)
                }
            } catch(error) {
                console.error(error)
            }
        },
        setKlineCode() {
            try {
                const FUNC_NAME = 'SetCurrentStock'
                const residueParam = this.lineParams()
                try {
                    const options = {
                        fun: FUNC_NAME,
                        code: this.full_code,
                        codeType: this.codeType,
                    }
                    options.curIndex = residueParam.curIndex
                    options.indicator = residueParam.indicator
                    this.$refs.stockKline.postMessage(options)
                } catch(error) {
                    this.$refs.stockKline[FUNC_NAME](
                        this.full_code,
                        this.codeType,
                        residueParam.curIndex,
                        residueParam.indicator
                    )
                }
            } catch(error) {
                console.error(error)
            }
        },
        changeKlineState(direction, status) {
            this.setKlineState(direction, status)
        },
        setKlineTabs() {
            this.setKlineCode()
        },
    },
    beforeDestroy() {
        this.$_eventBus.$off('setKlineTabs', this.setKlineTabs)
        this.$_eventBus.$off('setKlineStyle', this.changeKlineState)
        this.$_eventBus.$off('setKlineStockAdd', this.setAddStock)
        this.$_eventBus.$off('setKlineStockDel', this.setDelStock)
    },
    watch: {
        full_code() {
            this.setKlineCode()
        },
        // 股票种类切换，重设底部状态
        hasInformation(val, oldValue) {
            this.isShowBottom(this.klineBottomState)
        },
    },
}
</script>
