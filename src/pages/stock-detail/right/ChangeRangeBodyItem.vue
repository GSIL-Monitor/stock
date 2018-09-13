<template>
    <div class="range_item">
        <div
            class="range_item_top"
            :class="classes"
        >
            {{text}}
        </div>
        <div class="range_item_bottom">{{val}}</div>
    </div>
</template>

<script>
export default {
    name: 'RangeBodyItem',
    computed: {
        classes() {
            const prefix = 'bg-'
            return [
                this.bg ? `${prefix}${this.bg}` : '',
            ]
        }
    },
    props: {
        text: {
            type: String,
            required: true,
        },
        val: {
            required: true,
        },
        bg: {
        }
    }
}
</script>

<style lang="less">
.range_item {
    display: flex;
    flex-direction: column;
}
.range_item_top,
.range_item_bottom {
    height: 37px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.bg-red {
    background-color: #832126;
}
.bg-green {
    background-color: #266722;
}
</style>
