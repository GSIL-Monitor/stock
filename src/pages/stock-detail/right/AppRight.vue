<template>
    <div
        class="root_right"
        v-show="rightState"
    >
        <component
            :is="currentView"
        >
        </component>
    </div>
</template>

<script>
import {
    mapState,
    mapGetters,
    mapMutations,
} from 'vuex'

import StockATemp from './StockA.vue'
import StockBTemp from './StockB.vue'
import FundTemp from './Fund.vue'
import BondTemp from './Bond.vue'
import MarketTemp from './Market.vue'
import HkIndexTemp from './HkIndex.vue'
import HkNormalTemp from './HkNormal.vue'

export default {
    name: 'RightMain',
    computed: {
        ...mapState([
            'rightState',
        ]),
        ...mapGetters([
            'isAStock',
            'isBStock',
            'isFund',
            'isBond',
            'isHSIndex',
            'isHkIndex',
            'isHkNormal',
        ]),
        currentView() {
            return this.isAStock ? StockATemp :
                   this.isBStock ? StockBTemp :
                   this.isFund ? FundTemp :
                   this.isBond ? BondTemp :
                   this.isHSIndex ? MarketTemp :
                   this.isHkIndex ? HkIndexTemp :
                   this.isHkNormal ? HkNormalTemp :
                   StockATemp
        },
    },
}
</script>
