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
    background-color: #fff;
    cursor: pointer;
}
.ico_enfoldment_On {
    background-color: #634;
}
</style>
