<template>
    <ul class="tab_switch" v-show="configArr.length > 1">
        <tab-switch-item
            v-for="item of configArr"
            :key="item.type"
            :text="item.text"
            :type="item.type"
            :is-active="item.type === activeType"
            :style="switchItemObj"
            @switch="switchTab"
        />
    </ul>
</template>

<script>
import TabSwitchItem from './TabSwitchItem.vue'

export default {
    name: 'TabSwitch',
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
    },
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
            this.$emit('on-click', type)
        },
    },
    components: {
        TabSwitchItem,
    },
}
</script>

<style>
    .tab_switch {
        display: flex;
        font-size: 12px;
        height: 30px;
        background: var(--color-smallcard-background);
    }
</style>
