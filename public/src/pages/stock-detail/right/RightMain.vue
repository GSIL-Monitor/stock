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

import StockATemp from './StockA'
import StockBTemp from './StockB'
import FundTemp from './Fund'
import BondTemp from './Bond'
import MarketTemp from './Market'
import HkIndexTemp from './HkIndex'
import HkNormalTemp from './HkNormal'

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
