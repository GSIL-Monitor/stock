<template>
<div v-if="filterData.length" class="detail_head_btn_identify">
    <IdentifyIco
        v-for="(item, index) of filterData"
        :key="index"
        :className="item.class_name"
        :title="item.title"
        :type="item.type"
        :full_code="item.full_code"
        @on-click="jumpToModule"
    />
</div>
</template>

<script>
import {
    mapGetters,
} from 'vuex'
import {
    getStockIdentity,
} from '@service/'
import stockAIcoConfig from './stock-a-identify-config'
import hkStockIcoConfig from './hk-stock-identify-config'

import IdentifyIco from './IdentifyIco'

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
        jumpToModule(obj) {
            const { type, full_code } = obj
            console.log(type, full_code)
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
    color: #fff;
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
