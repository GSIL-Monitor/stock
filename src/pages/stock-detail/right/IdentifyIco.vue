<template>
    <span
        class="identify_ico"
        :title="title"
        :class="[className]"
        @click="emitIdentify"
    >
    </span>
</template>

<script>
export default {
    name: 'IdentifyIco',
    methods: {
        emitIdentify() {
            this.$emit('on-click', {
                type: this.type,
                full_code: this.full_code,
            })
        },
    },
    props: {
        title: {
            type: String,
            default: '',
        },
        className: {
            default: '',
        },
        type: {
            required: true,
        },
        full_code: {
            required: true,
        },
    },
}
</script>

<style lang="less">
.identify_ico {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
}
</style>
