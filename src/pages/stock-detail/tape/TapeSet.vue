<template>
    <div
        :class="containerClasses"
    >
        <div class="set_tape_top">
            <div class="tape_header">
                <div class="tape_header_title">盘口设置</div>
                <span
                    class="tape_header_close"
                    @click="$_changeTapeDisplay"
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
            <default-btn
                @on-click="$_changeTapeDisplay"
                class="tape_btn tape_btn_Sure"
            >
                完成
            </default-btn>
            <default-btn
                @on-click="tapeReset"
                class="tape_btn tape_btn_Reset"
            >
                重置
            </default-btn>
        </div>
    </div>
</template>

<script>
import {
    mapState,
    mapMutations,
    mapActions,
} from 'vuex'
import {
    TAPE_ROWS,
    TAPE_CONTENT,
    TAPE_STYLE,
    FUNC_PERFORMANCE,
} from './tape-set-config.js'
import {
    TAPE_RESET_STATE,
} from '@store/stock-detail-store/config/action-types.js'

import tapeDisplayMixin from '../mixins/tape-display-mixin.js'

import DefaultBtn from '../components/DefaultBtn.vue'
import TapeSectionItem from './TapeSectionItem.vue'
import TapeFuncStyle from './TapeFuncStyle.vue'

export default {
    name: 'TapeSet',
    mixins: [
        tapeDisplayMixin,
    ],
    props: {
        isHide: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        ...mapState({
            [TAPE_ROWS]: state => state.moduleTape[TAPE_ROWS],
            [TAPE_CONTENT]: state => state.moduleTape[TAPE_CONTENT],
            [TAPE_STYLE]: state => state.moduleTape[TAPE_STYLE],
            [FUNC_PERFORMANCE]: state => state.moduleTape[FUNC_PERFORMANCE],
        }),
        containerClasses() {
            let prefix = 'set_tape'

            return [
                prefix,
                {
                    [`${prefix}_Hide`]: this.isHide,
                },
            ]
        },
        setOrder() {
            return [this[TAPE_ROWS], this[TAPE_CONTENT], this[TAPE_STYLE]]
        },
        funcOrder() {
            return this[FUNC_PERFORMANCE]
        },
    },
    methods: {
        ...mapActions([
            TAPE_RESET_STATE,
        ]),
        tapeReset() {
            this[TAPE_RESET_STATE]()
        },
    },
    components: {
        TapeSectionItem,
        TapeFuncStyle,
        DefaultBtn,
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
