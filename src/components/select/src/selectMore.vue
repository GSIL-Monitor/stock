<!-- 多级两级select -->
<template>
    <div class="select-box no-user-select"  :style="{lineHeight:textHeight,width:textWidth}">
            <div class="select-value" @click.self="toggle" v-clickoutside="hideBox">
                {{ value }}
            </div>
            <div class="option-list" v-show="show" style="marginTop:-1px">
                <template v-for="(item,index) in list">
                    <div class="main-option">
                        <div class="option-name" @click.stop>{{item.name}}</div>
                        <div v-if="item.list" class="child-list">
                            <div v-for="(child,i) in item.list" class="child-option" @click="choose(child,item)">{{child.name}}</div>
                        </div>
                    </div>
                </template>
            </div>
    </div>
</template>
<script>
    import Clickoutside from '@c/utils/clickoutside.js';
    export default{
        name:'selectMore',
        directives:{
            Clickoutside
        },
        data(){
            var value = this.name || this.list[0] && this.list[0].name || '';
            return {
                show:false,
                value:value,
                selected:null
            }
        },
        props:{
            name:String,
            list:Array,
            bottom:{
                type:Boolean,
                default:false
            },
            lineHeight:{
                type:String,
                default:'20px'
            },
            width:String,
            //恢复初始
            clear:Object,
            //重复点击一个是否发送事件
            repeat:Boolean,
            white:Boolean
        },
        computed:{
            textHeight(){
                return parseInt(this.lineHeight)+'px';
            },
            textWidth(){
                return this.width?parseInt(this.width)+'px':''
            }
        },
        methods:{
            choose(item,parent){
                this.show = false;
                if(this.selected == item && !this.repeat){
                    return
                }
                this.selected = item;
                this.$emit('changeValue',item,parent);
            },
            toggle(){
                this.show = !this.show;
                this.$emit('clickSelect');
            },
            hideBox(){
                this.show = false;
            },
            clearSelect(){
                this.selected = null;
            },
            setSelect(select){
                if(typeof select === 'number'){
                    this.selected = this.list[select];
                }else{
                    this.selected = select?select:null;
                }
            }
        },
        watch:{
            'selected':function(selected){
                if(selected){
                    this.value = selected.name;
                }else{
                    this.value = this.name || this.list[0] && this.list[0].name || '';
                }
            },
            'list':function(list){
                this.selected = null;
                this.value = list[0].name||list[0];
            }
        }
    }
</script>
<style lang="less">
    @import './select.less';
</style>
