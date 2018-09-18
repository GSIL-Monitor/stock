<template>
<DefaultBtn
    label="F10"
    class="btn-content"
    @on-click="skipF10"
/>
</template>

<script>
import DefaultBtn from './DefaultBtn.vue'

export default {
    name: 'ButtonF10',
    components: {
        DefaultBtn,
    },
    methods: {
        skipF10() {
            console.log('skip f10')
        },
    },
}
</script>

<style lang="less" scoped>
.btn-content {
    margin-left: 8px;
    &:first-child {
        margin-left: 0;
    }
}
</style>

