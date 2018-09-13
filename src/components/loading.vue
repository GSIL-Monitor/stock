<!-- 正在加载 -->
<template>
    <div class="loadingStyle"></div>
</template>
<script>
    export default{
        name:'loading'
    }
</script>
<style lang="less">
    @import '../less/common/variables.less';
    .loadingStyle {
        width:110px;
        height:22px;
    }
    .loadingStyle:after {
        content: ' ';
        display:block;
        position: absolute;
        top: 0;
        z-index: 3;
        background: @bg-big @img-loading no-repeat 50% 40%;
        width:100%;
        height:100%;
    }
</style>
