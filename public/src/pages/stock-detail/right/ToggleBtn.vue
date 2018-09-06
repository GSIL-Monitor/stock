<template>
    <div class="detail_info_toggle"
        @click.stop="emitToggle"
    >
        <span
            class="detail_info_toggle_ico"
            :class="[arrow]"
        >
        </span>
    </div>
</template>

<script>
export default {
    name: 'toggleBtn',
    computed: {
        arrow() {
            return this.rowToRight ? 'toggle_ico_right' : 'toggle_ico_left'
        }
    },
    methods: {
        emitToggle() {
            this.$emit('toggleArrow')
        },
    },
    props: [
        'rowToRight'
    ]
}
</script>

<style lang="less">
.detail_info_toggle {
    position: relative;
    background-color: rgba(255,255,255,.09);
    overflow-x: hidden;
    cursor: pointer;
}
@bg-color: #6b7695;
.detail_info_toggle_ico {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border: 6px solid transparent;
    &.toggle_ico_right {
        border-left-color: @bg-color;
        left: 3px;
    }
    &.toggle_ico_left {
        border-right-color: @bg-color;
        right: 3px;
    }
}
</style>