<template>
    <div
        :class="icoClasses"
        @click="icoClick"
    ></div>
</template>

<script>
export default {
    name: 'XqdownToUp',
    computed: {
        icoClasses() {
            let prefixCls = 'ico_enfoldment'

            return [
                prefixCls,
                {
                    [`${prefixCls}_On`]: this.isOn
                },
            ]
        },
    },
    methods: {
        icoClick() {
            let state = !this.isOn
            this.$emit('on-click', state)
        },
    },
    props: {
        isOn: {
            type: Boolean,
            default: false,
        }
    },
}
</script>

<style lang="less">
.ico_enfoldment {
    width: 34px;
    height: 25px;
    background: url('~@assets/upToDown.png') no-repeat center center;
    cursor: pointer;
    &:hover {
        background-image: url('~@assets/upToDownHover.png');
    }
}
.ico_enfoldment_On {
    background: url('~@assets/downToUp.png') no-repeat center center;
    &:hover {
        background-image: url('~@assets/downToUpHover.png');
    }
}
</style>
