<template>
    <div class="select-box no-user-select"  :style="{lineHeight:textHeight,width:textWidth,fontSize:textSize}">
        <template v-if="bottom">
            <div class="option-list" v-show="show" :style="{bottom:bottomDistance}">
                <div
                    v-for="(item,index) in list"
                    class="option-item"
                    @click="choose(item,index)"
                >{{item.name || item}}</div>
            </div>
            <div class="select-value" @click.self="toggle" v-clickoutside="hideBox">
                {{ value }}
            </div>
        </template>
        <template v-else>
            <div class="select-value" @click.self="toggle" v-clickoutside="hideBox">
                {{ value }}
            </div>
            <div class="option-list" v-show="show" style="marginTop:-1px" :style="height_list">
                <div
                    v-for="(item,index) in list"
                    class="option-item"
                    @click="choose(item,index)"
                >{{item.name || item}}</div>
            </div>
        </template>
    </div>
</template>
<script>
    import Clickoutside from '@c/utils/clickoutside.js';
    export default{
        name:'selectBox',
        directives:{
            Clickoutside
        },
        data(){
            var value = this.name || (this.bottom?(this.list[this.list.length-1].name || this.list[this.list.length-1]):(this.list[0].name||this.list[0]));
            let selected = null;
            if(!this.name){
                selected = this.bottom?this.list[this.list.length-1]:this.list[0];
            }
            return {
                show:false,
                value:value,
                selected:selected,
                delayed:null
            }
        },
        props:{
            name:String,
            //['',''] OR [{name:'',delaySelect:false},{name:'',delaySelect:true}]  delaySelect=>点击暂不选中，setSelect手动选中
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
            //重复点击一个是否发送事件
            repeat:Boolean,
            white:Boolean,
            fontSize:{
                type:String,
                default:'12px'
            },
            max:String || Number
        },
        computed:{
            textHeight(){
                return parseInt(this.lineHeight)+'px';
            },
            textWidth(){
                return this.width?parseInt(this.width)+'px':''
            },
            textSize(){
                return this.fontSize?parseInt(this.fontSize)+'px':'12px';
            },
            bottomDistance(){
                return parseInt(this.lineHeight)+1+'px';
            },
            height_list(){
                if(this.max){
                    return {
                        "max-height":parseInt(this.lineHeight)*this.max+'px',
                        "overflow":"auto"
                    }
                }else{
                    return {};
                }

            }
        },
        methods:{
            choose(item,index){
                this.show = false;
                if(this.selected == item && !item.delaySelect){
                    return
                }
                if(!item.delaySelect){
                    this.selected = item;
                }
                this.$emit('changeValue',index);
            },
            toggle(){
                this.show = !this.show;
                this.$emit('clickSelect');
            },
            hideBox(){
                this.show = false;
            },
            //父级使用
            clearSelect(){
                this.selected = null;
            },
            //父级使用
            setSelect(select){
                if(typeof select === 'number'){
                    this.selected = this.list[select];
                }else{
                    this.selected = select?select:null;
                }
            },
            getIndex(){
                if(this.selected){
                    return this.list.indexOf(this.selected);
                }else{
                    return this.name?-1:0;
                }
            }
        },
        watch:{
            'selected':function(selected){
                if(selected){
                    this.value = selected.name || selected;
                }else{
                    this.value = this.name || (this.bottom?(this.list[this.list.length-1].name || this.list[this.list.length-1]):(this.list[0].name||this.list[0]));
                }
            },
            'list':function(list){
                if(!this.name){
                    this.selected = this.bottom?list[list.length-1]:list[0];
                }else{
                    this.selected = null;
                }
                this.value = this.name || list[0].name || list[0];
            }
        }
    }
</script>
<style lang="less">
    @import './select.less';
</style>
