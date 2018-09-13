<!-- 下拉菜单
     参数参考bulletinCenterStore.noticeCenter
 -->
<template>
    <div class="drop-down" >
        <template v-for="(item,index) in dropdown.lists">
            <!-- 是否为订阅报告 -->
            <template v-if="item.isSub">
                <div v-if="!item.canopen"
                     class="drop-down_select_item -first-"
                     :class="[item.classList,{active:dropdown.active[0]==index}]"
                     @click.self="noSubscribe(index,-1,0,0,item.title,dropdown.lists)"

                >
                    {{item.title}}
                    <div class="my-subscription_btn" @click="openSub" >订阅</div>
                </div>
                <div v-else
                     class="drop-down_select_item--canopen -first-"
                     :class="[item.classList,{open:item.open}]"
                     @click.self="toggleOpen({ list:dropdown.lists,item:item,statis:[index]})"

                >{{item.title}}
                    <div class="my-subscription_btn" @click="openSub">订阅</div>
                </div>
            </template>
            <template v-else>
                <div v-if="!item.canopen"
                     class="drop-down_select_item -first-"
                     @click="choose({'position':[index,0,0,0],'title':item.title,'item':item,'list':dropdown.lists,statis:[index]})"
                     :class="[item.classList,{active:dropdown.active[0]==index && dropdown.active[1]==0 && dropdown.active[2]==0}]"
                >{{item.title}}</div>
                <div v-else
                     class="drop-down_select_item--canopen -first-"
                     :class="[item.classList,{open:item.open, active: dropdown.active[0]==index && item.canclick}]"
                     @click="toggleOpen({list:dropdown.lists,item:item,statis:[index], position: [index,-1,-1,-1]})"
                >{{item.title}}</div>
            </template>

            <ul v-if="item.canopen" class="drop-down_select_list -first-list-" v-show="item.open" style="padding-left:12px;">
                <li v-for="(list,i) in item.list" :key="i">
                    <div v-if="list.canopen">
                        <div class="drop-down_select_item--canopen -second-" :class="[{open:list.open,active:dropdown.active[0]==index&&dropdown.active[1]==i}]" @click="toggleOpen({list:item.list,item:list,position:[index,i,-1,0],type:list.title,statis:[index,i]})">{{list.title}}</div>
                        <ul v-show="list.open" class="-second-list-" style="margin:0;padding:0">
                            <template v-for="(item,m) in list.list">
                                <li v-if="!item.canopen"
                                    class="drop-down_select_list_item -third-"
                                    :class="{active:dropdown.active[0]==index && dropdown.active[1]==i && dropdown.active[2]==m }"
                                    @click="choose({'position':[index,i,m,0],'title':item.title,'item':item,'list':list.list,statis:[index,i,m]})"
                                    :title="list.title?item.title:''"
                                >{{item.title}}</li>
                                <li v-else class="drop-down_select_item--canopen -third-" :class="{open:item.open, active:dropdown.active[0]==index && dropdown.active[1]==i && dropdown.active[2]==m}" @click="toggleOpen({list:list.list,item:item,statis:[index,i,m],position:[index,i,m,-1]})">{{item.title}}</li>
                                <template v-if="item.canopen">
                                    <ul v-show="item.open" class="drop-down_select_list -third-list-" style="margin:0;padding:0">
                                        <li v-for="(list,n) in item.list"
                                            :key="n"
                                            class="drop-down_select_list_item -fourth-"
                                            @click="choose({'position':[index,i,m,n],'title':list.title,'item':list,'list':item.list,statis:[index,i,m,n]})"
                                            :title="item.showTitle?list.title:''"
                                            :class="{active:dropdown.active[0]==index && dropdown.active[1]==i && dropdown.active[2]==m && dropdown.active[3]==n}"
                                        >{{list.title}}</li>
                                    </ul>
                                </template>
                            </template>
                        </ul>
                    </div>
                    <div v-else
                         class="drop-down_select_list_item -second-"
                         @click="choose({'position':[index,i,0,0],'title':list.title,'item':list,'list':item.list,statis:[index,i]})"
                         :class="[{active:dropdown.active[0]==index && dropdown.active[1]==i && dropdown.active[2]==0 && dropdown.active[3]==0}]"
                         :title="item.showTitle?list.title:''"
                    >{{list.subtitle ? list.title + list.subtitle : list.title}}</div>
                </li>
            </ul>
        </template>
    </div>
</template>
<script>
    export default{
        name:'dropDown',
        props:{
            // option 数据形式参考$store.state.industryNews
            option: {
                type: Object,
                default: () => { return {} }
            }
        },
        data(){
            return {
                dropdown:this.option
            }
        },
        methods:{
            choose(param){
                if(this.dropdown.active[0]==param.position[0] && this.dropdown.active[1] == param.position[1] && this.dropdown.active[2] == param.position[2] && this.dropdown.active[3] == param.position[3]){
                    return;
                }
                this.dropdown.active = param.position;
                this.$emit('changeType',param);
                if(param.list && param.list.length && this.dropdown.autoHide){
                    this.closeAll(param.list);
                }
                this.$emit('statis',param.statis)
            },
            openSub(){
                this.$emit('openSub');
            },
            toggleOpen({ list,item,position,type,statis }){ //{ list:'',item:'',position:[],type:'',statis }
                if(!item.open){
                    list.forEach((item)=>{
                        if(item.open){
                            item.open = false;
                            if(item.list && item.list && this.dropdown.autoHide){
                                this.closeAll(list)
                            }
                        }
                    })
                }
                item.open = !item.open;
                if(item.canclick){
                    item.active = true;
                    this.choose({
                        position:position,
                        title:type
                    });
                }
                this.$emit('statis',statis)
            },
            noSubscribe(index,i,m,n,type,list){
                this.$emit('noSubscribe',index,i,m,n,type);
                if(this.dropdown.autoHide){
                    this.closeAll(list)
                }
            },
            closeAll(nodes){
                nodes.forEach((node)=>{
                    node.open = false;
                    if(node.list && node.list.length){
                        this.closeAll(node.list)
                    }
                })
            }
        }
    }
</script>
<style lang="less">
    @import '../../src/less/common/variables.less';
    .drop-down{
        color:@color-gray1;
        width:150px;
        border-right:1px solid @border-stroke1;
        list-style: none;
        box-sizing: border-box;
    }
    .drop-down_select > .drop-down_select_item,.drop-down_select > .drop-down_select_item--canopen{
        margin-top:-1px;
    }
    .-first-{
        background-color:@bg-title1;
        position: relative;
    }
    .drop-down_select_item,.drop-down_select_item--canopen{
        font-size:@font-size-small;
        line-height:30px;
        padding-left:25px;
        border-top:1px solid @border-stroke1;
        border-bottom:1px solid @border-stroke1;
        margin-top:-1px;
        user-select: none;
        box-sizing: border-box;
        cursor:pointer;
        &.active{
             color:@color-blue ;
         }
    }
    .drop-down_select_item--canopen{
        background-image:@ico-hide;
        background-position: 8px center;
        background-repeat:no-repeat;
        &.active{
             color:@color-blue;
         }
        &.open{
             background-image:@ico-show;
         }
         &.-second-,&.-third-{
            border:none;
          }
         &.-third-{
            margin-left:13px;
            list-style: none;
         }
    }
    .drop-down_select_list{
        background-color: @bg-big;
    }
    .drop-down_select_list{
        margin:0;
        list-style: none;
    }
    .drop-down_select_list_item{
        &.-third-{
            padding-left:40px;
         }
         &.-fourth-{
              padding-left:50px
          }
        &.active{
             color:@color-blue;
         }
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        cursor:pointer;
        list-style:none;
        padding-left:25px;
        font-size:@font-size-small;
    }
    .-first-{
        line-height:30px;
    }
    .-second-,.-third-,.-fourth-{
        line-height:30px;
    }
    .my-subscription{
        position: relative;
    }
    .my-subscription_btn{
        color:@color-gray1;
        position: absolute;
        left:80px;
        top:6px;
        line-height: 17px;
        text-indent:5px;
        border:1px solid @border-stroke1;
        border-radius:15px;
        padding-left:12px;
        background:@subscription 5px no-repeat;
        width:50px;
        height:19px;
    }
    .no-subscribe{
        position: fixed !important;
        z-index: 999;
        left:e('calc(50% - 140px)');
        top:e('calc(50% - 70px)');
    }
</style>
