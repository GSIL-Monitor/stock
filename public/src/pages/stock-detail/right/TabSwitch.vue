<template>
    <ul class="tab_switch" v-show="configArr.length > 1">
        <tab-switch-item
            v-for="item of configArr"
            :key="item.type"
            :text="item.text"
            :type="item.type"
            :isActive="item.type === activeType"
            :style="switchItemObj"
            @switch="switchTab"
        />
    </ul>
</template>

<script>
import TabSwitchItem from './TabSwitchItem'
import {
    initTapeFunc,
} from '../tape/tape-public-func.js'
export default {
    name: 'tabSwitch',
    computed: {
        getWidth() {
            return 100 / this.configArr.length
        },
        switchItemObj() {
            return {
                width: `${this.getWidth}%`,
            }
        },
    },
    methods: {
        switchTab(type) {
            if (type === this.activeType) {
                return false
            }
            this.$emit('tabClick', type)
        },
    },
    components: {
        TabSwitchItem,
    },
    props: {
        configArr: {
            type: Array,
            default() {
                return []
            },
        },
        activeType: {
            type: String,
        }
    }
}
</script>

<style>
    .tab_switch {
        display: flex;
        font-size: 12px;
        height: 30px;
    }
</style>
