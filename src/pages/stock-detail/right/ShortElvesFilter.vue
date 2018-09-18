<template>
    <PopUp v-if="showFilter" :options="filterOptions" @close="closeFilter" @confirm="confirmPopUp">
        <div class="shortline_filter" >
            <ShortElvesFilterItem
                v-for="(item, index) of shortLineType"
                :key="index"
                class="shortline_filter_item"
                :type="item[0]"
                :label="item[1]"
                :isActive="item[2]"
                @on-click="itemClick"
            />
        </div>
    </PopUp>
</template>

<script>
import {
    LOCAL_SHORT_LINE_SET,
} from '../storage'
import shortLineType from '@formatter/config/short-line-config'

import PopUp from '@c/popUp.vue'
import ShortElvesFilterItem from './ShortElvesFilterItem.vue'

export default {
    name: 'ShortElvesFilter',
    created() {
        this.initState()
        this.$eventBus.$on('showShortLineFilter', this.filterMethod)
    },
    data() {
        return {
            showFilter: false,
            shortLineType: [...shortLineType],
            localStore: null,
            filterOptions: {
                title: '短线精灵设置',
                width: 242,
                height: 282,
                disabledrag: true,
                className: 'shortline-filter-popUp',
                mask: true,
                confirmButton: true,
                cancelButton: true,
            },
        }
    },
    components: {
        PopUp,
        ShortElvesFilterItem,
    },
    methods: {
        getStore() {
            let store = localStorage.getItem(LOCAL_SHORT_LINE_SET)
            return store ? JSON.parse(store) : this.getAllType()
        },
        setStore() {
            localStorage.setItem(LOCAL_SHORT_LINE_SET, JSON.stringify(this.localStore))
        },
        getAllType() {
            return this.shortLineType.map((element)=>{
                return element[0]
            })
        },
        initState() {
            let store = this.getStore()
            this.localStore = store
            this.shortLineType.forEach((element) => {
                const type = element[0]
                element[2] = store.includes(type)
            })
        },
        closeFilter() {
            this.showFilter = false
        },
        emitData() {

        },
        confirmPopUp() {
            if (Object.is(this.localStore, 0)) {
                // TODO:请在设置中添加预警条件

                return false;
            }
            // 保存当前状态
            this.setStore()
            // emit 数据
            this.$eventBus.$emit('shortFilterChanged', this.localStore.join(';'))
            this.showFilter = false
        },
        filterMethod() {
            this.showFilter = true
        },
        findItem(type) {
            return this.shortLineType.find((element)=>{
                return Object.is(element[0], type)
            })
        },
        itemClick(...args) {
            let type = args[0]
            let isActive = args[1]
            let item = this.findItem(type)
            item[2] = !isActive
            if (isActive) {
                let index = this.localStore.indexOf(type)
                this.localStore.splice(index, 1)
            } else {
                this.localStore.push(type)
            }
        }
    },
    beforeDestroy() {
        this.$eventBus.$off('showShortLineFilter', this.filterMethod)
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
.shortline-filter-popUp {
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
.shortline_filter {
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
}
.shortline_filter_item {
    display: flex;
    align-items: center;
    flex: 0 0 50%;
    height: 32px;
    padding-left: 10px;
}
</style>
