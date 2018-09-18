<template>
    <div
        class="root_right"
        v-show="rightState"
    >
        <StockATemp
            v-if="isAStock"
        />
        <MarketTemp
            v-else-if="isHSIndex"
        />
        <HkNormalTemp
            v-else-if="isHkNormal"
        />
        <HkIndexTemp
            v-else-if="isHkIndex"
        />
        <StockBTemp
            v-else-if="isBStock"
        />
        <FundTemp
            v-else-if="isFund"
        />
        <BondTemp
            v-else-if="isBond"
        />
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
    },
    components: {
        StockATemp,
        StockBTemp,
        FundTemp,
        BondTemp,
        MarketTemp,
        HkIndexTemp,
        HkNormalTemp,
    },
}
</script>
