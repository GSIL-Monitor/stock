<template>
  <div
    id="has-no-premisson"
    v-if="zytgNoPermission"
    @click="zytgDivClick"
    :style="{height: height + 'px'}"
    ref="noPremission"
  >
  </div>
  <div
    v-else-if="zyztNoPermission"
    :style="zyztPermissionStyle"
    class="has-no-premisson"
    ref="noPremission"
  >
    <div
      id="no-permission-inner"
      class="no-permission-inner"
      :style="zyztInnerStyle"
    >
      <img
        v-if="dataStore.length === 0"
        src="~@assets/default-no-permission.jpg"
        width="100%"
        height="100%"
      >
      <swiper
        v-if="dataStore.length"
        :options="swiperOption"
        ref="mySwiper"
      >
        <swiper-slide
            v-for="(item, index) of dataStore"
            :key="index"
            :data-index="index"
        >
            <img
                :src="item.go_image"
                class="slider-img"
                style="width:100%;height:100%;"
                :data-url="item.go_url"
            >
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import {
    swiper,
    swiperSlide,
} from 'vue-awesome-swiper'
import {
    getNewsAd,
} from '@service/index.js'
import {
    getToken,
} from '@c/utils/util.js'
import {
    JsToQtEventInterface,
    openBrowser,
} from '@c/utils/callQt.js'

export default {
    props: {
        permissonCode: {
            // 模块权限code
            type: [String, Array],
            required: true
        },
        userAgent: {
            // 服务端渲染项目可传
            required: false
        },
        userCookie: {
            // 服务端渲染项目可传
            required: false
        },
        forbidElement: {
            // 需要禁用滚动条的选择器，没有则不传
            type: String,
            required: false
        },
    },
    components: {
        swiper,
        swiperSlide,
    },
    data() {
        return {
            height: 0,
            codeJson: {},
            userType: null,
            zytgNoPermission: false,
            zyztNoPermission: false,
            cookie: this.userCookie,
            agent: this.userAgent,
            dataStore: [],
            adWidth: '70%',
            adHeight: '70%'
        }
    },
    created() {
        if (!this.agent || !this.cookie) {
            this.agent = navigator.userAgent
            this.cookie = document.cookie
        }
        this.userType = this.getCookie('userType')
        this.userPermisson()
        if (this.zyztNoPermission) {
            this.getAd()
        }
    },
    mounted() {
        if (this.zytgNoPermission) {
            this.initHeight()
            window.addEventListener('resize', this.windowResize)
        } else if (this.zyztNoPermission) {
            this.$nextTick(()=> {
                this.calculatePercentage()
            })
            window.addEventListener('resize', this.calculatePercentage)
            this.forbiddenParentScroll()
        }
    },
    computed: {
        swiperOption() {
            const defaults = {
                loop: true,
                speed: 800,
                autoplay: this.isAuto,
                preventClicks: true,
                allowTouchMove: false,
                zoom: false,
                on: {
                    tap: this.changeStock
                }
            }

            return defaults
        },
        isAuto() {
            return Object.is(this.dataStore.length, 1) ? false : {
                    delay: 3000,
                    disableOnInteraction: false
                }
        },
        zyztPermissionStyle() {
            return {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                'z-index': 99999,
                display: 'flex',
                'align-items': 'center',
                'justify-content': 'center'
            }
        },
        zyztInnerStyle() {
            return {
                width: this.adWidth.includes('%') ? this.adWidth : `${this.adWidth}px`,
                height: this.adHeight.includes('%') ? this.adHeight : `${this.adHeight}px`
            }
        }
    },
    methods: {
        isZytg() {
            return this.agent.includes('zytg')
        },
        isZyzt() {
            return this.agent.includes('zyzt')
        },
        initHeight() {
            this.height = document.documentElement.clientHeight
        },
        getCookie(key) {
            const reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`)
            if (this.cookie) {
                const arr = this.cookie.match(reg)
                const val = arr ? decodeURIComponent(arr[2]) : null
                return val
            } else {
                return null
            }
        },
        getAd() {
            let userType = JSON.parse(this.userType)
            let type = userType.user_type

            getNewsAd({
                options: {
                    product_version: type,
                    location: 4
                },
                callback0: data => {
                    let d = data.go_urls
                    this.dataStore = d
                },
            })
        },
        forbiddenParentScroll() {
            if (this.forbidElement) {
                this.$nextTick(() => {
                    document.querySelector(this.forbidElement).style.overflow = 'hidden'
                })
            }
        },
        windowResize() {
            this.height = document.documentElement.clientHeight
        },
        userPermisson() {
            let show = false
            if (this.userType) {
                let userType = JSON.parse(this.userType)
                let code = userType.button_code
                if (code.indexOf(this.permissonCode) < 0 && code.indexOf(this.codeJson[this.permissonCode]) < 0) {
                    show = true
                }
            }
            if (this.isZytg()) {
                this.zytgNoPermission = show
            } else if (this.isZyzt()) {
                this.zyztNoPermission = show
            }
        },
        zytgDivClick() {
            JsToQtEventInterface(
                JSON.stringify({
                    fun: 'AccountDeadlineTip',
                })
            )
        },
        calculatePercentage() {
            var ele = this.$refs.noPremission
            var width = ele.offsetWidth
            var height = ele.offsetHeight
            var normalPercentage = 16 / 9

            if (width && height) {
                var percentage = width / height
                var baseWidth, baseHeight
                if (percentage > normalPercentage) {
                    baseHeight = height * 0.7
                    baseWidth = baseHeight * normalPercentage
                } else {
                    baseWidth = width * 0.7
                    baseHeight = baseWidth / normalPercentage
                }
            } else {
                // 处理宽高异常情况
                if (width) {
                    baseWidth = width * 0.7
                    baseHeight = baseWidth / normalPercentage
                } else if (height) {
                    baseHeight = height * 0.7
                    baseWidth = baseHeight * normalPercentage
                }
            }

            this.adWidth = String(baseWidth)
            this.adHeight = String(baseHeight)
        },
        linkToUrl(url) {
            if (url) {
                if (!/\/\//.test(url)) {
                    url = 'http://' + url
                }
                let token = getToken()
                if (url.includes('?')) {
                    let urlArr = url.split('?')
                    url = `${urlArr[0]}?token=${token}&${urlArr[1]}`
                } else if (url.includes('#')) {
                    let urlArr = url.split('#')
                    url = `${urlArr[0]}?token=${token}#${urlArr[1]}`
                } else {
                    url += `?token=${token}`
                }
                openBrowser(url)
            }
        },
        changeStock(event) {
            let url = event.target.dataset.url
            this.linkToUrl(url)
        },
    },
    beforeDestroy() {
        if (this.zytgNoPermission) {
            window.removeEventListener('resize', this.windowResize)
        }
        if (this.zyztNoPermission) {
            window.removeEventListener('resize', this.calculatePercentage)
        }
    },
}
</script>

<style>
.no-permission-inner {
    background-color: var(--color-background);
    overflow: hidden;
}
.slider-img {
  cursor: pointer;
}
#has-no-premisson {
    opacity: 0;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
}
</style>
