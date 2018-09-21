<template>
    <table class="consensus_table">
        <thead>
            <tr
                v-for="(item, index) of setTheadSlist"
                v-if="item.data.length"
                :key="index"
            >
                <td>{{item.text}}</td>
                <td
                    v-for="(n, i) of item.data"
                    :key="i"
                >
                    <span
                        :class="[n.color]"
                    >
                        {{n.val}}
                    </span>
                </td>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="(item, index) of setTbodySlist"
                v-if="item.data.length"
                :key="index"

            >
                <td>{{item.text}}</td>
                <td
                    v-for="(n, i) of item.data"
                    :key="i"
                >
                    <span
                        :class="[n.color]"
                    >
                        {{n.val}}
                    </span>
                </td>
            </tr>
        </tbody>
        <tfoot v-if="showFooter">
            <tr>
                <td
                    colspan="4"
                    class="consensus_table_more"
                    @click="toDiagnose"
                >
                    更多数据
                    <span class="consensus_table_more_deep">&gt;&gt;</span>
                </td>
            </tr>
        </tfoot>
    </table>
</template>

<script>
import {
    mapState,
} from 'vuex'
import {
    getSelfConsensus,
} from "@service/index"
import {
    getFixedNum,
    getPercentNum,
    getYearSuffix,
} from '@formatter/market-fields/consensus'
import {
    getMoneyFormat,
} from '@formatter/market-fields/financial'
import {
    JsToQtEventInterface,
    sendEvent,
} from '@c/utils/callQt'
import {
    cloneDeep,
} from 'lodash'

export default {
    name: 'ConsensusTable',
    created() {
        if (this.stock_code) {
            this.getConsensusData()
        }
    },
    data() {
        return {
            showFooter: false,
            theadOrder: [
                {
                    text: '一致预期',
                    data: [],
                }
            ],
            tbodyOrder: [
                {
                    fields: 'eps',
                    text: 'EPS',
                    data: [],
                    formatter: getFixedNum,
                },
                {
                    fields: 'eps_yoy',
                    text: 'EPS同比',
                    data: [],
                    formatter: getPercentNum,
                },
                {
                    fields: 'profit',
                    text: '净利润',
                    data: [],
                    formatter: this.formatRetainedProfits,
                },
                {
                    fields: 'profit_yoy',
                    text: '净利润同比',
                    data: [],
                    formatter: getPercentNum,
                },
                {
                    fields: 'pe',
                    text: 'PE',
                    data: [],
                    formatter: getFixedNum,
                },
                {
                    fields: 'pb',
                    text: 'PB',
                    data: [],
                    formatter: getFixedNum,
                },
                {
                    fields: 'ckroe',
                    text: 'ROE',
                    data: [],
                    formatter: getPercentNum,
                },
            ],
        }
    },
    computed: {
        ...mapState([
            'stock_name',
        ]),
        fieldsOrder() {
            return this.tbodyOrder.map((ele) => {
                return ele.fields
            })
        },
        setTheadSlist() {
            const slit = cloneDeep(this.theadOrder)
            slit.forEach((ele, index) => {
                ele.data.forEach((n, i, arr) => {
                    arr[i] = this.formatYear(n, i)
                })
            })

            return slit
        },
        setTbodySlist() {
            const slit = cloneDeep(this.tbodyOrder)
            slit.forEach((ele, index) => {
                const formatter = ele.formatter
                ele.data.forEach((n, i, arr) => {
                    arr[i] = formatter(n)
                })
            })

            return slit
        }
    },
    methods: {
        toDiagnose() {
            // 跳转诊股数据一分钟
            const params = JSON.stringify({
                moduleName: "stock",
                stock_code: this.stock_code,
                stock_name: encodeURIComponent(this.stock_name),
            });
            JsToQtEventInterface(JSON.stringify({
                fun: "SendIdToGoBackHistory",
                data: {
                    moduleID: "diagnose_stock"
                }
            }))
            sendEvent('diagnose', 'diagnoseStockCode', params, true);
        },
        formatYear(num, index) {
            if (!num) {
                return {
                    val: '--'
                }
            }
            if (index === 0) {
                let suffix = getYearSuffix()
                return {
                    val: `${num}${suffix}`
                }
            } else {
                return {
                    val: `${num}E`
                }
            }
        },
        formatRetainedProfits(val) {
            return {
                val: getMoneyFormat(val)
            }
        } ,
        getConsensusData() {
            let param = {
                options: {
                    stock_code: this.stock_code
                },
                callback0: (data) => {
                    this.fieldsOrder.reduce(
                        (arr, cur, i) => {
                            arr[i] = []
                            data.forEach((ele) => {
                                arr[i].push(ele[cur])
                            })
                            return arr
                        },
                        [],
                    ).forEach((ele, i) => {
                        this.tbodyOrder[i].data = ele
                    })

                    this.theadOrder[0].data = data.reduce(
                        (arr, cur, i) => {
                            arr.push(cur.year)

                            return arr
                        },
                        [],
                    )

                    this.showFooter = true
                },
                callback1001: () => {
                    this.theadOrder[0].data =  [null, null, null]
                    this.fieldsOrder.reduce(
                        (arr, cur, i) => {
                            arr[i] = []
                            for (let index = 0; index < 3; index++) {
                                arr[i].push('--')
                            }

                            return arr
                        },
                        [],
                    ).forEach((ele, i) => {
                        this.tbodyOrder[i].data = ele
                    })
                    this.showFooter = true
                },
                afterResponse: () => {

                },
            }

            getSelfConsensus(param)
        }
    },
    props: [
        'stock_code'
    ]
}
</script>

<style lang="less">
.consensus_table {
    color: var(--color-primary-text);
    cursor: pointer;
    thead {
        background: var(--color-table-header);
    }
    tr {
        th, td {
            width: 21%;
            white-space: nowrap;
            padding-left: 5px;
            padding-right: 10px;
            text-align: right;
        }
        td:first-child,
        th:first-child {
            width: 27%;
            text-align: left;
        }
        td.consensus_table_more {
            color: var(--color-link);
            text-align: center;
            .consensus_table_more_deep {
                color: #B5B5B5;
            }
        }
    }
}

</style>


