<template>
<div v-if="filterData.length" class="detail_head_btn_identify">
    <IdentifyIco
        v-for="(item, index) of filterData"
        :key="index"
        :className="item.class_name"
        :title="item.title"
        :type="item.type"
        :full_code="item.full_code"
        @on-click="handleClick"
    />
</div>
</template>

<script>
import {
    mapGetters,
} from 'vuex'
import {
    getStockIdentity,
} from '@service/index.js'
import {
    sendEvent,
    JsToQtEventInterface,
} from '@c/utils/callQt.js'
import stockAIcoConfig from './stock-a-identify-config.js'
import hkStockIcoConfig from './hk-stock-identify-config.js'

import IdentifyIco from './IdentifyIco.vue'

export default {
    name: 'StockIdentify',
    created() {
        this.fetchData()
    },
    data() {
        return {
            dataStore: {},
        }
    },
    computed: {
        ...mapGetters([
            'isAStock',
            'isHkStock',
        ]),
        isNotEmpty() {
            return Object.keys(this.dataStore).length !== 0
        },
        icoConfig() {
            if (this.isAStock) {
                return stockAIcoConfig
            } else if (this.isHkStock) {
                return hkStockIcoConfig
            }
        },
        filterData() {
            if (this.isNotEmpty) {
                const arr = []
                for (let [key, value] of this.icoConfig.entries()) {
                    if (this.dataStore[key]) {
                        const val = Object.assign({}, {
                            full_code: this.dataStore[key]
                        }, value)
                        arr.push(val)
                    }
                }

                return arr
            } else {
                return []
            }
        },
    },
    components: {
        IdentifyIco,
    },
    methods: {
        fetchData() {
            const param = {
                options: {
                    full_code: this.full_code,
                },
                callback0: data => {
                    this.dataStore = data
                },
                callback1001: () => {
                    this.dataStore = {}
                },
            }
            getStockIdentity(param)
        },
        resetComponent() {
            this.dataStore = {}
        },
        skipStockMarket(params) {
            params = JSON.stringify(params);
            sendEvent('stockMarket', 'stockMarketDetail', params, true);
        },
        skipStockMarketIndustry(plateCode, plateName, type) {
            if (type == '1') {
                type = 'gn_index'
            } else if(type == '-2') {
                type = 'hy_index'
            } else if(type == '2') {
                type = 'index'
            }
            const params = {
                code: 'LB' + plateCode,
                name: encodeURIComponent(plateName),
                type: type,
            }
            JsToQtEventInterface(JSON.stringify({
                fun: 'SendwebTowebEvent',
                data: {
                    destID: 'stockMarket',//目的webid
                    eventName: 'plateSelected',//事件名
                    eventContent: JSON.stringify(params),//事件参数
                },
            }))
        },
        handleClick(obj) {
            const { type, full_code } = obj
            switch (type) {
                case "sh-tong":
                // 沪股通
                this.skipStockMarket({
                    hash: "hsStock",
                    module_type: "7",
                });
                break;
                case "sz-tong":
                // 深股通
                this.skipStockMarket({
                    hash: "hsStock",
                    module_type: "8",
                });
                break;
                case "margin-trading":
                // 融资融券
                this.skipStockMarketIndustry(full_code, "融资融券", "1");
                break;
                case "sz50":
                // 上证50
                this.skipStockMarketIndustry(full_code, "上证50", "2");
                break;
                case "hs300":
                // 沪深300
                this.skipStockMarketIndustry(full_code, "沪深300", "2");
                break;
                case "hk-tong":
                //港股通
                this.skipStockMarket({
                    hash: "hk_stock",
                    module_type: "8;9"
                });
                break;
                case "hsi-index":
                // 恒生指数成分股
                this.skipStockMarket({
                    hash: "hk_stock",
                    module_type: "14"
                });
                break;
            }
        },
    },
    watch: {
        full_code() {
            this.resetComponent()
            this.fetchData()
        },
    },
    props: {
        full_code: {
            type: String,
        },
    },
}
</script>

<style lang="less" scoped>
@red: #e03c43;
@yellow: #efa440;
.detail_head_btn_identify {
    font-size: 12px;
    color: var(--color-white);
    display: flex;
    .identify_ico {
        margin-left: 1px;
        cursor: pointer;
        &:first-child {
            margin-left: 0;
        }
    }
    .general-ico {
        background-color: @red;
        &:after {
            content: '通';
        }
    }
    .melt-ico {
        background-color: @yellow;
        &:after {
            content: '融';
        }
    }
    .hsi-ico {
        font-size: 14px;
        background-color: @yellow;
        &:after {
            content: '恒';
        }
    }
    .sz-50 {
        font-size: 14px;
        background-color: #4740B8;
        &:after {
            content: 'IH';
        }
    }
    .hs-300 {
        font-size: 14px;
        background-color: @yellow;
        &:after {
            content: 'IF';
        }
    }
}
</style>
