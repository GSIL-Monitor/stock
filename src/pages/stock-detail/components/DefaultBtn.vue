<template>
    <button
        class="btn-link-default"
        @click.stop="emitClick"
        type="button"
    >
        {{label}}
    </button>
</template>

<script>
export default {
    name: "DefaultBtn",
    methods: {
        emitClick() {
            this.$emit('on-click')
        }
    },
    props: {
        label: {
            type: String,
            default: '',
        },
    },
}
</script>

<style lang="less">
.btn-link-default {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-white);
    background-color: var(--color-button-normal);
    border-color: transparent;
    padding: 1px var(--border-radius-base);
    border-radius: var(--border-radius-small);
    font-size: var(--font-size-h6);
    border: 0;
    cursor: pointer;
    &:hover {
        background-color: var(--color-btn-bg2);
    }
}
</style>
