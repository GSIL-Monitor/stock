<!-- 公告中心 机构类型选择框 -->
<template>
    <div class="select-type" v-clickoutside="hideSelect">
        <div class="show-box"  :title="option.value" @click="option.show=!option.show" :style="customStyle">{{option.value?option.value:option.defaultValue}}</div>
        <div v-show="option.show" class="type-box" :style="containerStyle">
            <div class="type-box_list" v-for="(list,m) in option.list">
                <span class="type-box_list_title">{{list.title}}:</span>
                <div class="type-box_list_items">
                    <div v-if="list.list.length>1" class="type-box_list_item select-all">
                        <!--<span class="type-check" @click="selectAll(list,m)">-->
                            <check-box @tap="selectAll(list,m)" :check="list.selectedCount>=list.list.length" >全部</check-box>
                        <!--</span>-->
                    </div>
                    <template v-for="(item,n) in list.list">
                        <div class="type-box_list_item">
                            <!--<span class="type-check" @click="clickEvent(item,list,m,n)">-->
                                <check-box @tap="clickEvent(item,list,m,n)" :check="item.select" >{{item.title}}</check-box >
                            <!--</span>-->
                        </div>
                    </template>
                </div>
            </div>
            <div class="type-box_footer" >
                <search-btn class="type-box_button" v-for="(button, index) in option.buttons" :key="index" :color="button.color" padding="10" @click="clickButton(button.value)">{{button.value}}</search-btn>
            </div>
        </div>
    </div>
</template>
<script>
    import checkBox from './CheckBox.vue';
    import searchBtn from './button.vue';
    import Clickoutside from './utils/clickoutside.js';
    export default {
        name: 'selectType',
        props: {
            options: {
                type: Object,
                default: () => { return {} }
            },
            customStyle: {
                type: Object,
                default: () => { return {} }
            },
            containerStyle:{
                type:Object,
                default: () => { return {} }
            }
        },
        data(){
            return {
                option:this.options
            }
        },
        directives:{
            Clickoutside
        },
        components:{
            checkBox,
            searchBtn
        },
        methods:{
            hideSelect(){
                this.options.show = false;
            },
            clickEvent(item,list,m,n){
                this.$emit('select',item,!item.select);
                if(item.select){
                    item.select = false;
                    list.selectedCount --;
                }else{
                    item.select = true;
                    list.selectedCount ++;
                }
            },
            clickButton(value){
                this.$emit('clickButton',value);
            },
            selectAll(list){
                let lists = list.list;
                this.$emit('selectAll',list.list,list.selectedCount < lists.length)
                if(list.selectedCount >= lists.length){
                    lists.forEach((list,i)=>{
                        list.select = false;
                    })
                    list.selectedCount = 0;
                }else{
                    lists.forEach((list,i)=>{
                        list.select = true;
                    })
                    list.selectedCount = list.list.length;
                }
            }
        },
    }
</script>
<style lang="less">
    @import '../less/common/variables.less';
    .select-type{
        position: relative;
    }
    .show-box{
        position: relative;
        line-height:20px;
        background:@bg-input;
        border:1px solid @border-stroke1;
        font-size:@font-size-small;
        padding:0 30px 0 5px;
        cursor: default;
        overflow:hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .show-box:after{
        content:'';
        position: absolute;
        right:5px;
        top:7px;
        width:12px;
        height:12px;
        background:@ico-show no-repeat;
    }
    .type-box_list_item{
        line-height: 30px;
        float:left;
        width:95px;
    }
    .type-box{
        font-size:@font-size-small;
        width:760px;
        background:@index_background;
        position: absolute;
        border:1px solid @border-stroke1;
        top:25px;
    }
    .type-box_list{
        padding:5px 0 0 18px;
    }
    .type-box_list_title{
        display: inline-block;
        width:70px;
        line-height: 30px;
        vertical-align: top;
    }
    .type-box_list_items{
        display: inline-block;
        width:e('calc(100% - 88px)');
    }
    .type-box_footer{
        border-top:1px solid @border-stroke2;
        height:40px;
        line-height:40px;
        vertical-align: middle;
        padding-right:15px;
    }
    .type-check{
        display: inline-block;
        width:16px;
        height:25px;
        vertical-align: middle;
        margin-right:6px;
    }
    .type-box_button{
        float:right;
        margin:8px 0 0 10px;
    }
</style>
