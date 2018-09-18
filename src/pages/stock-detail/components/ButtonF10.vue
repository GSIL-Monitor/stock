<template>
<default-btn
    class="btn-content"
    @on-click="skipF10"
>
    F10
</default-btn>
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

