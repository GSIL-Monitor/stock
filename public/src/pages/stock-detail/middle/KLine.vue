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
import * as TYPE from '@formatter/config/stock-type-config'

export default {
    name: 'KLine',
    mounted() {
        this.initKLine()
        if (this.full_code) {
            this.setKlineCode()
        }
    },
    computed: {
        ...mapGetters([
            'isAStock',
        ]),
        ...mapState([
            'full_code',
            'current_type',
        ]),

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
                // [TYPE.FUTURES]: ''
            }

            return maps[this.current_type]
        },
    },
    methods: {
        lineParams(jump) {
            let curIndex,
                indicator;
            if (this.isAStock) {
                const TURN_NINE = 'turnNine' // 九转指标
                const SHORT_TRADER = 'shortTrader' // 多空操盘
                const FLOW = 'flow' // 资金流向
                if (Object.is(jump, TURN_NINE)) {
                    curIndex = ''
                    indicator = 'NINE_TURN'
                } else if (Object.is(jump, SHORT_TRADER)) {
                    curIndex = ''
                    indicator = 'BBTRADING'
                } else if (Object.is(jump, FLOW)) {
                    curIndex = 'ONE_DAY_MINUTE'
                    indicator = 'MAIN_FUND'
                } else {
                    curIndex = ''
                    indicator = ''
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
            var kLineOptions = {
                indexBtnVisibel: true,//设置底部指标按钮是否显示，默认显示(MACD、KDJ等等)
                indexInfoVisibel: true,//设置浮动指标信息是否显示，默认显示(当前鼠标所在位置的股票价格、涨幅等信息)
                sharingplanOnly: false,//设置是否只显示分时图，默认K线和分时都显示(只显示分时的话就不能选择日K、周K等指标)
                mainWnd: true,//设置主K线图窗口是否显示, 默认显示
                volWnd: true,//设置柱状图窗口是否显示，默认显示
                macdWnd: true,//设置macd窗口是否显示，默认显示
                recordRight: true, //是否需要记录复权
                fun: 'SetVisibelOption'
            }

            try {
                this.$refs.stockKline.postMessage(kLineOptions)
            } catch(event) {
                this.$refs.stockKline.SetVisibelOption(kLineOptions)
            }
        },
        initHeight() {

        },
        setKlineCode() {
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
                this.$refs.stockKline[FUNC_NAME].SetCurrentStock(
                    this.full_code,
                    this.codeType,
                    residueParam.curIndex,
                    residueParam.indicator
                )
            }
        },
    },
    beforeDestroy() {

    },
    watch: {
        full_code() {
            this.setKlineCode()
        },
    },
}
</script>
