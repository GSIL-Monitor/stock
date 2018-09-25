<template>
    <PopUp v-if="showFilter" :options="filterOptions" @close="closeFilter" @confirm="confirmPopUp">
        <div class="trans_filter">
            <div class="trans_filter_title">只显示满足以下条件的成交明细</div>
            <ul class="trans_filter_list">
                <li class="filter_item">
                    <span class="filter_item_ico" @click="clickIco(equal)" :class="{
                            on: equal.type === activeType
                        }"></span>
                    <span class="filter_item_label">等于</span>
                    <input class="filter_item_input filter_item_input_One"
                        v-model="equal.val.max"
                    >
                </li>
                <li class="filter_item">
                    <span class="filter_item_ico" @click="clickIco(less)" :class="{
                            on: less.type === activeType
                        }"></span>
                    <span class="filter_item_label">小于</span>
                    <input class="filter_item_input filter_item_input_One"
                        v-model="less.val.max"
                    >
                </li>
                <li class="filter_item">
                    <span class="filter_item_ico" @click="clickIco(more)" :class="{
                            on: more.type === activeType
                        }"></span>
                    <span class="filter_item_label">大于</span>
                    <input
                        class="filter_item_input filter_item_input_One"
                        v-model="more.val.min"
                    >
                </li>
                <li class="filter_item">
                    <span class="filter_item_ico" @click="clickIco(between)" :class="{
                            on: between.type === activeType
                        }"></span>
                    <span class="filter_item_label">介于</span>
                    <input
                        class="filter_item_input filter_item_input_Two"
                        v-model="between.val.min"
                    >
                    <span class="filter_item_connect">-</span>
                    <input
                        class="filter_item_input filter_item_input_Two"
                        v-model="between.val.max"
                    >
                </li>
            </ul>
        </div>
    </PopUp>
</template>

<script>
import {
    mapState,
} from 'vuex'
import popUpFiveSecond from '../components/popup-five-second.js'
import {
    ASTOCK,
} from '@formatter/config/stock-type-config.js'
import {
    LOCAL_TRANSATION_STORE,
} from '../storage.js'

import PopUp from '@c/popUp.vue'

const defaults = {
    equal: {
        type: 'equal',
        val: {
            max: '',
            min: '',
        },
    },
    less: {
        type: 'less',
        val: {
            max: '',
        },
    },
    more: {
        type: 'more',
        val: {
            min: '',
        },
    },
    between: {
        type: 'between',
        val: {
            max: '',
            min: '',
        },
    },
}

export default {
    name: 'TransaFilter',
    data() {
        let dft = JSON.parse(JSON.stringify(defaults))

        return {
            showFilter: false,
            ...dft,
            activeType: null,
            filterOptions: {
                title: '成交明细过滤',
                width: 242,
                height: 272,
                disabledrag: true,
                className: 'transation-filter-popUp',
                mask: true,
                confirmButton: true,
                cancelButton: true,
            },
        }
    },
    created() {
        this.getState()
        this.$eventBus.$on('showTransationFilter', this.filterMethod)
    },
    computed: {
        ...mapState(['current_type', 'full_code']),
    },
    methods: {
        closeFilter() {
            this.showFilter = false
        },
        filterMethod() {
            this.activeType = null
            Object.assign(this, JSON.parse(JSON.stringify(defaults)))

            this.getState()

            this.showFilter = true
        },
        clickIco(data) {
            let type = data.type
            if (Object.is(this.activeType, data.type)) {
                return false
            }
            this.activeType = data.type
        },
        getStore() {
            let store = localStorage.getItem(LOCAL_TRANSATION_STORE)
            store = store ? JSON.parse(store) : {}

            return store
        },
        getState() {
            let store = this.getStore()
            let item = store[this.full_code]
            if (item) {
                let max = item.max
                let min = item.min
                if (!max && !min) {
                    this.activeType = null
                } else if (max && !min) {
                    this.activeType = this.less.type
                    this.less.val.max = max
                } else if (!max && min) {
                    this.activeType = this.more.type
                    this.more.val.min = min
                } else if (Object.is(max, min)) {
                    this.activeType = this.equal.type
                    this.equal.val.max = max
                    this.equal.val.min = min
                } else {
                    this.activeType = this.between.type
                    this.between.val.max = max
                    this.between.val.min = min
                }
            } else {
                this.activeType = null
            }
        },
        isAllValidNumber(o) {
            return Object.keys(o).every(key => {
                let num = Number(o[key])
                return Number.isInteger(num) && num > 0
            })
        },
        verifyNumber(o) {
            if (!this.isAllValidNumber(o)) {
                let msg = '请在对应分类后输入正整数'
                popUpFiveSecond(msg, false, true)
                return false
            }
            if (Object.is(this.activeType, this.between.type)) {
                let min = o.min
                let max = o.max
                if (min >= max) {
                    let msg = '起始数据要小于结束数据'
                    popUpFiveSecond(msg, false, true)
                    return false
                }
            }

            return true
        },
        setState(o) {
            let store = this.getStore()
            store[this.full_code] = o

            localStorage.setItem(LOCAL_TRANSATION_STORE, JSON.stringify(store))
        },
        emitData(o) {
            this.$eventBus.$emit('transationFilter', o)
        },
        confirmPopUp() {
            if (this.activeType) {
                if (Object.is(this.activeType, this.equal.type)) {
                    this[this.activeType].val.min = this[this.activeType].val.max
                }
                let o = this[this.activeType].val
                // 进行输入判定
                let bool = this.verifyNumber(o)
                if (!bool) {
                    return false
                }
                // 正常情况
                this.setState(o)
                this.emitData(o)
                this.closeFilter()
            } else {
                this.closeFilter()
            }
        },
    },
    beforeDestroy() {
        this.$eventBus.$off('showTransationFilter', this.filterMethod)
    },
    components: {
        PopUp,
    },
    watch: {
        full_code() {
            if (this.showFilter) {
                this.showFilter = false
            }
        },
    },
}
</script>

<style lang="less">
    .trans_filter {
        display: flex;
        flex-direction: column;
        padding: 10px 20px;
        font-size: 14px;
    }
    .trans_filter_title {
        height: 30px;
        line-height: 30px;
    }
    .filter_item {
        height: 30px;
        margin-top: 5px;
        display: flex;
        align-items: center;
    }
    .filter_item_ico {
        width: 14px;
        height: 14px;
        cursor: pointer;
        background-color: #267;
        background: url('~@assets/select-box.png') no-repeat center center;
        margin-right: 2px;
        &.on {
            background-image: url('~@assets/select-box-on.png');
        }
    }
    .filter_item_label {
        white-space: nowrap;
        margin-right: 10px;
    }
    .filter_item_input {
        padding: 0 5px;
        height: 26px;
        border: 1px solid #ccc;
        outline: 0;
        background: #fff;
    }
    .filter_item_input_One {
        width: 135px;
    }
    .filter_item_connect {
        margin-left: 5px;
        margin-right: 5px;
    }
    .filter_item_input_Two {
        width: 60px;
    }
    .transation-filter-popUp {
        .popup {
            left: auto !important;
            top: auto !important;
            right: 0px !important;
            bottom: 0px !important;
        }
        .popup_top {
            cursor: default;
        }
        .popup_footer {
            border-top-color: transparent;
        }
    }
</style>
