<template>
    <span class="switch-box" :class="{'switched-box': state}" @click="clickDesktopNotice">
        <span class="switch-box-circle"></span>
    </span>
</template>
<script>
    export default{
        name:'switchBtn',
        props:{
            state:Boolean
        },
        methods:{
            clickDesktopNotice(){
                this.$emit('switch')
            }
        }
    }
</script>
<style lang="less">
    @import '../less/common/variables.less';
    @import '../less/common/mixins.less';
    .switch-box{
        width: 26px;
        height: 14px;
        display: inline-block;
        outline: none;
        cursor: pointer;
        background: @color-gray3;
        position: absolute;
        border-radius: 7px;
        right:73px;
        top:15px;
    }
    .switch-box-circle{
        width:14px;
        height:14px;
        position: absolute;
        background: @color-white;
        border-radius: 7px;
        left:0;
        border:1px solid @color-gray3;
    }
    .switched-box{
        background: @btn-search-bg !important;
    }
    .switched-box .switch-box-circle{
        left:12px;
    }
</style>
