<!--
    props options example
    {
        // required property
        collection: [], // { array } { required } 快捷键列表集合
        containerEl: '.qwer', // { string } { required } 容器元素
        itemHeight: 28, { number } { required } 子元素高度
        callbacks: { // { object } { required } 回调函数
            changeAfter() {},  // { function } { required }
            changeBefore() {}, // { function } { optional }
        },

        // optional property
        el: 'tr', // { string } { optional } 快捷键作用元素选择器
        delayTime: 300, // { number } { optional } 延迟时间 (ms)
    }
-->
<script>
import throttle from 'lodash/throttle'

export default {
    props: {
        options: {
            type: Object,
            required: true,
        },
        activeKey: {
            required: false,
            default: -1,
        },
        forBidden: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            params: {
                delayTime: 300,
                el: 'tr',
                collection: [],
            },
            beforeState: false,
            afterState: false,
            containerHeight: 0,
            activeIndex: -1,
            container: null,
        }
    },
    watch: {
        activeKey(val) {
            this.activeIndex = val
        },
        activeIndex(val, oldValue) {
            if (Object.is(val, -1)) {
                return false
            }
            let nowKey = this.params.collection[val]

            this.params.changeAfter(nowKey)
        },
        container(val, oldValue) {
            if (val) {
                val.addEventListener('keydown', this.keyChange)
            }
            if (oldValue) {
                oldValue.removeEventListener('keydown', this.keyChange)
            }
        },
    },
    computed: {
        collectionLen() {
            return this.params.collection.length
        },
    },
    methods: {
        mergeOptions() {
            this.params = Object.assign({}, this.params, this.options)
        },
        initState() {
            if (typeof callbacks == 'object') {
                this.beforeState = typeof callbacks.changeBefore == 'function'
                this.afterState = typeof callbacks.changeAfter == 'function'
            }
        },
        moveUp() {
            if (this.activeIndex <= 0) {
                return false
            }

            this.activeIndex--
        },
        moveDown() {
            if (this.activeIndex === (this.collectionLen - 1)) {
                return false
            }

            this.activeIndex++
        },
        resizePage: throttle(function() {
            this.containerHeight = this.container.offsetHeight - this.params.itemHeight * 2
        }, 100),
        keyChange(event) {
            if (this.forBidden) {
                return false
            }
            let keyCode = event.which
            switch (keyCode) {
                case 38:
                case 'PageUp':
                    // 向上
                    event.preventDefault()
                    if (this.beforeState) {
                        this.params.callbacks.changeBefore()
                    }
                    this.moveUp()
                    break
                case 40:
                case 'PageDown':
                    //向下
                    event.preventDefault()
                    if (this.beforeState) {
                        this.params.callbacks.changeBefore()
                    }
                    this.moveDown()
                    break
            }
        },
    },
    created() {
        // merge props
        this.mergeOptions()
        this.initState()
        this.$watch('options.containerEl', (val, oldVal) => {
            this.$nextTick(() => {

            })
        })
    },
    mounted() {
        // mounted event
        this.container = document.querySelector(this.containerEl)
        window.addEventListener('resize', this.resizePage)
        this.resizePage()
    },
    beforeDestroy() {
        this.container.removeEventListener('keydown', this.keyChange)
        window.removeEventListener('resize', this.resizePage)
    },
}
</script>
