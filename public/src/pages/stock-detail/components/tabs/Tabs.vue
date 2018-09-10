<template>
    <div :class="classes">
        <div
            ref="navWrap"
            :class="[prefixCls + '_wrap']"
        >
            <slot name="navPrev"></slot>
            <div
                v-for="(item, index) of navList"
                :key="index"
                :class="tabCls(item)"
                @click="handleChange(index)"
                :style="navStyles"
            >
                <div class="gg_tabs_tab_text">{{item.label}}</div>
            </div>
            <slot name="navNext"></slot>
        </div>
        <div
            :class="contentClasses"
            ref="panes"
        >
            <slot></slot>
        </div>
    </div>
</template>

<script>
    const prefixCls = 'gg_tabs'

    export default {
        name: 'Tabs',
        mounted() {
            this.initActive()
            this.updateNav()
        },
        props: {
            activeStyle: {
                type: String,
                default: 'normal',
                validator(val) {
                    return ['underline', 'leftline', 'normal'].includes(val)
                },
            },
            average: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                prefixCls,
                navList: [],
                activeKey: null,
            }
        },
        computed: {
            classes() {
                return [
                    `${prefixCls}`,
                ]
            },
            contentClasses() {
                return [
                    `${prefixCls}_content`,
                ]
            },
            navStyles() {
                let style = {}
                if (this.average) {
                    let len = this.getTabs().length
                    let width = Object.is(len, 0) ? 100 : 100 / len
                    style['width'] = `${width}%`
                }

                return style
            },
        },
        methods: {
            getTabs () {
                return this.$children.filter(item => (item.$options.name || item.$options._componentTag) === 'TabPane');
            },
            getTabIndex(paneType){
                return this.navList.findIndex(nav => nav.paneType === paneType);
            },
            initActive() {
                this.getTabs().forEach((pane, index) => {
                    if (pane.active) {
                        this.activeKey = pane.paneType || index
                    }
                })
            },
            updateNav() {
                this.navList = []
                this.getTabs().forEach((pane, index) => {
                    this.navList.push({
                        paneType: pane.paneType || index,
                        label: pane.label,
                    })

                    if (Object.is(pane.paneType, void 0)) {
                        pane.paneType = index;
                    }
                    if (index === 0) {
                        if (!this.activeKey) this.activeKey = pane.paneType || index;
                    }
                })
                this.updateStatus();
            },
            updateStatus() {
                const tabs = this.getTabs();
                tabs.forEach(tab =>
                    {
                        tab.show = (tab.paneType === this.activeKey)
                    });
            },
            handleChange(index) {
                const nav = this.navList[index];
                if (Object.is(this.activeKey, nav.paneType)) return
                this.activeKey = nav.paneType
                this.$emit('on-click', nav.paneType)
            },
            tabCls(item) {
                return [
                    `${prefixCls}_tab`,
                    {
                        [`${prefixCls}_tab_active`]: item.paneType === this.activeKey,
                        [`${prefixCls}_tab_active_${this.activeStyle}`]: item.paneType === this.activeKey,
                    },
                ]
            },
        },
        watch: {
            activeKey(val) {
                this.updateStatus()
            },
        },
    }
</script>

<style lang="less">
    .gg_tabs {
        display: flex;
        flex-direction: column;
        flex: 1;
    }
    .gg_tabs_wrap {
        display: flex;
        position: relative;
        font-size: 12px;
        align-items: center;
    }
    .gg_tabs_tab {
        position: relative;
        cursor: pointer;
        white-space: nowrap;
    }
    .gg_tabs_tabpane {
        height: 100%;
    }
    .gg_tabs_tab_active {
        color: #15A4FA;
    }
    .gg_tabs_tab_active_underline {
        .gg_tabs_tab_text {
            position: relative;
            &:after{
                content: '';
                position: absolute;
                width: 100%;
                height: 2px;
                bottom: -2px;
                left: 0;
                background-color: #15A4FA;
            }
        }
    }
    .gg_tabs_tab_active_leftline {
        display: flex;
        align-items: center;
        &:before {
            content: '';
            display: block;
            width: 4px;
            height: 70%;
            background-color: #15A4FA;
        }
    }
</style>
