<template>
    <div
        class="func_item"
    >
        <span
            class="func_item_dsc"
        >{{text}}</span>
        <span
            class="func_item_ico"
            :class="{func_item_ico_On: this.on}"
            @click="icoClick"
        ></span>
    </div>
</template>

<script>
export default {
    name: 'FuncStyleItem',
    methods: {
        icoClick() {
            let emitOn = !this.on
            this.$eventBus.$emit('dataChanged', {
                parentType: this.parentType,
                isList: true,
                changed: [
                    {
                        type: this.type,
                        on: emitOn,
                    },
                ],
            })
        },
    },
    props: [
        'text',
        'type',
        'parentType',
        'on',
    ],
}
</script>

<style lang="less">
.func_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 26px;
    margin-top: 8px;
    &:first-child {
        margin-top: 0;
    }
}
.func_item_dsc {
    margin-left: 3px;
}
.func_item_ico {
    width: 37px;
    height: 23px;
    margin-right: 15px;
    background: url('~@assets/simple-ico.png') no-repeat center center;
    cursor: pointer;
}
.func_item_ico_On {
    background: url('~@assets/meticulous-ico.png') no-repeat center center;
}
</style>
