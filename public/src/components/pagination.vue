<template>
    <div class="pagination clearfix">
        <div class="rows-perpage" v-if="changeRow">
            <span class="text">每页</span>
            <select-box :list="rowsList" bottom @changeValue="changeRows"></select-box>
        </div>

        <button  class="pag-button" :disabled="current==1" :class="{disabled: current ==1}" @click="jumpPage(current-1)">&lt;上一页</button>
        <template v-if="pageCount>10">
            <template v-if="current<center+1">
                <button class="pag-button " v-for="index in num" @click="jumpPage(index)" :class="{active:current==index}">{{index}}</button>
                <button class="pag-button ">...</button>
                <button class="pag-button " @click="jumpPage(pageCount - 1)" :class="{active:current==pageCount-1}">{{pageCount - 1}}</button>
                <button class="pag-button " @click="jumpPage(pageCount)" :class="{active:current==pageCount}">{{pageCount}}</button>
            </template>
            <template v-else-if="current>pageCount-center">
                <button class="pag-button " @click="jumpPage(1)" :class="{active:current==1}">1</button>
                <button class="pag-button " @click="jumpPage(2)" :class="{active:current==2}">2</button>
                <button class="pag-button ">...</button>
                <button class="pag-button " v-for="index in num" @click="jumpPage(pageCount-num+index)" :class="{active:current==pageCount-num+index}">{{pageCount-num+index}}</button>
            </template>
            <template v-else>
                <button class="pag-button" @click="jumpPage(1)" :class="{active:current==1}">1</button>
                <button v-if="width>1150" class="pag-button" @click="jumpPage(2)" :class="{active:current==2}">2</button>
                <button class="pag-button">...</button>
                <button v-for="index in center" class="pag-button" @click="jumpPage(current-Math.ceil(center/2)+index)" :class="{active:current==current-Math.ceil(center/2)+index}">{{current-Math.ceil(center/2)+index}}</button>
                <button class="pag-button">...</button>
                <button v-if="width>1150" class="pag-button" @click="jumpPage(pageCount-1)" :class="{active:current==pageCount-1}">{{pageCount-1}}</button>
                <button class="pag-button" @click="jumpPage(pageCount)" :class="{active:current==pageCount}">{{pageCount}}</button>
            </template>
        </template>
        <template v-else>
            <button  v-for="index in pageCount" class="pag-button" :disabled="index ==0 && current==0 || index == pageCount && current == pageCount" :class="{active:current==index}" @click="jumpPage(index)">{{index}}</button>
        </template>
        <button  class="pag-button  " :disabled="current>=pageCount" :class="{disabled:current>=pageCount}" @click="jumpPage(current+1)">下一页&gt;</button>
        <div class="switch-page">
            <span class="text">转到第</span>
            <input class="page-input"  type="text" v-model="enterPage" @input="testInput($event.target)" @keydown.enter="jumpPage()"> 页
        </div>
        <button  class="pag-button  confirm-btn" @click="jumpPage()">确定</button>
        <div v-if="showCount" class="report-count">共&nbsp;<span class="red">{{reportCount}}</span>&nbsp;条{{reportType}}</div>
    </div>
</template>
<script>
export default{
    name:'pagination',
    data(){
        let width = document.documentElement.clientWidth;
        let center = 8;
        if(width<2000){
            center = Math.round(8*width/2000)-1;
        }
        return {
            enterPage:1,
            center:center,
            num:center,
            width:width,
            current:1
        }
    }, 
    created(){
        window.addEventListener('resize',()=>{
            let width = document.documentElement.clientWidth;
            if(width<2000){
                this.center = Math.round(8*width/2000)-1;
                this.num = this.center;
            }else{
                this.center = 8;
                this.num = 8;
            }
            this.width  = width;
        })
    },
    props:{
        rows:Number,
        reportCount:Number,

        //显示总数
        showCount:{
            type:Boolean,
            default:false
        },
        //报告类型
        reportType:{
            type:String,
            default:'公告'
        },
        //可调rows
        changeRow:{
            type:Boolean,
            default:true
        },
        rowsList:Array
    },
    components:{
        selectBox:require('./select/src/select.vue')
    },
    computed:{
        pageCount(){
            return Math.ceil(this.reportCount/this.rows)?Math.ceil(this.reportCount/this.rows):1;
        }
    },
    watch:{
         'current':function(value){
             if(value + 1 <= this.pageCount){
                 this.enterPage = value + 1;
             }else{
                 this.enterPage = this.pageCount;
             }
             if(this.pageCount > 10){
                if(value<this.center+2&& value>=this.center){
                    this.num = value + 1;
                }else if(value>this.pageCount-this.center-1 && value<=this.pageCount - this.center +1){
                    this.num = this.pageCount - value + 2;
                }else{
                     this.num = this.center;
                }
             }
         },
        'pageCount':function(value){
            if(this.current + 1 <= value){
                this.enterPage = this.current + 1;
            }else{
                this.enterPage = value;
            }
        }
    },
    methods:{
        jumpPage(page){
            if(page){
                if(Number(this.current) == Number(page)){
                    return;
                }
                this.$emit('jumpPage',page);
                this.current = page;
            }else{
                if(this.enterPage==0){
                    return;
                }
                if(this.enterPage>this.pageCount){
                    this.enterPage = this.pageCount;
                }
                if(Number(this.enterPage) == Number(this.current)){
                    return;
                }
                this.current = this.enterPage;
                this.$emit('jumpPage',this.enterPage);
            }
        },
        testInput(target){
            let value = target.value;
            let result = '';
            for(let char of value){
                if(/\d/.test(char)){
                    result += char;
                }
            }
            if(result == ''){
                this.enterPage = '';
            }else{
                this.enterPage = result-0;
            }
        },
        changeRows(index){
            let rows = parseInt(this.rowsList[index]);
            this.current = 1;
            this.$emit('changeRows',rows);
        }
    }
}
</script>
<style lang="less">
    @import '../less/common/variables.less';
    .pagination{
        font-size:@font-size-small;
    }
    .pag-button{
        padding:7px 12px;
        margin-left:-1px;
        border:1px solid @border-stroke1;
        color:@pagination-color;
        background: @bg-big;
        position:relative;
        cursor:pointer;
        float:left;
    }

    .pag-button:hover{
        z-index:3;
        border-color:@pag-btn-border;
        background: @bg-hover;
    }

    .pag-button:focus{
        outline: none;
    }
    .pag-button.active{
        border-color:@pag-btn-border;
        background:@bg-hover;
        z-index:2;
    }
    .pag-button.disabled:hover{
        z-index: auto;
        cursor:@cursor-disabled;
    }
    .pag-button.disabled{
        color:@pagination-color;
        cursor: default;
        background: @bg-big;
        border:1px solid @border-stroke1;
    }
    .switch-page{
        margin:0 5px;
        float:left;
    }
    .page-input{
        padding:4px 0;
        background:@bg-input;
        border:1px solid @input-border;
        color:@color-gray1;
        outline:none;
        width:45px;
        height:28px;
        &:focus{
            border-color:@input-border-focus;
            box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)
         }
    }
    .confirm-btn{
        padding:7px 15px;
    }
    .report-count{
        margin-left:5px;
        line-height:30px;
        float:left;
    }
    .red{
        color:@color-red;
    }
    .rows-perpage{
        float:left;
        margin-right:5px;
        margin-top:4px;
    }
    .pag-button{
        line-height: 14px;
        margin-right: 0;
    }
</style>
