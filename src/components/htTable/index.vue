<style lang="less">
@import "../../less/common/variables.less";

// --- 大号字体(16px)宽度
.width-loop(@n, @i: 10) when (@i =< @n) {
  .htWidth@{i} {
    width: (@i * 1px);
    min-width: (@i * 1px);
    max-width: (@i * 1px);
  }
  .width-loop(@n, (@i + 10));
}
.width-loop(180, 40);

// --- 标准字体(14px)宽度
// .width-loop-95(@n, @i: 10) when (@i =< @n) {
//   .htWidth@{i} {
//     width: ceil(@i * 0.95px);
//     min-width: ceil(@i * 0.95px);
//     max-width: ceil(@i * 0.95px);
//   }
//   .width-loop-95(@n, (@i + 10));
// }
// .fontSize14 {
//   .width-loop-95(180, 40);
// }
.threeDots {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ht-table-container .without-data {
  position: absolute;
  width: 100%;
  height: 100%;
  &:before {
    content: "";
    display: table;
    width: 53px;
    height: 39px;
    margin-top: 20px;
    background: url(../../assets/noNew.png) no-repeat;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50px);
  }
  &:after {
    content: "暂无数据";
    display: table;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: 26px;
    transform: translate(-50%, 0);
    color: @color-gray1;
  }
}
.ht-table-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background: var(--color-card-background);
  table {
    line-height: 35px;
    width: 100%;
    font-size: 14px;
    border-collapse: collapse;
    // table-layout: fixed;
    thead {
      background: @bg-color__table_head;
      color: var(--color-table-header-text);
      //   border-bottom: 2px double var(--color-dividers);
      .sort-down-icon {
        & > i {
          display: inline-block;
          border: 5px solid transparent;
          border-top-color: @color__table_head;
          border-bottom-width: 0;
          margin-top: -3px;
        }
      }
      .sort-up-icon {
        & > i {
          display: inline-block;
          border: 5px solid transparent;
          border-bottom-color: @color__table_head;
          border-top-width: 0;
          margin-top: -3px;
        }
      }
    }
  }
  tbody {
    color: @color__table_body;
    div {
      width: fit-content;
    }
  }
  tr {
    border: 1px solid transparent;
    border-right: 0;
    border-left: 0;
  }
  th,
  td {
    padding: 0 3px;
    text-align: left;
  }
  td {
    white-space: nowrap;
    div {
      max-width: e("calc(100% - 6px)");
    }
  }
}
.ht_table-fixed-head-container {
  position: absolute;
  left: 0px;
  top: 0;
  z-index: 10;
  //   table {
  //     border-right: 1px solid @color-boder-1;
  //   }
}
.ht_table-fixed-head-container,
.ht_table-head-container {
  td {
    // line-height: 28px;
    font-size: 12px;
  }
  tr {
    &:last-child {
      th,
      td {
        border-bottom-color: transparent;
        // border-top-width: 0
      }
    }
  }
}

.ht_table-fixed-body-container,
.ht_table-body-container {
  background: var(--color-card-background);
  .ht-tr-hover {
    border-bottom-color: var(--color-selected);
  }
  .ht-tr-active {
    background: var(--color-selected-bg);
    border: 1px double var(--color-selected);
    border-right: 0;
    border-left: 0;
    // border-style: double;
    // border-top-color: @color-blue;
    // border-right-color: @color-blue;
    // border-bottom-color: @color-blue;
    // border-left-color: @color-blue;
  }
  tr {
    border-top-color: var(--color-dividers);
    border-bottom-color: var(--color-dividers);
    &:first-child {
      th,
      td {
        border-top-color: transparent;
        // border-top-width: 0
      }
    }
  }
}
.ht_table-head-container {
  overflow-x: auto;
  overflow-y: hidden;
}
.ht_table-fixed-body-container {
  position: absolute;
  left: 0px;
  top: 36px;
  z-index: 9;
  //   height: e("calc(100vh - 38px)");
  overflow: hidden;
  // overflow-y: auto;
  // &::-webkit-scrollbar {
  //     width: 0;
  // }
}
.ht_table-body-container {
  overflow: auto;
  //   position: relative;
  width: 100%;
  height: e("calc(100% - 36px)");
  position: absolute;
  top: 36px;
  bottom: 0;
}
[rowspan="2"] {
  height: 59px;
}
</style>
// ┌───────────────────────────────────┬──────────────────────────────────┐
// │   ht_table-fixed-head-container   │     ht_table-head-container      │
// ├───────────────────────────────────┼──────────────────────────────────┤
// │                                   │                                  │
// │                                   │                                  │
// │   ht_table-fixed-body-container   │     ht_table-body-container      │
// │                                   │                                  │
// │                                   │                                  │
// └───────────────────────────────────┴──────────────────────────────────┘
<template>
    <div class="ht-table-container" v-if="_ht_config && _ht_config.length">
        <div class="ht_table-fixed-head-container" v-if="fixedColCount">
            <table :style="{
                width: fixedTableWidth + 'px'
            }">
                <thead>
                    <tr v-for="(item, index) in _head_config" :key="index">
                        <td v-for="(n, i) in item" :key="i" v-if="n.colIndex < fixedColCount" :colspan="n.col" :rowspan="n.row" :class="[n.class || '', n.width? 'htWidth'+ n.width: '']" :style="{textAlign: n.align || ''}" @click="clickTheadCell($event, n)">
                            <div v-html="n.title"></div>
                        </td>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="ht_table-fixed-body-container" @wheel="handleWheel_left" ref="htfixTableBodyContainer" :style="calcFixedBodyContainerStyle" v-if="fixedColCount" @mouseleave="mouseleaveHtTable">
            <table :style="{marginBottom: endMargin + 'px', marginTop: startMargin +'px', width: fixedTableWidth + 'px'}">
                <tbody>
                    <tr v-for="(item, i) in tableData" :key="i" v-if="i >= startIndex && i < endIndex" :class="['row_'+i, activeRowIndex == i ? 'ht-tr-active' : '', hoverRowIndex == i ? 'ht-tr-hover' : '']" @click="clickTableRow($event, item, i)" @mouseenter="mouseenterTableRow(i)">
                        <td class="threeDots" v-for="(n, index) in _ht_config" :key="index" v-if="index < fixedColCount" :class="[n.class || '', n.width? 'htWidth'+ n.width: '']" @click="clickTbodyCell($event, item)" :style="{textAlign: n.align || ''}">
                            <span v-if="n.isPlain">{{item[n.field] || '--'}}</span>
                            <slot v-else :name="n.field" :rowData="item" :index="i">
                                <!-- 这里写入备用内容 -->
                            </slot>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="ht_table-head-container" ref="htTableHeaderContainer" :style="calcFixedHeadContainerStyle">
            <table :style="{
                marginLeft: fixedTableWidth + 'px',
            }">
                <thead>
                    <tr v-for="(item, index) in _head_config" :key="index">
                        <td v-for="(n, i) in item" :key="i" :colspan="n.col" :rowspan="n.row" v-if="i >= fixedColCount" :class="[n.class || '', n.width? 'htWidth'+ n.width: '']" :style="{textAlign: n.align || ''}" @click="clickTheadCell($event, n)">
                            <template v-if="n.name === '__checkbox'">
                                <check-box :check="isAllChecked" @tap="toggleCheckboxAll(item)"></check-box>
                            </template>
                            <div v-else :class="headCellClass(n)">
                                <span v-html="n.title"></span>
                                <i></i>
                            </div>
                        </td>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="ht_table-body-container" @scroll="handleScroll" ref="htTableBodyContainer" @mouseleave="mouseleaveHtTable" @wheel="handleWheel">
            <table :style="{
                marginLeft: fixedTableWidth + 'px',
                marginTop: startMargin +'px',
                marginBottom: endMargin + 'px',
                minWidth: 'calc(100% - ' + fixedTableWidth + 'px)'
                }" ref="htTableBody">
                <tbody :class="{
                    'without-data': tableData.length == 0
                }">
                    <tr v-for="(item, i) in tableData" :key="i" v-if="i >= startIndex && i < endIndex" :class="['row_'+i, activeRowIndex == i ? 'ht-tr-active' : '', hoverRowIndex == i ? 'ht-tr-hover' : '', rowClass(item)]" @click="clickTableRow($event, item, i)" @mouseenter="mouseenterTableRow(i)">
                        <td class="threeDots" v-for="(n, index) in _ht_config" :key="index" v-if="index >= fixedColCount" :class="[n.class, n.bodyClass, n.width? 'htWidth'+ n.width: '']" @click="clickTbodyCell($event, item)" :style="{textAlign: n.align || ''}">
                            <span v-if="n.isPlain">{{item[n.field] || '--'}}</span>
                            <template v-else-if="n.name === '__checkbox'">
                                <check-box :check="item.checked" @tap="toggleCheckboxItem(item)"></check-box>
                            </template>
                            <slot v-else :name="n.field" :rowData="item" :index="i">
                                <!-- 这里写入备用内容 -->
                            </slot>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import tool from './tool.js'
import checkBox from '@c/CheckBox.vue';
export default {
    components: {
        checkBox
    },
    data() {
        return {
            // --- 表头配置， 二维数组
            _head_config: [],
            // --- 表身配置， 一维数组
            _ht_config: [],

            isVerticalScrollBar: false,
            isHorizontalScrollBar: false,

            startIndex: -1,
            endIndex: 0,
            startMargin: 0,
            endMargin: 0,
            headMarginLeft: 0,
            fixedBodyTop: 0,
            fixedTableWidth: 0,

            activeRowIndex: null,
            hoverRowIndex: null,

            wheelCount: 0,
            wheelTimer: null,
            wheelTimer_left: null
        }
    },
    props: {
        tableData: {
            type: Array,
            default: () => { return [] }
        },
        height: {
            type: Number,
            default: 640
        },
        config: {
            type: Object,
            default: () => { return {} }
        },
        fields: {
            type: Array,
            default: () => { return [] }
        },
        // --- 左侧固定列数
        fixedColCount: {
            type: Number,
            default: 0
        },
        rowClass: {
            type: Function,
            default: () => { }
        },
        sortParams: {
            type: Object,
            default: () => { return {} }
        }
    },
    beforeCreate() {
    },
    created() {
        this.endIndex = this.tableData && this.tableData.length || 0
        this.generateConfig()
    },
    mounted() {
        window.addEventListener('resize', this.handleResize)
        this.calcFixedBoxStyle()
    },
    updated() {
        this.calcFixedBoxStyle()
    },
    computed: {
        calcFixedBodyContainerStyle() {
            return this.isVerticalScrollBar ? {
                height: 'calc(100% - ' + (36 + 12) + 'px)'
            } : {}
        },
        calcFixedHeadContainerStyle() {
            return this.isHorizontalScrollBar ? {
                marginRight: '12px'
            } : {}
        },
        isAllChecked() {
            return this.tableData.every(val => val.checked)
        }
    },
    methods: {
        headCellClass(n) {
            var result = []
            if (n.canSort) {
                result.push('pointer')
            }
            if (this.sortParams.order == n.field) {
                if (this.sortParams.order_type == -1) {
                    result.push('sort-down-icon')
                } else if (this.sortParams.order_type == 1) {
                    result.push('sort-up-icon')
                }
            }
            return result
        },
        generateConfig() {
            var temp = []
            this.fields.forEach(val => {
                temp.push(this.config[val])
            })
            var _config = tool.init(temp)
            this._head_config = _config.headConf
            this._ht_config = _config.bodyConf
            // console.log('this._ht_config:', this._ht_config)
            if (this.fixedColCount) {
                let fixedTableWidthTemp = 0
                for (var i = 0; i < this.fixedColCount; i++) {
                    fixedTableWidthTemp += this._ht_config[i].width || 0
                }
                this.fixedTableWidth = fixedTableWidthTemp
            }
            // console.log('\nthis._head_config:', this._head_config)
            // console.log('\nthis.startIndex: ', this.startIndex, ' this.endIndex: ', this.endIndex)
        },
        calcFixedBoxStyle() {
            if (!this.$refs.htTableBodyContainer) {
                return
            }
            let htTableBodyContainerHeight = this.$refs.htTableBodyContainer.offsetHeight,
                htTableBodyContainerWidth = this.$refs.htTableBodyContainer.offsetWidth,
                htTableBodyHeight = this.$refs.htTableBody.offsetHeight,
                htTableBodyWidth = this.$refs.htTableBody.offsetWidth
            let htTableBodyMarginLeft = parseInt(getComputedStyle(this.$refs.htTableBody).marginLeft) || 0
            htTableBodyWidth += htTableBodyMarginLeft

            // console.log('height: ', htTableBodyContainerHeight, htTableBodyHeight)
            // console.log('width: ', htTableBodyContainerWidth, htTableBodyWidth)
            if (htTableBodyContainerHeight < htTableBodyHeight) {
                // --- 有竖向滚动条
                this.isHorizontalScrollBar = true
            } else {
                this.isHorizontalScrollBar = false
            }
            if (htTableBodyContainerWidth < htTableBodyWidth) {
                // --- 有横向滚动条
                this.isVerticalScrollBar = true
            } else {
                this.isVerticalScrollBar = false
            }
        },
        handleResize() {
            this.calcFixedBoxStyle()
        },
        handleScroll() {
            var el = this.$refs.htTableBodyContainer
            var header = this.$refs.htTableHeaderContainer
            var fixbody = this.$refs.htfixTableBodyContainer
            // console.log(el.scrollLeft, el.scrollTop)

            this.headMarginLeft = -el.scrollLeft
            header.scrollLeft = el.scrollLeft;
            // header.style.marginLeft = this.headMarginLeft
            var containerHeight = el.offsetHeight,
                containerOffsetTop = el.scrollTop,
                sh = el.scrollHeight,
                dataLength = this.tableData.length
            this.endIndex = dataLength
            // console.log(containerOffsetTop)
            this.fixedBodyTop = containerOffsetTop
            if (fixbody) {
                fixbody.scrollTop = el.scrollTop;
            }
            var heightCount = 36 * dataLength;
            if (containerHeight > heightCount) {
                // --- 数据不够把空间充满
                this.startIndex = 0
                this.endIndex = dataLength
            } else if (heightCount - containerHeight >= 720) {
                var tempStart = Math.floor((containerOffsetTop - 360) / 36),
                    tempEnd = Math.ceil((containerOffsetTop + containerHeight + 360) / 36)
                this.startIndex = tempStart >= 0 ? tempStart : 0
                this.endIndex = tempEnd < dataLength ? tempEnd : dataLength
            } else {
                this.startIndex = 0
                this.endIndex = dataLength
            }
            this.startMargin = this.startIndex * 36

            if (this.endIndex) {
                this.endMargin = (this.tableData.length - this.endIndex) * 36
            }

            this.fixedBodyTop = containerOffsetTop - this.startIndex * 36
            setTimeout(() => {
                if (el.scrollHeight - containerHeight - containerOffsetTop < 200) {
                    this.$emit('loadmore')
                }
            }, 10);
            // console.log(containerHeight, ' ', containerOffsetTop, ' startIndex: ', this.startIndex, ' endIndex: ', this.endIndex, ' startMargin: ', this.startMargin, ' endMargin: ', this.endMargin)
        },
        handleWheel_left(e) {
            //  console.log('wheel',e,document.querySelector('.ht_table-fixed-body-container').scrollTop);
            //  var el = this.$refs.htTableBodyContainer
            //  var fixbody =  this.$refs.htfixTableBodyContainer
            //  el.scrollTop = fixbody.scrollTop;
            clearTimeout(this.wheelTimer_left)
            var flag = e.deltaY,
                timerCount = 4,
                temp = () => {
                    if (flag < 0) {
                        this.$refs.htTableBodyContainer.scrollTop -= 25
                    } else if (flag > 0) {
                        this.$refs.htTableBodyContainer.scrollTop += 25
                    }
                    timerCount--
                    if (timerCount) {
                        this.wheelTimer_left = setTimeout(() => {
                            temp()
                        }, 16);
                    }
                }
            temp()
        },
        handleWheel(e) {
            clearTimeout(this.wheelTimer)
            var el = this.$refs.htTableBodyContainer
            if (e.deltaY < 0 && el.scrollTop === 0) {
                --this.wheelCount
            } else if (e.deltaY > 0) {
                let ch = el.clientHeight,
                    st = el.scrollTop,
                    sh = el.scrollHeight
                if (ch + st === sh) {
                    ++this.wheelCount
                } else {
                    this.wheelCount = 0
                }
            } else {
                this.wheelCount = 0
            }
            if (this.wheelCount === 3) {
                this.$emit('wheelLimit', 'bottom')
            } else if (this.wheelCount === -3) {
                this.$emit('wheelLimit', 'top')
            }
            this.wheelTimer = setTimeout(() => {
                this.wheelCount = 0
            }, 200)
        },
        mouseleaveHtTable() {
            this.hoverRowIndex = null
        },
        clickTheadCell(e, conf) {
            this.$emit('clickTheadCell', e, conf)
        },
        clickTbodyCell(e, data) {
            this.$emit('clickTbodyCell', e, data)
        },
        clickTableRow(e, data, i) {
            this.activeRowIndex = i
            this.$emit('clickTableRow', e, data)
        },
        mouseenterTableRow(i) {
            this.hoverRowIndex = i
        },
        // --- 点击表头 checkbox
        toggleCheckboxAll() {
            var isAllCheckedTemp = this.isAllChecked
            this.tableData.forEach(val => {
                this.$set(val, 'checked', !isAllCheckedTemp)
            })
        },
        // --- 点击表格内 checkbox
        toggleCheckboxItem(item) {
            this.$set(item, 'checked', !item.checked)
        },

        // --- 滚动到顶部
        resetScrollTop() {
            this.$nextTick(() => {
                this.$refs.htTableBodyContainer.scrollTop = 0
            })
        }
    },
    watch: {
        tableData: function (newData) {
            this.startIndex = 0
            this.endIndex = newData.length
            this.handleScroll()
        },
        fields(val) {
            // console.log('this._head_config:', this._head_config)
            this.generateConfig()
        },
        endIndex(val) {
            this.$emit('indexChanged', this.startIndex, this.endIndex)
            console.log('\nthis.startIndex: ', this.startIndex, ' this.endIndex: ', this.endIndex)
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handleResize)
    }
}
</script>
