<template>
    <div
        class="set_tool_ico"
        @click="emitClick"
    >
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'SetIco',
    methods: {
        emitClick() {
            this.$emit('click')
        }
    },
}
</script>

<style>
.set_tool_ico {
    width: 14px;
    height: 14px;
    background: url('~@assets/set-ico.png') no-repeat center center;
    cursor: pointer;
}
</style>
