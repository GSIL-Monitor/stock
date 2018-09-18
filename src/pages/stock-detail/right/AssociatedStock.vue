<template>
<div>
    <swiper
        v-if="dataStore.length"
        :options="swiperOption"
        ref="mySwiper"
    >
        <swiper-slide
            v-for="(item, index) of dataStore"
            :key="index"
            :data-index="index"
        >
            <div
                class="stock_premium"
            >
                <span
                    :class="premiumIco(item.source)"
                ></span>
                <div @click="changeStock(item)">
                    <span class="stock_premium_name">{{formatName(item.name)}}</span>
                    <span class="stock_premium_code">{{formatNormal(item.code)}}</span>
                </div>
                <Price
                    class="stock_premium_price"
                    :val="item.price"
                    :source="item.source"
                    :stock_type="item.stock_type"
                    :symbol_type="item.symbol_type"
                    :price_change="item.change_value"
                />
                <PriceChangeRate
                    class="stock_premium_changeRate"
                    :val="item.change_rate"
                    :price="item.price"
                    :source="item.source"
                    :stock_type="item.stock_type"
                    :symbol_type="item.symbol_type"
                    :price_change="item.change_value"
                />
                <span class="stock_premium_text">(&nbsp;溢价:&nbsp;</span>
                <span
                    :class="[formatDiscount(item.discount).color]"
                >
                    {{formatDiscount(item.discount).val}}
                </span>
                <span class="stock_premium_text">)</span>
            </div>
        </swiper-slide>
    </swiper>
</div>
</template>

<script>
import {
    mapState,
    mapGetters,
} from 'vuex'
import {
    getDiscountPremium,
} from '@service/'
import formatDiscountPremium from '@formatter/market-fields/discount-premium'
import {
    getTimeStamp,
} from '../utility'

import 'swiper/dist/css/swiper.css'
import {
    swiper,
    swiperSlide,
} from 'vue-awesome-swiper'
import Price from '@formatter/market-base/Price.vue'
import PriceChangeRate from '@formatter/market-base/PriceChangeRate.vue'

export default {
    name: 'AssociatedStock',
    components: {
        swiper,
        swiperSlide,
        Price,
        PriceChangeRate,
    },
    created() {
        this.fetchData()
    },
    data() {
        return {
            permissionTimer: null,
            dataStore: [],
        }
    },
    computed: {
        ...mapState([
            'full_code',
        ]),
        ...mapGetters([
            'isAStock',
            'isBStock',
            'isHkStock',
        ]),
        swiperOption() {
            const defaults = {
                direction: 'vertical',
                loop: true,
                speed: 800,
                autoplay: this.isAuto,
                preventClicks: true,
                allowTouchMove: false,
                zoom: false,
            }

            return defaults
        },
        isAuto() {
            return Object.is(this.dataStore.length, 1) ? false : {
                    delay: 2500,
                    disableOnInteraction: false
                }
        },
        getStockSymbol() {
            return this.isAStock ? 1 :
                   this.isBStock ? 5 :
                   this.isHkStock ? 1 :
                   1
        },
    },
    methods: {
        premiumIco(source) {
            return [
                "stock_premium_ico",
                {
                    'stock_premium_ico_AB': ['sh', 'sz'].includes(source),
                    'stock_premium_ico_H': Object.is(source, 'hk'),
                }
            ]
        },
        formatName(val) {
            if (val) {
                if (val.length > 6) {
                    return val.slice(0, 6) + '...'
                } else {
                    return val
                }
            } else {
                return '--'
            }
        },
        formatDiscount(val) {
            return formatDiscountPremium(val)
        },
        formatNormal(val) {
            return val || '--'
        },
        fetchData() {
            const params = {
                options: {
                    full_code: this.full_code,
                    symbol_type: this.getStockSymbol,
                },
                callback0: data => {
                    this.dataStore = data
                    this.resizeHeight()
                    this.permissionControl()
                },
                callback1001: () => {
                    this.dataStore = []
                    this.clearIntervalTimer()
                },
            }

            getDiscountPremium(params)
        },
        clearIntervalTimer() {
            if (this.permissionTimer) {
                clearInterval(this.permisssion_timer)
            }
        },
        ABStockControl() {
            let timeStamp = Date.now()
            let timeStamp9 = getTimeStamp(0, 8, 58)
            let timeStamp15 = getTimeStamp(0, 15, 2)
            if (timeStamp > timeStamp9 && timeStamp < timeStamp15) {
                this.fetchData()
            }
        },
        hkStockControl() {
            let timeStamp = Date.now()
            let timeStamp8 = getTimeStamp(0, 8, 43)
            let timeStamp16 = getTimeStamp(0, 16, 27)
            if (timeStamp > timeStamp8 && timeStamp < timeStamp16) {
                this.fetchData()
            }
        },
        permissionControl() {
            const STEP = 3000
            this.clearIntervalTimer()
            this.permissionTimer = setInterval(() => {
                if (this.isAStock || this.isBStock) {
                    this.hkStockControl()
                } else if (this.isHkStock) {
                    this.ABStockControl()
                }
            }, STEP)
        },
        resizeHeight() {
            this.$nextTick(() => {
                this.$emit('resizeWindow')
            })
        },
        resetComponent() {
            this.clearIntervalTimer()
            this.dataStore = []
        },
        changeStock(item) {
            console.log(item)
        },
    },
    beforeDestroy() {
        this.clearIntervalTimer()
    },
    watch: {
        full_code() {
            this.resetComponent()
            this.fetchData()
        },
    },
}
</script>

<style lang="less">
.swiper-container {
    height: 26px;
    border-top: 1px solid var(--color-dividers);
}
.stock_premium {
    display: flex;
    align-items: center;
    height: 100%;
    padding-left: 10px;
    font-size: 12px;
}

.stock_premium_ico {
    width: 15px;
    height: 15px;
    margin-right: 5px;
}
.stock_premium_price,
.stock_premium_changeRate {
    margin-left: 5px;
}
.stock_premium_changeRate {
    margin-right: 5px;
}
.stock_premium_name,
.stock_premium_code {
    text-decoration: underline;
    cursor: pointer;
    color: var(--color-blue);
}
.stock_premium_ico_AB {
    background: url('~@assets/ab_ico.png') no-repeat;
}
.stock_premium_ico_H {
    background: url('~@assets/h_ico.png') no-repeat;
}
</style>
