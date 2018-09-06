<template>
    <div
        :class="icoClasses"
        @click="icoClick"
    ></div>
</template>

<script>
export default {
    name: 'XqdownToUp',
    data() {
        return {
            is_on: this.isOn
        }
    },
    computed: {
        icoClasses() {
            let prefixCls = 'ico_enfoldment'

            return [
                prefixCls,
                {
                    [`${prefixCls}_On`]: this.is_on
                },
            ]
        },
    },
    methods: {
        icoClick() {
            this.is_on = !this.is_on
            this.$emit('on-click', this.is_on)
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
