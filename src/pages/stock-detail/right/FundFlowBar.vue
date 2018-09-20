<template>
    <div class="flow_bar">
        <keep-alive>
            <chart
                class="fund_flow_bar"
                :manual-update="true"
                ref="mychart"
            ></chart>
        </keep-alive>
    </div>
</template>

<script>
import {
    isNumber,
} from '@formatter/utility'

const xData = ['净特大单', '净大单', '净中单', '净小单']
const defaultOptions = {
    grid: {
        top: 30,
        bottom: 10,
        left: 10,
        right: 10,
        containLabel: true,
    },
    xAxis: {
        type: 'category',
        data: xData,
        axisTick: {
            show: false,
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: 'rgba(0,0,0,0.3)',
            },
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: '#9a9a9a',
            },
        },
    },
    yAxis: [
        {
            show: false,
            type: 'value',
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                show: false,
            },
            axisLine: {
                show: false,
            },
        },
    ],
    series: [
        {
            name: '资金流向',
            type: 'bar',
            barWidth: '80%',
            data: [],
        },
    ],
}

export default {
    name: 'FundFlowBar',
    mounted() {
        this.mergeOptions()
    },
    data() {
        return {
            RED_COLOR: '#ff2b49',
            GREEN_COLOR: '#32a55f',
        }
    },
    computed: {
        getSerice() {
            let one = this.barData.buy_0 - this.barData.sell_0
            let two = this.barData.buy_1 - this.barData.sell_1
            let three = this.barData.buy_2 - this.barData.sell_2
            let four = this.barData.buy_3 - this.barData.sell_3
            one = isNumber(one) ? one : null
            two = isNumber(two) ? two : null
            three = isNumber(three) ? three : null
            four = isNumber(four) ? four : null
            let sericeData = []
            sericeData.push(this.eachSerice(one, xData[0], '0.4'))
            sericeData.push(this.eachSerice(two, xData[1], '0.6'))
            sericeData.push(this.eachSerice(three, xData[2], '0.8'))
            sericeData.push(this.eachSerice(four, xData[3], '1.0'))

            return sericeData
        },
        chartOptions() {
            defaultOptions.series[0].data = this.getSerice

            return defaultOptions
        },
    },
    methods: {
        eachSerice(data, name, opacity) {
            let color = data >= 0 ? this.RED_COLOR : this.GREEN_COLOR
            return {
                name: name,
                value: data,
                itemStyle: {
                    normal: {
                        color: color,
                        opacity: opacity,
                    },
                    emphasis: {
                        color: color,
                        opacity: opacity,
                    },
                },
                label: {
                    normal: {
                        show: true,
                        color: color,
                        position: 'top',
                        formatter(data) {
                            let val = data.value
                            let value = Math.abs(val) >= 100 ? val.toFixed(0) : val.toFixed(1)

                            return value
                        },
                    },
                    emphasis: {
                        show: true,
                        color: color,
                        position: 'top',
                    },
                },
            }
        },
        mergeOptions() {
            this.$refs.mychart.mergeOptions(this.chartOptions)
        },
    },
    props: {
        barData: {
            type: Object,
            required: true,
        },
    },
    watch: {
        barData() {
            this.$refs.mychart.mergeOptions(this.chartOptions)
        },
    },
}
</script>

<style lang="less">
.flow_bar .fund_flow_bar {
    width: 300px;
    height: 150px;
    margin: 0 auto;
}
</style>

