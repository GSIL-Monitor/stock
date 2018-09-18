<template>
    <div class="flow_chart">
        <keep-alive>
            <chart
                class="fund_flow_chart"
                :manual-update="true"
                ref="mychart"
            ></chart>
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: 'FundFlowPie',
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
        inflow() {
            // 主力资金 = 特大单 + 大单的净流入
            let num = this.pieData.buy_0 + this.pieData.buy_1 - this.pieData.sell_0 - this.pieData.sell_1

            return num
        },
        getSeries() {
            const RED = this.RED_COLOR
            const GREEN = this.GREEN_COLOR

            return [
                {
                    value: this.pieData.buy_0,
                    name: '特大买单',
                    itemStyle: {
                        normal: {
                            color: RED,
                            opacity: 0.4,
                        }
                    },
                },
                {
                    value: this.pieData.buy_1,
                    name: '大买单',
                    itemStyle: {
                        normal: {
                            color: RED,
                            opacity: 0.6,
                        }
                    },
                },
                {
                    value: this.pieData.buy_2,
                    name: '中大买单',
                    itemStyle: {
                        normal: {
                            color: RED,
                            opacity: 0.8,
                        }
                    },
                },
                {
                    value: this.pieData.buy_3,
                    name: '小买单',
                    itemStyle: {
                        normal: {
                            color: RED,
                            opacity: 1,
                        }
                    },
                },
                {
                    value: this.pieData.sell_3,
                    name: '小卖单',
                    itemStyle: {
                        normal: {
                            color: GREEN,
                            opacity: 1,
                        }
                    },
                },
                {
                    value: this.pieData.sell_2,
                    name: '中卖单',
                    itemStyle: {
                        normal: {
                            color: GREEN,
                            opacity: 0.8,
                        }
                    },
                },
                {
                    value: this.pieData.sell_1,
                    name: '大卖单',
                    itemStyle: {
                        normal: {
                            color: GREEN,
                            opacity: 0.6,
                        }
                    },
                },
                {
                    value: this.pieData.sell_0,
                    name: '特大卖单',
                    itemStyle: {
                        normal: {
                            color: GREEN,
                            opacity: 0.4,
                        }
                    },
                }
            ]
        },
        defaultOptions() {
            let flowNumber = this.inflow
            let color = flowNumber >= 0 ? 'red' : 'green'
            return {
                tooltip: {
                    trigger: 'item',
                    show: false,
                },
                series: [
                    {
                        name: '资金流向',
                        type: 'pie',
                        radius: ['60%','90%'],
                        center: ['50%', '50%'],
                        // data:pushData,
                        startAngle: '-90',
                        avoidLabelOverlap: false,
                        stillShowZeroSum: false,
                        hoverAnimation: false,
                        label: {
                            normal: {
                                show: true,
                                position: 'center',
                                formatter(data) {
                                    if (data.dataIndex === 0) {
                                        let value = Math.abs(flowNumber) >= 100 ? flowNumber.toFixed(0) : flowNumber.toFixed(1)
                                        return '净流入\n' + value + '\n万元'
                                    } else {
                                        return ''
                                    }
                                },
                                textStyle: {
                                    color,
                                    fontSize: 16,
                                },
                            },
                            emphasis: {
                                show: true,
                                position: 'center',
                                formatter(data) {
                                    if (data.dataIndex === 0) {
                                        let value = Math.abs(flowNumber) >= 100 ? flowNumber.toFixed(0) : flowNumber.toFixed(1)
                                        return '净流入\n' + value + '\n万元'
                                    } else {
                                        return ''
                                    }
                                },
                                textStyle: {
                                    color,
                                    fontSize: 16,
                                },
                            },
                        },
                        labelLine: {
                            normal: {
                                show: false,
                            },
                        },
                    }
                ]
            }
        },
        chartOptions() {
            this.defaultOptions.series[0].data = this.getSeries

            return this.defaultOptions
        },
    },
    methods: {
        mergeOptions() {
            this.$refs.mychart.mergeOptions(this.chartOptions)
        },
    },
    props: {
        pieData: {
            type: Object,
            required: true,
        },
    },
    watch: {
        pieData() {
            this.mergeOptions()
        },
    },
}
</script>

<style lang="less">
    .flow_chart {
        margin-top: 30px;
    }
    .flow_chart .fund_flow_chart {
        width: 142px;
        height: 142px;
    }
</style>
