<template>
    <div class="right_bottom_container">
        <div class="view_title">
            <span class="financial_title_dsc">简易财务</span>
            <LoadMore
                class="financial_title_more"
                @on-click="handleClick"
            />
        </div>
        <div class="view_vessel">
            <ul
                class="financial_list_one"
                v-for="(item, index) of config"
                :key="index"
            >
                <SimpleFinancialItem
                    v-for="(n, i) of item"
                    :key="i"
                    :text="n.text"
                    :className="n.result.color"
                    :val="n.result.val"
                />
            </ul>
        </div>
    </div>
</template>

<script>
import {
    mapState,
} from 'vuex'
import {
    getStockFinance,
} from '@service/index'
import {
    getUrlDomain,
} from '@c/utils/util'
import {
    sendEvent,
} from '@c/utils/callQt'
import {
    getReportShow,
    getCapitalStock,
    getBlueYen,
    getMixedYen,
    getShareHolder,
    getYellowPercent,
    getMixedPercent,
    getYellowNumber,
} from '@formatter/market-fields/financial'

import LoadMore from '../components/LoadMore.vue'
import SimpleFinancialItem from './SimpleFinancialItem.vue'

export default {
    name: 'SimpleFinancial',
    created() {
        this.getFinancialData()
    },
    data() {
        return {
            report_show: null,
            report_date: null,
            tradable_stock: null,
            stock_total: null,
            holder_count: null,
            ten_tradable: null,
            ffa1_04: null,
            ffa1_10: null,
            ffa1_01: null,
            ffa1_02: null,
            ffa1_38: null,
            ffa1_27: null,
            ffa1_28: null,
            ffa1_94: null,
            ffa1_91: null,
            ffa1_42: null,
            ffa1_14: null,
            ffa1_15: null,
            ffa1_17: null,
            ffa1_16: null,
            ffa1_18: null,
            ffa1_59: null,
            ffa1_12: null,
            ffa1_13: null,
        }
    },
    components: {
        SimpleFinancialItem,
        LoadMore,
    },
    computed: {
        ...mapState([
            'stock_code',
            'current_type',
            'full_code',
        ]),
        config() {
            return [
                [
                    {
                        text: '报告期',
                        result: this.formatReportShow,
                    },
                    {
                        text: '流通股本',
                        result: this.formatTradableStock,
                    },
                    {
                        text: '总股本',
                        result: this.formatStockTotal,
                    },
                    {
                        text: '股东人数',
                        result: this.formatHolderCount,
                    },
                    {
                        text: '前十大流通股东占比',
                        result: this.formatTenTradable,
                    },
                ],
                [
                    {
                        text: '主营收入',
                        result: this.formatFfa1_04,
                    },
                    {
                        text: '净利润',
                        result: this.formatFfa1_10,
                    },
                    {
                        text: '每股盈利',
                        result: this.formatFfa1_01,
                    },
                    {
                        text: '每股净资产',
                        result: this.formatFfa1_02,
                    },
                    {
                        text: '净资产收益率',
                        result: this.formatFfa1_38,
                    },
                ],
                [
                    {
                        text: '每股公积金',
                        result: this.formatFfa1_27,
                    },
                    {
                        text: '每股未分配利润',
                        result: this.formatFfa1_28,
                    },
                    {
                        text: '净利润同比',
                        result: this.formatFfa1_94,
                    },
                    {
                        text: '主营收入同比',
                        result: this.formatFfa1_91,
                    },
                    {
                        text: '销售毛利率',
                        result: this.formatFfa1_42,
                    },
                ],
                [
                    {
                        text: '总资产',
                        result: this.formatFfa1_14,
                    },
                    {
                        text: '流动资产',
                        result: this.formatFfa1_15,
                    },
                    {
                        text: '流动负债',
                        result: this.formatFfa1_17,
                    },
                    {
                        text: '总负债',
                        result: this.formatFfa1_16,
                    },
                    {
                        text: '股东权益',
                        result: this.formatFfa1_18,
                    },
                    {
                        text: '股东权益比',
                        result: this.formatFfa1_59,
                    },
                ],
                [
                    {
                        text: '经营现金流量',
                        result: this.formatFfa1_12,
                    },
                    {
                        text: '现金增加额',
                        result: this.formatFfa1_13,
                    },
                ],
            ]
        },
        formatReportShow() {
            return getReportShow(this.report_show, this.report_date)
        },
        formatTradableStock() {
            let val = this.tradable_stock ? this.tradable_stock * 10000 : this.tradable_stock
            return getCapitalStock(val)
        },
        formatStockTotal() {
            let val = this.stock_total ? this.stock_total * 10000 : this.stock_total
            return getCapitalStock(val)
        },
        formatFfa1_04() {
            return getBlueYen(this.ffa1_04)
        },
        formatFfa1_02() {
            return getBlueYen(this.ffa1_02)
        },
        formatFfa1_14() {
            return getBlueYen(this.ffa1_14)
        },
        formatFfa1_15() {
            return getBlueYen(this.ffa1_15)
        },
        formatFfa1_16() {
            return getBlueYen(this.ffa1_16)
        },
        formatFfa1_17() {
            return getBlueYen(this.ffa1_17)
        },
        formatFfa1_12() {
            return getBlueYen(this.ffa1_12)
        },
        formatFfa1_13() {
            return getBlueYen(this.ffa1_13)
        },
        formatFfa1_10() {
            return getMixedYen(this.ffa1_10)
        },
        formatFfa1_01() {
            return getMixedYen(this.ffa1_01)
        },
        formatFfa1_27() {
            return getMixedYen(this.ffa1_27)
        },
        formatFfa1_28() {
            return getMixedYen(this.ffa1_28)
        },
        formatHolderCount() {
            return getShareHolder(this.holder_count)
        },
        formatTenTradable() {
            return getYellowPercent(this.ten_tradable)
        },
        formatFfa1_38() {
            return getYellowPercent(this.ffa1_38)
        },
        formatFfa1_42() {
            return getYellowPercent(this.ffa1_42)
        },
        formatFfa1_59() {
            return getYellowNumber(this.ffa1_59)
        },
        formatFfa1_18() {
            return getBlueYen(this.ffa1_18)
        },
        formatFfa1_91() {
            return getMixedPercent(this.ffa1_91)
        },
        formatFfa1_94() {
            return getMixedPercent(this.ffa1_94)
        },
    },
    methods: {
        getFinancialData() {
            let param = {
                options: {
                    stock_code: this.stock_code,
                },
                callback0: data => {
                    let d = data[0]
                    this.report_show = d.report_show
                    this.report_date = d.report_date
                    this.tradable_stock = d.tradable_stock
                    this.stock_total = d.stock_total
                    this.holder_count = d.holder_count
                    this.ten_tradable = d.ten_tradable
                    this.ffa1_04 = d.ffa1_04
                    this.ffa1_10 = d.ffa1_10
                    this.ffa1_01 = d.ffa1_01
                    this.ffa1_02 = d.ffa1_02
                    this.ffa1_38 = d.ffa1_38
                    this.ffa1_27 = d.ffa1_27
                    this.ffa1_28 = d.ffa1_28
                    this.ffa1_94 = d.ffa1_94
                    this.ffa1_91 = d.ffa1_91
                    this.ffa1_42 = d.ffa1_42
                    this.ffa1_14 = d.ffa1_14
                    this.ffa1_15 = d.ffa1_15
                    this.ffa1_17 = d.ffa1_17
                    this.ffa1_16 = d.ffa1_16
                    this.ffa1_18 = d.ffa1_18
                    this.ffa1_59 = d.ffa1_59
                    this.ffa1_12 = d.ffa1_12
                    this.ffa1_13 = d.ffa1_13
                },
            }
            getStockFinance(param)
        },
        handleClick() {
            let hash = location.hash.substr(1)
            let baseUrl = getUrlDomain()
            let url = `${baseUrl}/html/companyInfo.html?stock_code=${hash}&top_tab=4`

            sendEvent('hidden', '', JSON.stringify({url}), true)
        },
    },
    watch: {
        full_code() {
            this.getFinancialData()
        },
    },
}
</script>

<style lang="less">
.financial_list_one {
    padding: 5px 10px;
}
.financial_list_one > li {
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
