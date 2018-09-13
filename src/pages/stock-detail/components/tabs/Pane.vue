<template>
    <div :class="prefixCls" v-if="show"><slot></slot></div>
</template>

<script>
    const prefixCls = 'gg_tabs_tabpane'
    export default {
        name: 'TabPane',
        data() {
            return {
                prefixCls,
                show: false,
                paneType: this.type
            }
        },
        props: {
            type: {
                type: [String, Number],
            },
            label: {
                type: String,
                default: '',
            },
            active: {
                type: Boolean,
                default: false,
            },
        }
    }
</script>
