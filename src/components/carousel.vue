<!-- 弹窗,参数见下方data.example -->
<template>
    <div class="Carousel" ref="wrapper">
        <div class="Carousel-display">
            <clone-node ref="moveContent"><slot></slot></clone-node>
        </div>
        <div v-if="control" class="Carousel-left Carousel-btn" @click="clickLeft">
            <slot name="left"></slot>
        </div>
        <div v-if="control" class="Carousel-right Carousel-btn" @click="clickRight">
            <slot name="right"></slot>
        </div>
        <ol v-if="pagination && !disable" class="Carousel-pagination">
            <li v-for="(i, index) in count" class="Carousel-dot" :key="index" :class="{'Carousel-active':now == i - 1 || now == -1 && i == count || now == count && i==1}" @click="jumpTo(i)"></li>
        </ol>
    </div>
</template>
<script>
    import Vue from 'vue';
    export default {
        name: 'carousel',
        props:{
            /* 均为可选参数 */

            // 自动轮播
            autoPlay:{
                type: Boolean,
                default: true
            },
            // 自动播放间隔(ms)
            interval:{
                type:[Number, String],
                default:2000
            },
            // 是否需左右按钮
            control:{
                type: Boolean,
                default: true
            },
            // 是否需页码
            pagination:{
                type: Boolean,
                default: false
            },

            // 运动完成时长
            speed:{
                type: [Number,String],
                default: 500
            },
            // 移入暂停
            mouseStop:{
                type:Boolean,
                default:true
            }            
            // // 是否循环播放
            // circle:{
            //     type: Boolean,
            //     default: true
            // },
        },
        data(){
            let duration = null;
            // 默认1秒
            if(this.autoPlay){
                duration = Number(this.interval);
            }
            return {
                // 当前展示序号
                now:0,
                // 自动展示定时器
                playTimer:null,
                // 滚动间隔
                duration,
                // 临界距离移动位置
                positionTimer:null,
                // 左侧距离
                left:null,
                // 单个宽度
                width:null,
                // 原始dom数
                count:0,
                // 运动时禁点击（暂时）
                isMoving:false,
                // 左侧最小
                minLeft:null,
                // 左侧最大
                maxLeft:null,
                // 可完整显示时不滚动
                disable:false,
                // DOM节点
                moveContent:null,
                cloneNodes:[]
            }
        },
        created(){
            const _this = this;
            // 插入元素，前后各复制一次
            Vue.component('cloneNode', {
                render (createElement) {
                    return createElement('section', {
                        class:'Carousel-list',
                        on: {
                            mouseenter: _this.stop,
                            mouseleave: _this.resume
                        },
                    },[
                    ..._this.deepClone(this.$slots.default, createElement), // cloned node
                    ...this.$slots.default,                                 // original node
                    ..._this.deepClone(this.$slots.default, createElement)  // cloned node
                    ])
            }
        })
        },
        mounted(){
            this.moveContent = this.$refs.moveContent.$el;
            const Children = this.moveContent.children;
            const Len = Children.length / 3;
            [...Children].forEach((node,i)=>{
                if(i < Len || i>= 2 * Len){
                    this.cloneNodes.push(node);
                }
            })
            this.count = Len;
            this.width = Children[0].offsetWidth;
            this.minLeft = -this.width*Len;
            this.maxLeft = -this.width*(Len * 2 - 1);
            this.left = -this.width*Len;
            this.moveContent.style.transform = `translateX(${this.left}px)`;
            this.handleResize();
            if(this.autoPlay && !this.disable){
                this.automate();
            }
            window.addEventListener('resize',this.handleResize)
        },
        methods: {
            //  缩放时检测是否能完整容纳
            handleResize(){
                const wrapperWidth = this.$refs.wrapper.offsetWidth;
                if(wrapperWidth >= this.width * this.count){
                    this.disable = true;
                }else{
                    this.disable = false;
                }
            },
            //  点击左键
            clickLeft(){
                if(this.isMoving || this.disable){
                    return;
                }
                clearInterval(this.playTimer);
                this.Prev(true);
            },
            //  点击右键
            clickRight(){
                if(this.isMoving || this.disable){
                    return;
                }
                clearInterval(this.playTimer);
                this.Next(true);
            },
            //  向左滚动
            Prev(restart){
                clearTimeout(this.positionTimer)
                this.setTransition();
                this.now--;
                this.left += this.width;
                this.moveContent.style.transform = `translateX(${this.left}px)`;
                this.isMoving = true;
                this.positionTimer = setTimeout(()=>{
                    if(this.now == -1){
                        this.clearTransition();
                        this.now = this.count - 1;
                        this.left = this.maxLeft;
                        this.moveContent.style.transform = `translateX(${this.left}px)`;
                    }
                    this.isMoving = false;
                },this.speed)
                if(restart){
                    this.automate();
                }
            },
            //  向右滚动
            Next(restart){
                clearTimeout(this.positionTimer)
                this.setTransition();
                this.now ++;
                this.left -= this.width;
                this.moveContent.style.transform = `translateX(${this.left}px)`;
                this.isMoving = true;
                this.positionTimer = setTimeout(()=>{
                    if(this.now == this.count){
                        this.clearTransition();
                        this.left = this.minLeft;
                        this.moveContent.style.transform = `translateX(${this.left}px)`;
                        this.now = 0;
                    }
                    this.isMoving = false;
                },this.speed)
                if(restart){
                    this.automate();
                }
            },
            //  临界距离时立即调整位置
            clearTransition(){
                this.moveContent.style.transition = 'transform 0s';
            },
            setTransition(){
                this.moveContent.style.transition =  `transform ${this.speed/1000}s`;
            },
            automate(){
                // requestAnimationFrame()
                this.playTimer = setInterval(this.Next,this.duration)
            },
            //  鼠标移入暂停
            stop(){
                if(this.mouseStop && !this.disable){
                    clearInterval(this.playTimer);
                }
            },
            //  鼠标移出恢复
            resume(){
                if(this.mouseStop && !this.disable){
                    this.automate();
                }
            },
            //  点击跳跃
            jumpTo(index){
                if(this.now == index - 1){
                    return;
                }
                clearInterval(this.playTimer);
                clearTimeout(this.positionTimer);
                this.setTransition();
                const basic = this.minLeft;
                this.now = index - 1;
                this.moveContent.style.transform = `translateX(${basic - this.width * (index - 1) }px)`;
                if(this.autoPlay && !this.disable){
                    this.positionTimer = setTimeout(()=>{
                        this.automate();
                    },this.speed)
                }
            },
            //  克隆插槽
            deepClone(vnodes, createElement) {
                function cloneVNode (vnode) {
                    const clonedChildren = vnode.children && vnode.children.map(vnode => cloneVNode(vnode));
                    const cloned = createElement(vnode.tag, vnode.data, clonedChildren);
                    cloned.text = vnode.text;
                    cloned.isComment = vnode.isComment;
                    cloned.componentOptions = vnode.componentOptions;
                    cloned.elm = vnode.elm;
                    cloned.context = vnode.context;
                    cloned.ns = vnode.ns;
                    cloned.isStatic = vnode.isStatic;
                    cloned.key = vnode.key;
                    return cloned;
                }
                const clonedVNodes = vnodes.map(vnode => cloneVNode(vnode))
                return clonedVNodes;
            }
        },
        watch:{
            //  resize后自动轮播 或 暂停轮播
            'disable'(now,last){
                if(this.autoPlay && now){
                    clearInterval(this.playTimer);
                    this.cloneNodes.forEach((node)=>{
                        node.style.display = 'none';
                    })
                    this.clearTransition();
                    this.moveContent.style.transform = `translateX(0px)`;
                }else{
                    if(this.autoPlay){
                        this.playTimer = setInterval(this.Next,this.duration);
                        this.cloneNodes.forEach((node)=>{
                            node.style.display = 'block';
                        })
                        this.clearTransition();
                        this.left = this.minLeft;
                        this.now = 0;
                        this.moveContent.style.transform = `translateX(${this.minLeft}px)`;
                    }   
                }
            }
        },
        //  unbind event handler after this component's destruction
        beforeDestroy(){
            window.removeEventListener('resize',this.handleResize)
        }
    }
</script>
<style lang="less">
    .Carousel{
        position: relative;
    }
    .Carousel-display{
        overflow: hidden;
    }
    .Carousel-list{
        width:max-content;
    }
    .Carousel-item{
        display: inline-block;
        list-style: none;
    }
    .Carousel-btn{
        position: absolute;
        top: 0;
    }
    .Carousel-left{
        left:0;
    }
    .Carousel-right{
        right: 0;
    }
    .Carousel-pagination{
        margin: 0;
        position: absolute;
        li{
            list-style:none;
            display: inline-block;
        }
    }
</style>
