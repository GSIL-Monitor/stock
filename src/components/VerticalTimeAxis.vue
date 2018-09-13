<template>
    <div class="vertical-time-axis"></div>
</template>
<style lang="less">
    @import '../less/common/variables.less';
    @import '../less/common/mixins.less';
    .vertical-time-axis{
        background: @color-blue;
        position: relative;
        width: 1px;
        min-width: 1px;
        min-height: 10px;
        margin: 0 6px;
    }
    .vertical-time-axis:before,
    .vertical-time-axis:after{
        position: absolute;
        content: '';
        display: block;
        border-radius: 50%;
        background: @color-blue;
    }
    .vertical-time-axis:before{
        width: 13px;
        height: 13px;
        opacity: .3;
        top: 0;
        left:-6px;
    }
    .vertical-time-axis:after{
        width: 7px;
        height: 7px;
        top:3px;
        left:-3px;
    }
</style>
