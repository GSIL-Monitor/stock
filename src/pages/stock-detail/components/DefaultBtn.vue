<template>
    <button
        v-if="label"
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
    color: #fff;
    font-size: 12px;
    border-radius: 3px;
    background-color: #1890FF;
    cursor: pointer;
}
</style>