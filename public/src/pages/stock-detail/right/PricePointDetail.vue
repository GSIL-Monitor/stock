<template>
    <div>
        <keep-alive>
            <chart
                class="price_point_chart"
                :auto-resize="true"
                :options="chartOptions"
                :style="priceChartStyle"
                ref="priceChart"
            ></chart>
        </keep-alive>
    </div>
</template>

<script>

import Props from '../mixins/price-point-mixin'
export default {
    name: 'PricePointDetail',
    mixins: [
        Props,
    ],
    created() {
        this.calcChartHeight()
        window.addEventListener('resize', this.calcChartHeight)
    },
    mounted() {
    },
    data() {
        return {
            redColor: '#f51d27',
            greenColor: '#29B81E',
            chartHeight: 150
        }
    },
    computed: {
        option() {
            let totalVolume = this.total_volume
            let closePrice = this.close_price

            return {
                legend: {
                    show: false
                },
                grid: {
                    top: 20,
                    bottom: 10,
                    left: 10,
                    right: 20,
                    containLabel: true
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                    formatter(params) {
                        let str = '';
                        let name = params[0].seriesName,
                            price = params[0].name,
                            volume = Number(params[0].value) + Number(params[1].value),
                            total = totalVolume / 100
                        let buy = params[1].value,
                            priceAll = params.reduce((sum, element)=>{
                                return sum += Number(element.value)
                            }, 0),
                            ratio = (volume / total * 100).toFixed(2),
                            buyRatio = (buy / priceAll * 100).toFixed(2)
                        str = `${name}
                                <br/>价格: ${price}
                                <br/>成交量: ${volume}
                                <br/>比例: ${ratio}%
                                <br/>买入占比: ${buyRatio}%`

                        return str;
                    },
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01],
                    splitLine: {
                        show: false,
                    },
                    splitNumber: 3,
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#c0c0c0',
                        },
                        formatter(value) {
                            var value = value / 100
                            if (value >= 10000) {
                                return value / 10000 + '万'
                            } else {
                                return value
                            }
                        }
                    }
                },
                yAxis: {
                    type: 'category',
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color(value) {
                                var color = '#c0c0c0';
                                if(value > closePrice.toFixed(2)){
                                    color = '#f51d27';
                                }else if(value<closePrice.toFixed(2)){
                                    color = '#29B81E';
                                }else if(value == closePrice.toFixed(2)){
                                    color = '#c0c0c0';
                                }
                                return color;
                            }
                        }
                    }
                },
                series: [],
            }
        },
        getChartParams() {
            const sericeData = [[], []]
            const yData = []
            ;[...this.data].reverse().forEach((element, index)=> {
                yData.push(element.price.toFixed(2));
                let volume = element.volume
                let v1 = volume['1'] || 0
                let v2 = volume['2'] || 0
                let v3 = volume['3'] || 0

                sericeData[0].push({
                    value: ((v1 + v3) / 100).toFixed(0),
                    totalVolume: this.total_volume,
                    itemStyle: {
                        normal: {
                            color: this.greenColor,
                        },
                        emphasis: {
                            color: this.greenColor,
                        },
                    }
                })

                sericeData[1].push({
                    value: (v2 / 100).toFixed(0),
                    totalVolume: this.total_volume,
                    itemStyle: {
                        normal: {
                            color: this.redColor,
                        },
                        emphasis: {
                            color: this.redColor,
                        },
                    },
                })
            })

            return {
                sericeData,
                yData,
            }
        },
        chartOptions() {
            let params = this.getChartParams
            let stack = 'timePrice'
            let type = 'bar'
            let name = '分价表'
            let series = [
                {
                    name,
                    type,
                    stack,
                    data: params.sericeData[0],
                },
                {
                    name,
                    type,
                    stack,
                    data: params.sericeData[1],
                }
            ]
            this.option.yAxis.data = params.yData
            this.option.series = series

            return this.option
        },
        priceChartStyle() {
            return {
                height: `${this.chartHeight}px`,
            }
        },
    },
    methods: {
        calcChartHeight() {
            var height = this.$parent.$refs.pricePointChartContainer.offsetHeight
            if (height < 150) {
                height = 150
            }
            this.chartHeight = height
        },
        // chartResize(event) {
        //     console.log(this)
        // },
        setEchart() {

        },
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.calcChartHeight)
    },
}
</script>
<style lang="less">
.echarts.price_point_chart {
    width: 319px;
    min-height: 150px;
    // height: auto;
}
</style>
