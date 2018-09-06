<template>
    <div class="time-range">
        <input type="text" :placeholder="value" class="time-input">
    </div>
</template>
<script>
    export default{
        name:'timeRange',
        data(){
            var value;
            var d = new Date();
            value = (d.getFullYear() - 1)+'-'+ (d.getMonth()+1)+'-'+ d.getDate()+' 至 '+d.getFullYear()+'-'+ (d.getMonth()+1)+'-'+ d.getDate();
            return {
                value:value
            }
        }
    }
</script>
<style lang="less">
    @import '../less/common/variables.less';
    .time-range{
        display: inline-block;
        position: relative;
        cursor:pointer;
        &:after{
             content:'';
             position: absolute;
             width:14px;
             height:14px;
             right:5px;
             top:13px;
             background:url('../assets/datepicker-b.png') no-repeat;
         }
    }
    .time-input{
        line-height:20px;
        border:1px solid @border-stroke1;
        font-size:12px;
        color:@color-gray1;
        outline:none;
        background:@bg-input;
    }
</style>
