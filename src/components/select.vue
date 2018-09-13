<template>
    <div class="select-box no-user-select">
        <div v-if="bottom" class="select-value position-bottom" @click.self="toggle" v-clickoutside="hideBox">
            {{ value }}
            <div class="option-list" v-show="show" :style="{top:-(option.list.length*20+2)+'px'}">
                <div v-for="(item,index) in options.list" class="option-item"  :class="{active:active[0]==index}" @mouseenter="active = [index]" @click="choose(index)">{{item}}</div>
            </div>
        </div>
        <div v-else class="select-value" @click.self="toggle" v-clickoutside="hideBox">
            {{ value }}
            <div class="option-list" v-show="show">
                <template v-for="(item,index) in options.list">
                    <div v-if="typeof item == 'string'" class="option-item" :class="{active:active[0]==index}" @mouseenter="active = [index]" @click="choose(index)">{{item}}</div>
                    <div class="main-option" v-else-if="typeof item == 'object'">
                        <div class="option-name" @click.stop>{{item.title}}</div>
                        <div class="child-list" >
                            <div v-for="(child,i) in item.list" class="child" @click="choose([index,i])" @mouseenter="active = [index,i]" :class="{red:i==0,active:active[0]==index&&active[1]==i}">{{child.title}}</div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
    import Clickoutside from './utils/clickoutside.js';
    export default{
        name:'selectBox',
        directives:{
            Clickoutside
        },
        data(){
            var value = this.option.default?this.option.default:this.option.list[0];
            return {
                show:false,
                value:value,
                options:this.option,
                active:[]
            }
        },
        created(){
            this.$root.eventHub.$on('initState',() => {
                this.show = false;
            })
        },
        props:{
            option:Object,
            bottom:{
                type:Boolean,
                default:false
            }
        },
        methods:{
            choose(index){
                this.show = false;
                if(this.options.selected == index && !this.options.repeat){
                    return
                }
                this.options.selected = index;
                this.$emit('changeValue',index);
            },
            toggle(){
                this.active = 0;
                this.show = !this.show;
                this.$emit('clickSelect');
            },
            hideBox(){
                this.show = false;
            }
        },
        watch:{
            'options.selected':function(index){
                if(Object.prototype.toString.call(index) == '[object Array]'){
                    this.value = this.option.list[index[0]].list[index[1]].title;
                }else{
                    if(index<0){
                        this.value = this.option.default;
                        return;
                    }
                    this.value = this.option.list[index];
                }
            },
            'options.default':function(value){
                if(value){
                    this.value = value;
                }
            }
        }
    }
</script>
<style lang="less">
    @import '../less/common/variables.less';
    .select-box{
        border:1px solid @border-stroke1;
        color:@color-gray1;
        background:@bg-input;
        display:inline-block;
    }
    .select-value{
        padding:0 25px 0 5px;
        font-size:@font-size-small;
        position: relative;
        line-height:20px;
        cursor: default;
    }
    .select-value:after{
        content:'';
        position: absolute;
        right:5px;
        top:8px;
        width:8px;
        height:5px;
    }
    .select-value:after{
        background:@ico-show;
    }
    .option-list{
        width:100%;
        box-sizing:content-box;
        position: absolute;
        left:-1px;
        top:20px;
        border:1px solid @border-stroke1;
        background:@bg-dropdown;
        cursor: pointer;
    }
    .select-value.position-bottom  .option-list{
        top:-82px;
    }
    .option-item{
        padding-left:5px;
        &.active{
            background:@select_active;
         }
    }
    .option-name{
        cursor: default;
        line-height:20px;
        padding-left:5px;
    }
    .child{
        padding-left:15px;
        line-height:20px;
        cursor: pointer;
    }
    .red{
        color:@color-red;
    }
    .child.active{
        background:@select_active;
    }
</style>
