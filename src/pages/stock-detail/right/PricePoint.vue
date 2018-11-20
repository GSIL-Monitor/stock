<template>
    <div class="right_bottom_container">
        <div class="view_title">
            <span class="financial_title_dsc">分价表</span>
            <span
                @click="switchChange"
                :class="switchStyles"
            ></span>
        </div>
        <div class="view_vessel" ref="pricePointChartContainer">
            <div
                v-if="clear"
                class="extend_nodata"
            >
                暂无数据
            </div>
            <PricePointSimple
                v-else-if="isSimple"
                :chartData="volume_list"
                :total_volume="total_volume"
                :close_price="close_price"
            />
            <PricePointDetail
                v-else
                :chartData="volume_list"
                :total_volume="total_volume"
                :close_price="close_price"
            />
        </div>
    </div>
</template>

<script>
import {
    mapState,
    mapMutations,
} from 'vuex'
import {
    pushData,
    UnSubscriptSockets,
} from '@c/utils/callQt.js'
import {
    FRAME_PRICE_POINT,
} from '../storage.js'
import {
    SWITCH_PRICE_POINT,
} from '@store/stock-detail-store/config/mutation-types.js'

import PricePointSimple from './PricePointSimple.vue'
import PricePointDetail from './PricePointDetail.vue'

export default {
    name: 'PricePoint',
    data() {
        return {
            close_price: null,
            volume_list: [],
        }
    },
    created() {
        goGoal.event.listen(FRAME_PRICE_POINT, this.listenHanler)
        if (this.full_code) {
            this.sendFrame()
        }
    },
    computed: {
        ...mapState([
            'stock_code',
            'current_type',
            'full_code',
        ]),
        ...mapState({
            isSimple: state => state.modulePricePoint.isSimple,
        }),
        fieldsArr() {
            return [
                'total_volume',
                'volume_list',
                'close_price',
            ]
        },
        clear() {
            return Object.is(this.volume_list.length, 0)
        },
        switchStyles() {
            let prefix = 'financial_title_switch'
            let switchState = this.isSimple ? 'Off' : 'On'
            return [
                prefix,
                `${prefix}_${switchState}`
            ]
        },
    },
    methods: {
        ...mapMutations([
            SWITCH_PRICE_POINT,
        ]),
        sendFrame() {
            pushData(FRAME_PRICE_POINT, {
                code: this.full_code,
                field: this.fieldsArr.join(';'),
            })
        },
        listenHanler(data) {
            let d = JSON.parse(data)
            this.close_price = d.close_price
            if (Object.is(d.mark, 1)) {
                this.volume_list = []
            } else {
                this.total_volume = d.total_volume
                this.volume_list = d.volume_list
            }
        },
        switchChange() {
            this[SWITCH_PRICE_POINT]()
        },
    },
    components: {
        PricePointSimple,
        PricePointDetail,
    },
    beforeDestroy() {
        goGoal.event.remove(FRAME_PRICE_POINT, this.listenHanler)
        UnSubscriptSockets(FRAME_PRICE_POINT)
    },
    watch: {
        full_code() {
            if (this.full_code) {
                this.sendFrame()
            }
        }
    }
}
</script>

<style lang="less">
.financial_title_switch {
    width: 38px;
    height: 24px;
    cursor: pointer;
}
.financial_title_switch_On {
    background: url('~@assets/time-price-off.png') no-repeat center center;
}
.financial_title_switch_Off {
    background: url('~@assets/time-price-on.png') no-repeat center center;
}
</style>
