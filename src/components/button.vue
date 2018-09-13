<!-- 按钮
    blue,white,gray,cancel,蓝、白、灰、终端取消按钮,默认蓝
    width,padding二传一，或都不传，默认28px padding，
    height,默认20px行高,
    radius，默认2px,

 -->
<template>
    <a href="javascript:;" class="search-btn" :class="btn_color" :style="btn_style" @click="clickButton"><slot></slot></a>
</template>
<script>
    export default {
        name: 'searchBtn',
        props: {
            color: {
                type: String
            },
            width:{
                type:[String,Number]
            },
            padding:{
                type:[String,Number],
            },
            height:{
                type:[String,Number],
                default:22
            },
            radius:{
                type:[String,Number],
                default:2
            },
            blue:{
                type:Boolean,
                default:true
            },
            white:{
                type:Boolean,
                default:false
            },
            gray:{
                type:Boolean,
                default:false
            },
            cancel:{
                type:Boolean,
                default:false
            },
            font:{
                type:[String,Number],
                default:12
            }
        },
        data(){
            let width = this.width?{width:parseInt(this.width)+'px'}
                        :this.padding?{paddingLeft:parseInt(this.padding)+'px',paddingRight:parseInt(this.padding)+'px'}
                        :{paddingLeft:'28px',paddingRight:'28px'},
                other = {borderRadius:parseInt(this.radius)+'px',lineHeight:parseInt(this.height)+'px',fontSize:parseInt(this.font)+'px'},
                color = this.gray?'btn-gray':this.white?'btn-white':this.cancel?'btn-cancel':this.color?this.color:'btn-blue';
            let style = Object.assign({},width,other);
            return {
                btn_style:style,
                btn_color:color
            }
        },
        methods: {
            clickButton() {
                this.$emit('click');
            }
        }
    }
</script>
<style lang="less">
    @import '../less/common/variables.less';
    .search-btn{
        display: inline-block;
        outline: none;
        cursor: pointer;
        border-width: 1px;
        border-style: solid;
        text-align: center;
        text-decoration: none;
        outline: none;
    }
    .search-btn:focus{
        outline: none;
    }
    .search-btn.btn-blue:hover{
        background: var(--color-btn-bg2);
    }
    .search-btn.btn-blue:active{
        background: @color-btn-click;
    }
    .search-btn.btn-blue{
        background: var(--color-blue);
        color: var(--color-white);
        border-color:transparent;
    }
    .search-btn.btn-white{
        background: var(--color-white);
        color: var(--color-blue);
        border-color: var(--color-blue);
    }
    .search-btn.btn-white:hover{
        background:@item-texthover-color;
    }
    .search-btn.btn-cancel{
        background:@cancel-btn-bg;
        color:@cancel-btn-color;
        border-color:@cancel-btn-border;
    }
    .search-btn.btn-cancel:hover{
        background:@white-btn-hover;
        color:@cancel-btn-hover-color;
    }
</style>
