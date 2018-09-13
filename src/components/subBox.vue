<!-- 公告添加订阅 -->
<template>
    <div class="sub-box clearfix">
        <div class="sub-box-select-box">
            <div v-if="option.titleA" class="sub-box-select-box_title">{{option.titleA}}</div>
            <div class="sub-box-select-box_content">
                <div v-for="(list,index1) in option.lists">
                    <div v-if="list.canopen" class="sub-box--first- sub-box-list sub-box-canopen" :class="{'sub-box-open':list.open}" @click.self="toggle(list,option.lists)">{{list.title}}</div>
                    <div v-else class="sub-box--first- sub-box-list" :class="{selected:selected == list}" @click.self.stop="choose(list)"  @dblclick.self.stop="dblClick(list)">{{list.title}}</div>
                    <div v-if="list.canopen" v-show="list.open" class="sub-box--second-list-">
                        <template v-for="(item,index2) in list.list">
                            <div v-if="item.canopen" class="sub-box--second- sub-box-list sub-box-canopen" :class="{'sub-box-open':item.open}" @click.self="toggle(item,list.list)">{{item.title}}</div>
                            <div v-else class="sub-box--second- sub-box-list" :class="{'sub-box-selected':selected == item}" @click.self.stop="choose(item)" @dblclick.self.stop="dblClick(item)">{{item.title?item.title:item}}</div>
                            <div v-if="item.canopen" v-show="item.open" class="sub-box--third-list-">
                                <div v-for="(row,index3) in item.list" class="sub-box--third- sub-box-list" :class="{'sub-box-selected':selected == row}" @click.self.stop="choose(row)"  @dblclick.self.stop="dblClick(row)">{{row.title?row.title:row}}</div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="sub-box-select-button">
            <div class="sub-box-select-item" @click="selectItem">选入&gt;</div>
            <div class="sub-box-clear-all" @click="option.selectedList=[]">&lt;&lt; 全清</div>
        </div>
        <div class="sub-box-selected-box">
            <div v-if="option.titleB" class="sub-box-select-box_title">{{option.titleB}}</div>
            <div class="sub-box-select-box_content">
                <div v-for="(item,index) in option.selectedList" class="sub-box-selected-item">
                    <div  class="sub-box-selected-title">{{item.title}}<i class="sub-box-delete-ico" @click.stop="deleteItem(item)"></i></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name:'subBox',
        props:{
            options: {
                type: Object,
                default: () => { return {} }
            },
            reset:Number
        },
        data(){
            return {
                selected:{},
                code:'',
                option:this.options,
                stock_type:''
            }
        },
        methods:{
            choose(item){
                this.selected = item;
            },
            toggle(item,list){
                item.open = !item.open;
                if(item.open){
                    list.map((m)=>{
                        if(m !== item){
                           m.open = false;
                           let children = m.list;
                           if(children){
                               children.map((child)=>{
                                   child.open = false;
                               })
                           }
                        }
                    })
                }else{
                    let children = item.list;
                    if(children){
                        children.map((child)=>{
                            child.open = false;
                        })
                    }
                }
            },
            deleteItem(item){
                let index = this.option.selectedList.indexOf(item);
                this.option.selectedList.splice(index,1);
            },
            selectItem(){
                if(!this.selected.title){
                    return;
                }
                if(this.option.selectedList.indexOf(this.selected)>=0){
                    return;
                }
                this.option.selectedList.push(this.selected);
            },
            dblClick(item){
                this.selected = item;
                this.selectItem();
            }
        },
        watch:{
            reset(){
                this.selected = null;
            }
        }
    }
</script>
<style lang="less">
    @import '../less/common/variables.less';
    @import '../less/common/mixins.less';
    .sub-box{
        color:@item-text-color;
        background:@color-white;
        font-size:@font-size-small;
        padding-top:25px;
    }
    .sub-box-list{
        line-height:25px;
        padding-left:18px;
        position: relative;
        cursor: pointer;
        &:hover{
            background:@item-active;
        }
    }
    .sub-box-selected{
        background:@item-active;
    }
    .sub-box-select-box,
    .sub-box-select-button,
    .sub-box-selected-box{
        float: left;
    }
    .sub-box-select-box,
    .sub-box-selected-box{
        width:150px;
        height:350px;
        border:1px solid @popupWindow-line;
        position: relative;
    }
    .sub-box-select-box_content{
        height:100%;
        overflow:auto
    }
    .sub-box-select-button{
        padding:135px 15px;
    }
    .sub-box-select-item,
    .sub-box-clear-all{
        cursor: pointer;
        width:64px;
        line-height:23px;
        border:1px solid @popupWindow-line;
        text-align: center;
        // background-color: @item-active;
    }
    .sub-box-select-item:hover,
    .sub-box-clear-all:hover{
        background-color:@item-texthover-color
    }
    .sub-box-clear-all{
        margin-top:10px;
    }
    .sub-box-canopen:before{
        color:#748ca9;
        content:'+';
        font-size:11px;
        line-height:9px;
        position: absolute;
        width:10px;
        height:11px;
        text-align: center;
        top:6px;
        border:1px solid #748ca9;
    }
    .sub-box-canopen.sub-box-open:before{
        content:'-'
    }
    .sub-box-select-box_title{
        position: absolute;
        color:@color-gray3;
        top:-25px;
        left:2px;
        line-height:25px;
    }
    .sub-box--first-{
        padding-left:30px;
        &:before{
            left:15px;
         }
    }
    .sub-box--second-{
        padding-left:40px;
        &:before{
            left:25px;
        }
    }
    .sub-box--third-{
        padding-left: 50px;;
    }
    .sub-box-selected-item{
        line-height:30px;
    }
    .sub-box-selected-title{
        padding:0 10px;
        position: relative;
    }
    .sub-box-selected-title:hover{
        background:@item-active;
    }
    .sub-box-delete-ico{
        cursor: pointer;
        position: absolute;
        width:11px;
        height:12px;
        right:10px;
        top:e('calc(50% - 6px)');
        background:@delete;
    }
</style>
