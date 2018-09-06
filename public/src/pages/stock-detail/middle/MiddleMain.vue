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
            :titleState="infoStoreState"
            v-if="isAStock"
        />
        <InfoHSIndexTemp
            :titleState="infoStoreState"
            v-if="isHSIndex"
        />
        <InfoHkStockTemp
            :titleState="infoStoreState"
            v-if="isHkStock"
        />
    </div>
</div>
</template>

<script>
import {
    mapState,
    mapGetters,
} from 'vuex'
import KLine from './KLine'
import InfoStockATemp from './InfoStockA'
import InfoHSIndexTemp from './InfoHSIndex'
import InfoHkStockTemp from './InfoHkStock'
import {
    getInfoState,
    setInfoState,
} from './info-storage-state'

export default {
    name: 'Middle',
    created() {
        this.$eventBus.$on('changeInfoState', this.changeInfoState)
        this.initState()
    },
    data() {
        return {
            infoStoreState: false,
        }
    },
    computed: {
        ...mapGetters([
            'isAStock',
            'isHSIndex',
            'isHkStock',
        ]),
        ...mapState([
            'full_code',
            'current_type',
        ]),
        hasInformation() {
            return this.isAStock || this.isHSIndex || this.isHkStock
        },
        mainClasses() {
            let classes
            if (this.hasInformation) {
                if (this.infoStoreState) {
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
        initState() {
            this.infoStoreState = this.isInfoFullHeight()
        },
        isInfoFullHeight() {
            let state = getInfoState()

            return Object.is(state, 'true')
        },
        changeInfoState(state) {
            this.infoStoreState = state
            setInfoState(state)
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
    }
    &.stock_chart_fullHeight {
        .stock_chart {
            height: 100%;
        }
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
    .info_date_td {
        width: 113px;
        white-space: nowrap;
        text-align: right;
    }
    .info_tr {
        height: 28px;
    }
    .info_vessel {
        height: 100%;
        overflow: auto;
    }
    .info_vessel_table {
        width: 100%;
    }
}
</style>
