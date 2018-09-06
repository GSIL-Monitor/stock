<!-- 机构、股票搜索框 -->
<template>
    <div class="search-box">
        <div class="search-value clearfix">
            <input class="search-input" ref="searchIpt" type="text" @focus="focus" :placeholder="options.placeholder" v-model="search" @keydown.enter="triggerClick">
            <a v-if="options.arrow" class="search-arrow" href="javascript:;" @click="toggle"></a>
        </div>
        <div class="result-list" v-show="show">
            <div class="result-list_item" v-for="item in searchResult" @click="choose(item)">{{item}}</div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'searchBox',
        props: {
            options: {
                type: Object,
                default: () => { return {} }
            }
        },
        created() {
            document.addEventListener('click', () => {
                var target = event.target;
                if (target.className !== 'search-arrow') {
                    this.show = false;
                }
            })
        },
        mounted() {
            var self = this;
            var handleData = function (dataItem, i, selectedIndex) {
                var s = dataItem.stock_name,
                    t = dataItem.stock_code,
                    p = dataItem.stock_spell,
                    d = dataItem.address,
                    item;
                item = document.createElement('li');
                item.title = s;
                item.setAttribute('code', t);
                item.innerHTML = '<span>' + t + '</span>' + '<span>' + s + '</span>' + '<span>' + p + '</span>' + '<span>' + d + '</span>';
                if (selectedIndex === i) {
                    item.className = 'selected';
                }
                return item;
            }
            var onSelect = function (res) {
                self.$emit('selectStock', res.stock_code)
            };
            var options = {
                islocal: true,
                autoSubmit: true,
                getDataFun: this.dataService.searchStock,
                _this: this,
                width: 150,
                deferRequestBy: 50, //miliseconds
                handleData: handleData,
                onSelect: onSelect,
                itmeConut: 10,
                noCache: true, //set to true, to disable caching
                showValueParam: 'stock_name'
            };
            /* 点击任意处 机构类型框消失 */
            let ipt = this.$refs.searchIpt;
            new this.typeHead(ipt, options);
        },
        data() {
            return {
                searchResult: [],
                show: false,
                search: ''
            }
        },
        methods: {
            toggle() {
                if (this.show) {
                    this.show = false;
                } else {
                    this.show = true;
                    //                    this.options.api;
                }
            },
            choose(item) {
                this.show = false;
            },
            focus() {
                this.$emit('focus');
            },
            triggerClick(){
                this.$emit('triggerClick')
            }
        },
        watch: {
            'search': function (value) {
                var reg = new RegExp("[`~!@#$^&*()=|{}'_:;',\\\\[\\].<>\+\-/?~！@#‘’￥……&*（）——|{}【】‘；：”“'。，、？]")
                var str = '';
                for (var char of value) {
                    if (!reg.test(char)) {
                        str += char;
                    }
                }
                this.search = str;
            }
        }
    }
</script>
<style lang="less">
    @import '../less/common/variables.less';
    .search-box{
        user-select: none;
        display: inline-block;
        color:@color-gray1;
        background: @bg-input;
        position: relative;
    }
    .search-input{
        outline: none;
        float: left;
        text-indent: 5px;
        border:1px solid @border-stroke1;
        font-size:@font-size-small;
        padding-right:25px;
        line-height:18px;
        background:@bg-input;
        color:@color-gray1;
    }
    .search-arrow{
        float: left;
        margin-left:-1px;
        width:22px;
        height:22px;
        border:1px solid @border-stroke1;
        border-left:none;
        background:@bg-input url('../assets/rc-show.png') center center no-repeat;
    }
    .result-list{
        width:100%;
        box-sizing: border-box;
        padding:5px 0;
        cursor: pointer;
        position: absolute;
        top:21px;
        border:1px solid @border-stroke1;
        background:@bg-dropdown;
        font-size:@font-size-small;
    }
    .result-list_item{
        padding-left:8px;
        line-height:20px;
        color:@color-gray1;
    }
    .result-list_item:hover{
        background:@search_active;
    }
    .option{
        padding-left:15px;
    &.active{
         background:@search_active;
     }
    }
</style>
