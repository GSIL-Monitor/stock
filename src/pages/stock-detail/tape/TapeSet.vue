<template>
    <div class="set_tape"
        :class="{'set_tape_Hide': isHide}"
    >
        <div class="set_tape_top">
            <div class="tape_header">
                <div class="tape_header_title">盘口设置</div>
                <span
                    class="tape_header_close"
                    @click="tapeComplete"
                >
                    X
                </span>
            </div>
            <div class="tape_section">
                <TapeSectionItem
                    v-for="(item, index) of setOrder"
                    :key="index"
                    :title="item.title"
                    :type="item.type"
                    :activeType="item.activeType"
                    :list="item.list"
                    :class="[item.className]"
                />
            </div>
            <div class="tape_footer">
                <TapeFuncStyle
                    :title="funcOrder.title"
                    :type="funcOrder.type"
                    :list="funcOrder.list"
                />
            </div>
        </div>
        <div class="set_tape_bottom">
            <DefaultBtn
                label="完成"
                @on-click="tapeComplete"
                class="tape_btn tape_btn_Sure"
            />
            <DefaultBtn
                label="重置"
                @on-click="tapeReset"
                class="tape_btn tape_btn_Reset"
            />
        </div>
    </div>
</template>

<script>
import {
    initTapeDefault,
    initTapeFunc,
} from './tape-public-func'
import {
    LOCAL_TAPE_SET_DFT,
    LOCAL_TAPE_SET_FUNC,
} from '../storage'
import {
    TAPE_ROWS,
    TAPE_CONTENT,
    TAPE_STYLE,
    FUNC_PERFORMANCE,
} from './tape-set-config'

import TapeSectionItem from './TapeSectionItem'
import TapeFuncStyle from './TapeFuncStyle'
import DefaultBtn from '../components/DefaultBtn'

export default {
    name: 'TapeSet',
    created() {
        this.initState()

        this.$eventBus.$on('dataChanged', (o) => {
            this.changed(o)
        })
    },
    data() {
        return {
            [TAPE_ROWS]: {
                type: TAPE_ROWS,
                title: '委托明细',
                className: 'tape-case-entrust',
                activeType: '5',
                list: [
                    {
                        text: '五档',
                        type: '5',
                    },
                    {
                        text: '三档',
                        type: '3',
                    },
                    {
                        text: '隐藏',
                        type: '0',
                    },
                ],
            },
            [TAPE_CONTENT]: {
                type: TAPE_CONTENT,
                title: '默认盘口内容',
                className: 'tape-case-content',
                activeType: 'market',
                list: [
                    {
                        text: '行情数据',
                        type: 'market',
                    },
                    {
                        text: '一致预期',
                        type: 'entrust',
                    },
                ],
            },
            [TAPE_STYLE]: {
                type: TAPE_STYLE,
                title: '默认盘口样式',
                className: 'tape-case-style',
                activeType: 'off',
                list: [
                    {
                        text: '展开',
                        type: 'on',
                    },
                    {
                        text: '收起',
                        type: 'off',
                    },
                ],
            },
            [FUNC_PERFORMANCE]: {
                type: [FUNC_PERFORMANCE],
                title: '功能显隐',
                list: [
                    {
                        text: '分价表',
                        type: 'price_table',
                        on: true,
                    },
                    {
                        text: '资金流向',
                        type: 'fund_flow',
                        on: true,
                    },
                    {
                        text: '短线精灵',
                        type: 'short_line',
                        on: true,
                    },
                    {
                        text: '简易财务',
                        type: 'simple_finance',
                        on: true,
                    },
                ],
            },
        }
    },
    components: {
        TapeSectionItem,
        TapeFuncStyle,
        DefaultBtn,
    },
    computed: {
        setOrder() {
            return [this[TAPE_ROWS], this[TAPE_CONTENT], this[TAPE_STYLE]]
        },
        funcOrder() {
            return this[FUNC_PERFORMANCE]
        },
    },
    methods: {
        initState() {
            initTapeDefault((key, val) => {
                this[key].activeType = val
            })
            initTapeFunc((val) => {
                let item = this.find(FUNC_PERFORMANCE, val)
                item.on = false
            })
        },
        find(parentType, type) {
            return this[parentType].list.find((el) => {
                return Object.is(Reflect.get(el, 'type'), type)
            })
        },
        changed(o) {
            this.changeState(o)
            this.setStorage(o)
            // TODO:通知兄弟组件数据变化
            this.emitChanged(o)
        },
        changeState(o) {
            let parentType = o.parentType
            if (o.isList) {
                // 修改子数据
                o.changed.forEach((el) => {
                    let item = this.find(parentType, el.type)
                    if (item) {
                        Object.assign(item, el)
                    }
                })
            } else {
                Object.assign(this[parentType], o.changed)
            }
        },
        setStorage(o) {
            if (Reflect.has(o, 'isList')) {
                this.setFuncStore(o)
            } else {
                this.setDefultStore(o)
            }
        },
        setDefultStore(o) {
            let store = localStorage.getItem(LOCAL_TAPE_SET_DFT)
            let parseStore = store ? JSON.parse(store) : {}
            let parentType = Reflect.get(o, 'parentType')
            let type = Reflect.get(o, 'type')
            Reflect.set(parseStore, parentType, type)
            localStorage.setItem(LOCAL_TAPE_SET_DFT, JSON.stringify(parseStore))
        },
        setFuncStore(o) {
            let store = localStorage.getItem(LOCAL_TAPE_SET_FUNC)
            let parseStore = store ? JSON.parse(store) : []
            o.changed.forEach((ele)=> {
                if (ele.on === false) {
                    parseStore.push(ele.type)
                } else {
                    let index = parseStore.indexOf(ele.type)
                    if (index > -1) {
                        parseStore.splice(index, 1)
                    }
                }
            })
            localStorage.setItem(LOCAL_TAPE_SET_FUNC, JSON.stringify(parseStore))
        },
        emitChanged(o) {
            if (Reflect.has(o, 'isList')) {
                // function
                console.log('emitChanged')
                console.log(o)
            } else {
                // default
                this.$eventBus.$emit('tapeDefaultChanged', o.parentType, o.type)
            }
        },
        tapeComplete() {
            this.$eventBus.$emit('tapeSet')
        },
        tapeReset() {
            const resetDefault = {
                [TAPE_ROWS]: '5',
                [TAPE_CONTENT]: 'market',
                [TAPE_STYLE]: 'off',
            }
            Object.entries(resetDefault).forEach(([key, value]) => {
                let nowType = Reflect.get(this[key], 'activeType')
                if (nowType !== value) {
                    Reflect.set(this[key], 'activeType', value)
                }
            })
            this[FUNC_PERFORMANCE].list.forEach((ele) => {
                if (!ele.on) {
                    ele.on = true
                }
            })
            localStorage.setItem(LOCAL_TAPE_SET_DFT, JSON.stringify(resetDefault))
            localStorage.setItem(LOCAL_TAPE_SET_FUNC, JSON.stringify([]))
        },
    },

    props: {
        isHide: {
            type: Boolean,
            default: false,
        }
    },
}
</script>

<style lang="less">
.set_tape {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 0 0 140px;
    border-left: 1px solid var(--color-border);
}
.set_tape_Hide {
    .tape_footer,
    .tape-case-content {
        display: none;
    }
}
.tape_header {
    display: flex;
    height: 25px;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;
    padding-right: 8px;
    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-card-background);
}
.tape_header_title {
    font-size: 14px;
}
.tape_header_close {
    font-size: 12px;
    cursor: pointer;
}
.tape_section,
.tape_footer {
    padding: 1px 8px;
}
.set_tape_bottom {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 17px;
}
.tape_btn {
    width: 100px;
    height: 32px;
    border-radius: 4px;
    font-size: 14px;
}
.tape_btn_Sure {
    background-color: var(--color-smallcard-background);
    color: var(--color-primary-text);
}
.tape_btn_Reset {
    margin-top: 10px;
    background-color: var(--color-button-normal);
    color: var(--color-white);
}
.tape-case-entrust {
    border-bottom: 1px solid var(--color-border);
}
.function_style {
     border-top: 1px solid var(--color-border);
}
</style>
