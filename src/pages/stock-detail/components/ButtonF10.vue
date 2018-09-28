<template>
<default-btn
    class="btn-content"
    @on-click="skipF10"
>
    F10
</default-btn>
</template>

<script>
import {
    skipF10,
} from '../components/module-jump.js'
import {
    MODULE_NAME,
} from '../storage.js'

import DefaultBtn from './DefaultBtn.vue'

export default {
    name: 'ButtonF10',
    methods: {
        skipF10() {
            let hash = location.hash.substr(1)
            skipF10(hash, MODULE_NAME)
        },
    },
    components: {
        DefaultBtn,
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

