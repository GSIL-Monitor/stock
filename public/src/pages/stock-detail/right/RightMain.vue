<template>
    <div
        class="root_right"
        v-if="rightState"
    >
        <StockATemp
            v-if="isAStock"
        />
        <MarketTemp
            v-if="isHSIndex"
        />
        <StockBTemp
            v-if="isBStock"
        />
        <FundTemp
            v-if="isFund"
        />
        <BondTemp
            v-if="isBond"
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
        ]),
    },
    components: {
        StockATemp,
        StockBTemp,
        FundTemp,
        BondTemp,
        MarketTemp,
    },
}
</script>
