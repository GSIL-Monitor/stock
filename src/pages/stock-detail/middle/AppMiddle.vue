<template>
<div
    :class="mainClasses"
>
    <div
        class="stock_chart"
    >
        <KLine/>
    </div>
    <div
        class="stock_info"
        v-if="hasInformation"
    >
        <InfoStockATemp
            :titleState="infoState"
            v-if="isAStock"
        />
        <InfoHSIndexTemp
            :titleState="infoState"
            v-if="isHSIndex"
        />
        <InfoHkStockTemp
            :titleState="infoState"
            v-if="isHkStock"
        />
    </div>
</div>
</template>

<script>
import {
    mapState,
    mapGetters,
    mapMutations,
} from 'vuex'
import {
    INFO_STATE,
} from '@store/stock-detail-store/config/mutation-types.js'

import KLine from './KLine.vue'
import InfoStockATemp from './InfoStockA.vue'
import InfoHSIndexTemp from './InfoHSIndex.vue'
import InfoHkStockTemp from './InfoHkStock.vue'

export default {
    name: 'Middle',
    created() {
        this.$_eventBus.$on('changeInfoState', this.changeInfoState)
    },
    computed: {
        ...mapState([
            'full_code',
            'current_type',
            'infoState',
        ]),
        ...mapGetters([
            'isAStock',
            'isHSIndex',
            'isHkStock',
            'hasInformation',
        ]),
        mainClasses() {
            let classes
            if (this.hasInformation) {
                if (this.infoState) {
                    classes = 'stock_chart_infoFull'
                } else {
                    classes = 'stock_chart_infoTitle'
                }
            } else {
                classes = 'stock_chart_fullHeight'
            }

            return [classes]
        },
    },
    methods: {
        ...mapMutations([
            INFO_STATE,
        ]),
        changeInfoState(state) {
            this[INFO_STATE](state)
            this.$_eventBus.$emit('setKlineStyle', 'bottom', state)
        },
    },
    components: {
        KLine,
        InfoStockATemp,
        InfoHSIndexTemp,
        InfoHkStockTemp,
    },
}
</script>

<style lang="less">
.stock_chart {
    width: 100%;
}

.root_main {
    height: 100%;
    border-left: 2px solid var(--color-background);
    border-right: 2px solid var(--color-background);
    flex-direction: column;
    &.stock_chart_infoFull {
        .stock_chart {
            height: calc(~'100% - 220px');
        }
        .stock_info {
            height: 220px;
        }
    }
    &.stock_chart_infoTitle {
        .stock_chart {
            height: calc(~'100% - 25px');
        }
        .stock_info {
            height: 25px;
        }
        .gg_tabs_content {
            height: 0;
            overflow: hidden;
        }
    }
    &.stock_chart_fullHeight {
        .stock_chart {
            height: 100%;
        }
    }
    .load_more {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-blue-7);
        background-color: var(--color-card-background);
        padding-left: 2px;
    }
}

.stock_info {
    .gg_tabs_wrap {
        font-size: 14px;
        height: 25px;
        flex-wrap: wrap;
        overflow: hidden;
    }
    .gg_tabs_tab {
        padding: 0 15px;
    }
    .td-openContent {
        cursor: pointer;
        &:hover {
            color: #096DD9;
        }
    }
    .info_ellipsis_td {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-left: 10px;

        &:before {
            content: '';
            display: inline-block;
            width: 2px;
            height: 2px;
            background-color: #d8d8d8;
            margin-right: 5px;
            vertical-align: 3px;
        }
    }
}
.stock_chart_infoFull {
    .gg_tabs {
        height: 100%;
    }
    .gg_tabs_content {
        height: calc(~'100% - 25px');
    }
    .info_wrap {
        height: 100%;
    }
    .info_date_td {
        white-space: nowrap;
        text-align: right;
        padding-right: 10px;
    }
    .info_tr {
        height: 28px;
        color: var(--color-primary-text);
        &.info_visited {
            color: var(--color-gray4);
        }
    }
    .info_vessel {
        height: 100%;
        overflow: auto;
    }
    .info_vessel_table {
        width: 100%;
    }
}
// .ht-table-container {
//     /deep/ table {
//         font-size: 14px;
//     }
// }
</style>
