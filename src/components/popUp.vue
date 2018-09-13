<!-- 弹窗,参数见下方data.example -->
<template>
    <div
        :class="classes"
        :id="popupId"
        ref="wrapper"
    >
        <div class="popup" ref="node_main" :style="{
                zIndex:this.alert?999:998,
                width:option.width+'px',
                height:option.height+'px',
                borderWidth:((option.border||border)?'1px':'0px'),
                borderStyle:(option.border||border)?'solid':'',
                left:position.left || option.left,
                top:position.top || option.top,
                boxShadow: option.boxShodaw||'none'}" @mouseenter="enterEvent" @mouseleave="leaveEvent($event.relatedTarget)">
            <div class="popup_top">
                <div class="popup_top_title" v-html="title"></div>
                <a v-if="closeBtn" class="popup_top_close" @click="close"></a>
            </div>
            <div class="popup_body" ref="body">
                <!-- 主体内容-->
                {{ content }}
                <slot @close="close"></slot>
            </div>
            <div v-if="showBottom" class="popup_footer">
                <search-btn class="popup_button" v-if="option.cancelButton" height="24" :padding="option.cancelPadding" white @click="close">{{cancelText}}</search-btn>
                <search-btn class="popup_button" v-if="option.confirmButton" height="24" :padding="option.confirmPadding" @click="confirm">{{confirmText}}</search-btn>
                <template v-if="option.customButton">
                    <search-btn class="popup_button" v-for="(button, index) in option.customButton" :key="index" height="24" :color="button.color" :padding="button.padding" @clickButton="customEvent(button.event)">{{button.text}}</search-btn>
                </template>
            </div>

        </div>
        <div class="popup-shadow" v-if="option.mask"></div>
    </div>
</template>
<script>
import searchBtn from '@c/button.vue';

export default {
    name: 'popUp',
    props: {
        options: Object,
        alert: {
            type: Boolean,
            default: false
        },
        border: {
            type: Boolean,
            default: false
        }
    },
    data() {
        let option = null
        if (!this.options) {
            option = {
                title: 'Go-Goal提示',
                //确认按钮
                confirmPadding: 15,
                confirmButton: true,
                confirmText: '确认',
                closeButton: true,
                width: '300',
                height: '150',
                mask: true
            }
        } else {
            option = this.options
        }
        let popupId = 'popup_' + Math.floor(Math.random() * 0x100000).toString(16)
        let title = option.title || '提示',
            closeBtn = option.closeButton || !option.hasOwnProperty('closeButton'),
            showBottom = option.cancelButton || option.confirmButton || option.customButton,
            cancelText = option.cancelText || '取消',
            confirmText = option.confirmText || '确认',
            content = option.content || ''
        return {
            //参数列表
            example: {
                title: '下载报表',
                //可拖拽,默认true
                dragable: true,
                //取消按钮
                cancelButton: true,
                cancelText: '取消',
                cancelButtonStyle: {},
                //确认按钮
                confirmButton: true,
                confirmText: '确认',
                confirmButtonStyle: {},
                content: '',
                //（‘x’）默认true
                closeButton: true,
                //弹窗整体（包含标题，及底部）大小
                width: '400',
                height: '200',
                //其他自定义按钮
                customButton: [
                    {
                        //按钮文本
                        text: '',
                        //目前只有blue,white，默认blue
                        color: 'blue',
                        //触发事件名
                        event: 'someEvent',
                        padding: 9
                    }
                ]
            },
            popupId: popupId,
            position: {
                left: null,
                top: null
            },
            title,
            closeBtn,
            showBottom,
            cancelText,
            confirmText,
            content,
            option: option
        }
    },
    components: {
        searchBtn,
    },
    computed: {
        node_main() {
            return this.$refs.node_main
        },
        classes() {
            const name = this.options.className || ''
            return [
                'popup-container',
                `${name}`,
            ]
        }
    },
    created() {
        // console.log(this.closeBtn);
    },
    mounted() {
        console.log()
        if (this.option.left) {
            let left = parseInt(this.option.left),
                width = Number(this.option.width || this.node_main.offsetWidth),
                screenWidth = document.documentElement.clientWidth
            if (left + width > screenWidth) {
                this.position.left = screenWidth - width + 'px'
            }
        } else {
            let width = Number(this.option.width || this.node_main.offsetWidth),
                screenWidth = document.documentElement.clientWidth
            if (screenWidth >= width) {
                this.position.left = parseInt((screenWidth - width) / 2) + 'px'
            } else {
                this.position.left = 0
            }
        }
        if (this.option.top) {
            let top = parseInt(this.option.top),
                height = Number(this.option.height || this.node_main.offsetHeight),
                screenHeight = document.documentElement.clientHeight
            if (top + height > screenHeight) {
                this.position.top = screenHeight - height < 0 ? 0 + 'px' : screenHeight - height + 'px'
            }
        } else {
            let height = Number(this.option.height || this.node_main.offsetHeight),
                screenHeight = document.documentElement.clientHeight
            if (screenHeight >= height) {
                this.position.top = parseInt((screenHeight - height) / 2) < 0 ? 0 : parseInt((screenHeight - height) / 2) + 'px'
            } else {
                this.position.top = 0
            }
        }
        const Observer = new MutationObserver(this.resetPosition)
        Observer.observe(this.$refs.body, { childList: true, subtree: true })
        if (this.option.disabledrag === true) {
            return
        }
        var subBody = document.querySelector('#' + this.popupId).querySelector('.popup')
        var dragHead = subBody.querySelector('.popup_top');
        //没有表头 按body 拖动
        if (!this.closeBtn) {
            dragHead = subBody;
        }
        dragHead.addEventListener('mousedown', () => {
            if (event.target.className.indexOf('popup_top_close') >= 0) {
                return
            }
            var body_position = {
                left: subBody.offsetLeft,
                top: subBody.offsetTop
            }
            var mouse_position = {
                left: event.clientX,
                top: event.clientY
            }
            let windowWidth = this.$refs.wrapper.parentNode ? this.$refs.wrapper.parentNode.offsetWidth : document.documentElement.clientWidth,
                windowHeight = this.$refs.wrapper.parentNode ? this.$refs.wrapper.parentNode.offsetHeight : document.documentElement.clientHeight
            // let leftMax = windowWidth - subBody.offsetWidth
            // let topMax = windowHeight - subBody.offsetHeight
            let leftMax = windowWidth;
            let topMax = windowHeight;
            var funcMove = () => {
                let left = body_position.left + (event.clientX - mouse_position.left)
                let top = body_position.top + (event.clientY - mouse_position.top)
                if (left <= 0) {
                    left = 0
                } else if (left > leftMax) {
                    left = leftMax
                }
                if (top <= 0) {
                    top = 0
                } else if (top > topMax) {
                    top = topMax
                }
                this.position.left = left + 'px'
                this.position.top = top + 'px'
            }
            document.addEventListener('mousemove', funcMove)
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', funcMove)
            })
        })
    },
    methods: {
        close() {
            this.$emit('close')
        },
        confirm() {
            this.$emit('confirm')
        },
        customEvent(event) {
            this.$emit(event)
        },
        leaveEvent(target) {
            this.$emit('leave', target)
        },
        enterEvent() {
            this.$emit('enter')
        },
        resetPosition() {
            console.log('dom change')
            let width = Number(this.option.width || this.node_main.offsetWidth),
                screenWidth = document.documentElement.clientWidth
            if (screenWidth >= width) {
                this.position.left = parseInt((screenWidth - width) / 2) + 'px'
            } else {
                this.position.left = 0
            }
            let height = Number(this.option.height || this.node_main.offsetHeight),
                screenHeight = document.documentElement.clientHeight
            if (screenHeight >= height) {
                this.position.top = parseInt((screenHeight - height) / 2) < 0 ? 0 + 'px' : parseInt((screenHeight - height) / 2) + 'px'
            } else {
                this.position.top = 0
            }
        },
        readEvent() {
            console.log('here')
        }
    },
    watch: {
        $slots: function (s) {
            console.log('slots change')
        }
    }
}
</script>
<style lang="less">
@import "../less/common/variables.less";
.popup-container {
//   position: fixed;
//   left: 0;
//   top: 0;
//   width: 100%;
//   height: 100%;
//   z-index: 100;
}

.popup {
  position: absolute;
  font-size: @font-size-small;
  z-index: 998;
  cursor: default;
  border-color: @popupWindow-line;
}

.popup_top {
  line-height: 30px;
  height: 30px;
  background-color: @color-blue;
  color: @color-white;
  padding: 0 5px 0 10px;
  cursor: pointer;
}

.popup_top_title {
  float: left;
}

.popup_top_close {
  float: right;
  width: 26px;
  height: 26px;
  margin-top: 2px;
  cursor: default;
  background: @ico-close center no-repeat;
  cursor: pointer;
}

.popup_top_close:hover {
  background-color: @color-red;
}

.popup_body {
  background-color: @color-white;
  height: e("calc(100% - 65px)");
  color: @item-text-color;
  ::-webkit-scrollbar-corner {
    background-color: rgb(223, 232, 241);
  }
  ::-webkit-scrollbar-thumb {
    border: 2px solid rgb(223, 232, 241);
    background: rgb(180, 200, 222);
  }
  ::-webkit-scrollbar-track-piece {
    background-color: rgb(223, 232, 241);
  }
  ::-webkit-scrollbar-button:horizontal:start {
    background: rgb(223, 232, 241) @scrollbar-img-left no-repeat center center;
  }

  ::-webkit-scrollbar-button:horizontal:end {
    background: rgb(223, 232, 241) @scrollbar-img-right no-repeat center center;
  }

  ::-webkit-scrollbar-button:vertical:start {
    background: rgb(223, 232, 241) @scrollbar-img-top no-repeat center center;
  }

  ::-webkit-scrollbar-button:vertical:end {
    background: rgb(223, 232, 241) @scrollbar-img-bottom no-repeat center center;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(180, 200, 222);
  }
}

.popup_footer {
  position: absolute;
  width: 100%;
  bottom: 0;
  border-top: 1px solid @popupWindow-line;
  line-height: 35px;
  padding-right: 15px;
  background-color: @color-white;
}

.popup_button {
  margin: 5px 0 5px 10px;
  float: right;
}

.popup-shadow {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 888;
  background: @color-black;
  opacity: 0.4;
  width: 100%;
  height: 100%;
}
</style>
