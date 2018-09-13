var defaultOption = {
    page:1,
    pageCount:1,
    reportCount:0
}
var vueObj = { length : 0 };
var pagination = {
    name:'pagination',
    data(){
        var page = this.page + 1;
        return {
            enterPage:page,
            num:6,
            page:1,
            pageCount
        }
    },
    template:'<div class="pagination"><button class="button" :disabled="page==1" :class="{disabled:page==1}" @click="jumpPage(page-1)">&lt;上一页</button><template v-if="pageCount>10"><!--<button v-for="index in 8" class="button number" :class="{active:page==index}" @click="jumpPage(index)">{{index}}</button>--><button class="button number" :class="{active:page==1}" @click="jumpPage(1)">1</button> <button class="button number" :class="{active:page==2}" @click="jumpPage(2)">2</button>'+
             '<template v-if="page>pageCount-6"><button class="button number">...</button><button v-for="index in 10" class="button number" :class="{active:page==pageCount+index-10}" @click="jumpPage(pageCount+index-10)">{{pageCount+index-10}}</button></template><template v-else-if="page>7"><button class="button number">...</button><button class="button number" :class="{active:page==page-5+index}" v-for="index in num" @click="jumpPage(page-5+index)">{{page-5+index}}</button>'+
             '</template><template v-else><button v-for="index in num" class="button number" :class="{active:page==index+2}" @click="jumpPage(index+2)">{{index+2}}</button></template><template v-if="page<pageCount-5"><button class="button number">...</button><button class="button number" :class="{active:page==pageCount-1}" @click="jumpPage(pageCount-1)">{{pageCount-1}}</button><button class="button number" :class="{active:page==pageCount}" @click="jumpPage(pageCount)">{{pageCount}}</button>'+
             '</template><template></template></template><template v-else><button v-for="index in pageCount" class="button number" :disabled="index ==0 && page==0 || index == pageCount && page == pageCount" :class="{active:page==index}" @click="jumpPage(index)">{{index}}</button></template><button class="button" :disabled="page>=pageCount" :class="{disabled:page>=pageCount}" @click="jumpPage(page+1)">下一页&gt;</button><div class="switch-page"><span class="text">转到第</span>'+
             '<input class="page-input" type="text" v-model="enterPage" @keydown="testNum($event)" @keydown.enter="jumpPage()"> 页</div><a class="button confirm-btn" @click="jumpPage(0)">确定</a><div class="report-count">共&nbsp;<span class="red">{{reportCount}}</span>&nbsp;条公告</div></div>'
    ,
    // props:['pageCount','page','reportCount'],
    watch:{
        'page':function(value){
            if(value + 1 <= this.pageCount){
                this.enterPage = value + 1;
            }else{
                this.enterPage = this.pageCount;
            }

            if(value == 6){
                this.num = 7;
            }else if(value >= 7){
                this.num = 8;
            }else{
                this.num = 6;
            }
        },
        'pageCount':function(value){
            if(this.page + 1 <= value){
                this.enterPage = this.page + 1;
            }else{
                this.enterPage = value;
            }
        }
    },
    methods:{
        jumpPage(page){
            if(page){
                this.$emit('jumpPage',page);
            }else{
                if(this.enterPage==0){
                    return;
                }
                if(this.enterPage>this.pageCount){
                    this.enterPage = this.pageCount;
                }
                this.$emit('jumpPage',this.enterPage);
            }
        },
        testNum(event){
            if(event.keyCode<48 && event.keyCode!=8 || event.keyCode>57 && event.keyCode<96 || event.keyCode>105 || event.shiftKey){
                event.preventDefault();
            }
        }
    }
}
var reset = (options,name)=>{

}
