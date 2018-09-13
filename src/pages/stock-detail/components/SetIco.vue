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
    name: 'setIco',
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
    background-color: #fff;
    cursor: pointer;
}
</style>
