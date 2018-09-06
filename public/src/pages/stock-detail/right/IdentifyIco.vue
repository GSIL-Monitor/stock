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
    name: 'identifyIco',
    methods: {
        emitIdentify() {
            this.$emit('identify')
        },
    },
    props: ['title', 'className', 'title', 'type', 'code'],
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
    color: #fff;
}
</style>
