<!-- 选择状态根据传入的 check 的值来判定 -->
<!-- true 为选择状态，false 反之 -->
<template>
    <span class="check-box-label" @click="clickCheckBox">
        <i class="check-box" :class="{'checked-box': check}"></i>
        <span><slot></slot></span>
    </span>
</template>
<script>
    export default {
        name: 'checkBox',
        props: {
            check: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            clickCheckBox(){
                this.$emit("tap")
            }
        }
    }
</script>
<style lang="less">
    @import '../less/common/variables.less';
    .check-box-label{
        cursor: pointer;
        user-select: none;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
        position: relative;
        padding-left: 18px;
    }
    .check-box{
        position: absolute;
        left:0;
        top:e('calc(50% - 8px)');
        cursor: pointer;
        outline: none;
        width:16px;
        height:16px;
        border-radius: 3px;
        border: 1px solid @border-stroke2;
        background: @bg-title1;
    }
    .check-box.checked-box{
        border-width: 0;
        background:@checked center !important;
    }
</style>
