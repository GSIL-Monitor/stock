<template>
    <div class="flow_bar">
        <chart
            class="fund_flow_bar"
            :options="chartOptions"
        ></chart>
    </div>
</template>

<script>
let xData = ['净特大单', '净大单', '净中单', '净小单']
let defaultOptions = {
    tooltip: {
        show: false,
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
        },
    },
    legend: {
        show: false,
    },
    grid: {
        top: 30,
        bottom: 10,
        left: 10,
        right: 10,
        containLabel: true,
    },
    xAxis: [
        {
            type: 'category',
            data: xData,
            axisTick: {
                show: false,
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(0,0,0,0.3)',
                    width: 1,
                    type: 'solid',
                },
            },
            axisLabel: {
                show: true,
                    textStyle: {
                        color: '#9a9a9a',
                    },
                },
            },
    ],
    yAxis: [
        {
            show: true,
            type: 'value',
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                show: false,
                formatter(data) {
                    return 0
                },
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
            data: [0, 0, 0, 0],
        },
    ],
}
export default {
    name: 'fundFlowBar',
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
    },
    props: {
        barData: {
            type: Object,
            required: true,
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

