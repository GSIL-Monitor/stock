<template>
    <div>
        <span
            class="shortline_filter_item_select"
            :class="selectItemClasses"
            @click="clickSelectItem"
        ></span>
        <span class="shortline_filter_item_desc">{{label}}</span>
    </div>
</template>

<script>
export default {
    name: 'ShortElvesFilterItem',
    data() {
        return {
            isSelect: this.isActive,
        }
    },
    computed: {
        selectItemClasses() {
            return [
                {
                    on: this.isSelect,
                }
            ]
        },
    },
    methods: {
        clickSelectItem() {
            // 向父组件传递数据
            this.$emit('on-click', this.type, this.isSelect)
            this.isSelect = !this.isSelect
        },
    },
    props: {
        label: {
            required: true,
            type: String,
        },
        type: {
            required: true,
            type: Number,
        },
        isActive: {
            required: true,
            type: Boolean
        },
    },
}
</script>

<style lang="less">
.shortline_filter_item_select {
    cursor: pointer;
    width: 14px;
    height: 14px;
    background-color: #634;
    margin-right: 5px;
    &.on {
        background-color: #429;
    }
}
</style>
