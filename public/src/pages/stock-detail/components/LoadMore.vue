<template>
    <div
        class="load_more"
        :class="[className]"
        @click="moreClick"
    >
        <div>{{text}}</div>
        <div>&gt;</div>
    </div>
</template>

<script>
export default {
    name: 'loadMore',
    methods: {
        moreClick() {
            this.$emit('moreClick')
        }
    },
    props: {
        text: {
            type: String,
            default: '',
        },
        className: {
            type: String,
            default: '',
        }
    }
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
