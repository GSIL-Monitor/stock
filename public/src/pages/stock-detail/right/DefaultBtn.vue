<template>
    <button
        v-if="text"
        class="btn-link-default"
        :class="[className || '']"
        @click="emitClick"
        type="button"
    >
        {{text}}
    </button>
</template>

<script>

export default {
    name: "DefaultBtn",
    methods: {
        emitClick() {
            this.$emit('click')
        }
    },
    props: [
        'text',
        'className',
    ]
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