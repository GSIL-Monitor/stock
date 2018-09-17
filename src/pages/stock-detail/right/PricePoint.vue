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
                :data="volume_list"
                :total_volume="total_volume"
                :close_price="close_price"
            />
            <PricePointDetail
                v-else
                :data="volume_list"
                :total_volume="total_volume"
                :close_price="close_price"
            />
        </div>
    </div>
</template>

<script>
import {
    mapState,
} from 'vuex'
import {
    pushData,
    UnSubscriptSockets,
} from '@c/utils/callQt'
import {
    FRAME_PRICE_POINT,
} from '../storage'

import PricePointSimple from './PricePointSimple'
import PricePointDetail from './PricePointDetail'

export default {
    name: 'pricePoint',
    data() {
        return {
            isSimple: true, // 默认简化模式
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
            this.isSimple = !this.isSimple
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
