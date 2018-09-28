<template>
    <ul>
        <li
            v-for="(item, index) of chartData"
            :key="index"
            :class="liClasses(item.price)"
        >
            <div class="pirce_point_price">
                {{priceForamtter(item.price)}}
            </div>
            <div class="pirce_point_num">
                {{itemCount(index)}}
            </div>
            <div class="pirce_point_process">
                <div
                    class="pirce_point_process_bar"
                    :style="barStyles(index)"
                ></div>
            </div>
            <div
                class="pirce_point_ratio"
            >
                {{totalRatio(index)}}
            </div>
        </li>
    </ul>
</template>

<script>
import {
    dataFixed,
} from '@c/utils/util.js'

import Props from '../mixins/price-point-mixin.js'

export default {
    name: 'PricePointSimple',
    mixins: [
        Props,
    ],
    computed: {
        sumArr() {
            return this.chartData.map((element) => {
                return Object.entries(element.volume).reduce((sum, n) => {
                    return sum += n[1]
                }, 0)
            })
        },
        max() {
            return Math.max(...this.sumArr)
        },
    },
    methods: {
        priceForamtter(num) {
            return num.toFixed(2)
        },
        itemCount(index) {
            return (this.sumArr[index] / 100).toFixed(0)
        },
        barStyles(index) {
            let ratio = this.sumArr[index] / this.max * 100
            return [
                {
                    width: `${ratio}%`,
                }
            ]
        },
        liClasses(num) {
            let color = num > this.close_price ? 'Red' :
                   num < this.close_price ? 'Green' : 'Default'
            let prefix = 'pirce_point_li'
            return [
                prefix,
                `${prefix}_${color}`
            ]
        },
        totalRatio(index) {
            return dataFixed(this.sumArr[index] / this.total_volume, '%')
        },
    },
}
</script>

<style lang="less">
    .pirce_point_li {
        display: flex;
        height: 25px;
        align-items: center;
    }
    .pirce_point_price,
    .pirce_point_num,
    .pirce_point_ratio {
        text-align: right;
    }
    .pirce_point_price {
        flex: 0 0 50px;
    }
    .pirce_point_num {
        flex: 0 0 60px;
        margin-right: 20px;
    }
    .pirce_point_ratio {
        flex: 0 0 50px;
        margin-right: 5px;
    }
    .pirce_point_process {
        flex: 1;
    }
    .pirce_point_process_bar {
        height: 14px;
    }
    .pirce_point_li_Red {
        .pirce_point_price, .pirce_point_num {
            color: var(--color-red);
        }
        .pirce_point_process_bar {
            background-color: var(--color-red);
        }
    }
    .pirce_point_li_Green {
        .pirce_point_price, .pirce_point_num {
            color: var(--color-green);
        }
        .pirce_point_process_bar {
            background-color: var(--color-green);
        }
    }
    .pirce_point_li_Default {
        .pirce_point_process_bar {
            background-color: var(--color-primary-text);
        }
    }
</style>
