<template>
    <div
        class="load_more"
        @click.stop="moreClick"
    >
        <div>{{label}}</div>
        <div>&gt;</div>
    </div>
</template>

<script>
export default {
    name: 'LoadMore',
    props: {
        label: {
            type: String,
            default: '更多',
        },
    },
    methods: {
        moreClick() {
            this.$emit('on-click')
        }
    },
}
</script>

<style lang="less" scoped>
.load_more {
    display: flex;
    font-size: 12px;
    cursor: pointer;
}
.load_more:hover {
    color: #15A4FA;
}
</style>
