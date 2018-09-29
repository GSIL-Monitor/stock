<template>
<default-btn
    :label="showState.label"
    :class="myStockClasses"
    :title="showState.title"
    @on-click="changeMyStock"
>
    {{showState.label}}
</default-btn>
</template>

<script>
import {
    mapState,
} from 'vuex'
import {
    getMyStockIsAdd,
    addStock,
    delMyStock,
} from '@service/index.js'
import {
    syncMyStockState,
} from '../utility.js'

import DefaultBtn from '../components/DefaultBtn.vue'

export default {
    name: 'IsMyStock',
    created() {
        this.$_eventBus.$on('revalidateIsMyStock', this.revalidateIsMyStock)
        this.fetchData()
    },
    data() {
        return {
            show: {},
            inMyStockList: false,
            sure: {
                label: '+',
                title: '添加到自选股',
            },
            not: {
                label: '-',
                title: '从自选股删除',
            },
        }
    },
    computed: {
        ...mapState([
            'full_code',
            'symbol_type',

        ]),
        showState() {
            return {
                label: this.show.label || '',
                title: this.show.title || '',
            }
        },
        myStockClasses() {
            let prefix = 'is_myStock'
            return [
                prefix,
                {
                    [`${prefix}_Visibile`]: !this.show.label
                },
            ]
        },
    },
    components: {
        DefaultBtn,
    },
    methods: {
        fetchData() {
            const params = {
                options: {
                    full_code: this.full_code,
                },
                callback0: data => {
                    if (data.is_defined) {
                        this.setInMyStockState()
                        this.$_eventBus.$emit('setKlineStockAdd')
                    } else {
                        this.setNotInMyStockState()
                        this.$_eventBus.$emit('setKlineStockDel')
                    }
                },
            }

            getMyStockIsAdd(params)
        },
        setInMyStockState() {
            this.show = Object.assign({}, this.not)
            this.inMyStockList = true
        },
        setNotInMyStockState() {
            this.show = Object.assign({}, this.sure)
            this.inMyStockList = false
        },
        delFromMyStock() {
            const params = {
                options: {
                    full_codes: this.full_code,
                },
                callback0: data => {
                    this.setNotInMyStockState()
                    // 模块同步
                    syncMyStockState()
                    // 更新左侧状态
                    this.$_eventBus.$emit('correctionData', this.inMyStockList)
                    // 发送事件到框架
                    this.$_eventBus.$emit('setKlineStockDel')
                },
            }

            delMyStock(params)
        },
        addToMyStock() {
            const params = {
                options: {
                    full_code: this.full_code,
                    group_class: 1,
                    stock_class: 2,
                    type: this.symbol_type,
                },
                callback0: data => {
                    if (Object.is(data.datacode, 101)) {
                        alert("添加失败！自选股最多添加500个！")
                    } else {
                        this.setInMyStockState()
                        // 模块同步
                        syncMyStockState()
                        // 更新左侧状态
                        this.$_eventBus.$emit('correctionData', this.inMyStockList)
                        // 发送事件到框架
                        this.$_eventBus.$emit('setKlineStockAdd')
                    }
                },
            }
            addStock(params)
        },
        changeMyStock() {
            if (this.inMyStockList) {
                this.delFromMyStock()
            } else {
                this.addToMyStock()
            }
        },
        resetState() {
            this.show = {}
            this.inMyStockList = false
        },
        revalidateIsMyStock() {
            this.resetState()
            this.fetchData()
        },
    },
    beforeDestroy() {
        this.$_eventBus.$off('revalidateIsMyStock', this.revalidateIsMyStock)
    },
    watch: {
        full_code() {
            this.resetState()
            this.fetchData()
        },
    },
}
</script>

<style lang="less">
.is_myStock {
    width: 20px;
    height: 20px;
    padding: 0;
    font-size: 16px;
    font-weight: 700;
}
.is_myStock_Visibile {
    visibility: hidden;
}
</style>
