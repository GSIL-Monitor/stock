<template>
    <div class="el-table" :class="{
                      'el-table--fit': fit,
                      'el-table--striped': stripe,
                      'el-table--border': border,
                      'el-table--fluid-height': maxHeight,
                      'el-table--enable-row-hover': !store.states.isComplex,
                      'el-table--enable-row-transition': true || (store.states.data || []).length !== 0 && (store.states.data || []).length < 100
                    }" @mouseleave="handleMouseLeave($event)" :style="[tableHeight,{fontSize:font+'px'}]">
        <div class="hidden-columns" ref="hiddenColumns">
            <slot></slot>
        </div>
        <div class="el-table__header-wrapper" ref="headerWrapper" v-if="showHeader">
            <table-header :store="store" :layout="layout" :border="border" :default-sort="defaultSort" :style="{ width: layout.bodyWidth ? layout.bodyWidth + 'px' : '' }" v-on:clearSelection="clearSelection">
            </table-header>
        </div>
        <!-- to do -->
        <div class="el-table__body-wrapper" ref="bodyWrapper" v-infinite-scroll="loadMore" infinite-scroll-disabled="isInfiniteScrollDisabled" infinite-scroll-distance="200" :style="[bodyHeight]">
            <table-body :context="context" :store="store" :layout="layout" :row-class-name="rowClassName" :row-style="rowStyle" :highlight="highlightCurrentRow" :style="{ width: bodyWidth }">
            </table-body>
            <div :style="{ width: bodyWidth }" class="el-table__empty-block" v-if="!data || data.length === 0">
                <span class="el-table__empty-text">
                    <slot name="empty">{{ emptyText || t('el.table.emptyText') }}</slot>
                </span>
            </div>
        </div>
        <div class="el-table__fixed" ref="fixedWrapper" v-if="fixedColumns.length > 0" :style="[
                        { width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' },
                        fixedHeight
                      ]">
            <div class="el-table__fixed-header-wrapper" ref="fixedHeaderWrapper" v-if="showHeader">
                <table-header fixed="left" :border="border" :store="store" :layout="layout" :style="{ width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' }"></table-header>
            </div>
            <div class="el-table__fixed-body-wrapper" ref="fixedBodyWrapper" :style="[
                          { top: layout.headerHeight + 'px' },
                          fixedBodyHeight,
                          fixedOverFlow
                        ]">
                <table-body fixed="left" :store="store" :layout="layout" :highlight="highlightCurrentRow" :row-class-name="rowClassName" :row-style="rowStyle" :style="{ width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' }">
                </table-body>
            </div>
        </div>
        <div class="el-table__fixed-right" ref="rightFixedWrapper" v-if="rightFixedColumns.length > 0" :style="[
                        { width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' },
                        { right: layout.scrollY ? (border ? layout.gutterWidth : (layout.gutterWidth || 1)) + 'px' : '' },
                        fixedHeight
                      ]">
            <div class="el-table__fixed-header-wrapper" ref="rightFixedHeaderWrapper" v-if="showHeader">
                <table-header fixed="right" :border="border" :store="store" :layout="layout" :style="{ width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' }"></table-header>
            </div>
            <div class="el-table__fixed-body-wrapper" ref="rightFixedBodyWrapper" :style="[
                          { top: layout.headerHeight + 'px'},
                          fixedBodyHeight
                        ]">
                <table-body fixed="right" :store="store" :layout="layout" :row-class-name="rowClassName" :row-style="rowStyle" :highlight="highlightCurrentRow" :style="{ width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' }">
                </table-body>
            </div>
        </div>
        <div class="el-table__fixed-right-patch" v-if="rightFixedColumns.length > 0" :style="{ width: layout.scrollY ? layout.gutterWidth + 'px' : '0', height: layout.headerHeight + 'px' }"></div>
        <div class="el-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"></div>
    </div>
</template>
<script type="text/babel">
//   import ElCheckbox from '../../checkbox';
import throttle from "throttle-debounce/throttle";
import debounce from "throttle-debounce/debounce";
import {
  addResizeListener,
  removeResizeListener
} from "../../utils/resize-event";
//  import Locale from 'element-ui/src/mixins/locale';
import TableStore from "./table-store";
import TableLayout from "./table-layout";
import TableBody from "./table-body";
import TableHeader from "./table-header";
import { mousewheel } from "./util";

let tableIdSeed = 1;

export default {
  name: "ElTable",
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    isInfiniteScrollDisabled: {
      type: Boolean,
      default: true
    },
    // tableType: {
    //     type: String,
    //     default: ''
    // },
    width: [String, Number],

    height: [String, Number],

    maxHeight: [String, Number],
    fit: {
      type: Boolean,
      default: true
    },
    stripe: {
      type: Boolean,
      default: true
    },
    border: Boolean,
    rowKey: [String, Function],
    context: {},
    showHeader: {
      type: Boolean,
      default: true
    },
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    highlightCurrentRow: Boolean,
    currentRowKey: [String, Number],
    emptyText: String,
    expandRowKeys: Array,
    defaultExpandAll: Boolean,
    defaultSort: Object,
    clearScrollTop: Object,
    clearScrollLeft: Object,
    //滚动固定列
    scrollFixed: {
      type: Boolean,
      default: true
    },
    font: [Number, String]
  },

  components: {
    TableHeader,
    TableBody
    //   ElCheckbox
  },

  methods: {
    loadMore() {
      this.$emit("needMoreData");
    },
    toggleRowSelection(row, selected) {
      this.store.toggleRowSelection(row, selected);
      this.store.updateAllSelected();
    },

    clearSelection() {
      this.store.clearSelection();
    },

    handleMouseLeave() {
      this.store.commit("setHoverRow", null);
      if (this.hoverState) this.hoverState = null;
    },

    updateScrollY() {
      this.layout.updateScrollY();
    },

    bindEvents() {
      const { headerWrapper } = this.$refs;
      const refs = this.$refs;
      const self = this;
      this.bodyWrapper.addEventListener("scroll", function() {
        if (self.node_scroll == this) {
          if (headerWrapper) headerWrapper.scrollLeft = this.scrollLeft;
          if (refs.fixedBodyWrapper)
            refs.fixedBodyWrapper.scrollTop = this.scrollTop;
          if (refs.rightFixedBodyWrapper)
            refs.rightFixedBodyWrapper.scrollTop = this.scrollTop;
        }
      });
      this.bodyWrapper.addEventListener("mousewheel", function() {
        self.node_scroll = this;
      });
      if (this.scrollFixed) {
        setTimeout(() => {
          if (refs.fixedBodyWrapper) {
            refs.fixedBodyWrapper.addEventListener("scroll", function() {
              if (self.node_scroll == this) {
                if (refs.bodyWrapper)
                  refs.bodyWrapper.scrollTop = this.scrollTop;
                if (headerWrapper) headerWrapper.scrollLeft = this.scrollLeft;
              }
            });
            refs.fixedBodyWrapper.addEventListener("mousewheel", function() {
              self.node_scroll = this;
              clearTimeout(self.node_timer);
              self.node_timer = setTimeout(() => {
                self.node_scroll = self.bodyWrapper;
              }, 200);
            });
          }
        });
      }
      if (headerWrapper) {
        mousewheel(
          headerWrapper,
          throttle(16, event => {
            const deltaX = event.deltaX;
            if (deltaX > 0) {
              this.bodyWrapper.scrollLeft += 10;
            } else {
              this.bodyWrapper.scrollLeft -= 10;
            }
          })
        );
      }

      if (this.fit) {
        this.windowResizeListener = throttle(50, () => {
          if (this.$ready) this.doLayout();
        });
        addResizeListener(this.$el, this.windowResizeListener);
      }
    },

    doLayout() {
      this.store.updateColumns();
      this.layout.update();
      this.updateScrollY();
      this.$nextTick(() => {
        if (this.height) {
          this.layout.setHeight(this.height);
        } else if (this.maxHeight) {
          this.layout.setMaxHeight(this.maxHeight);
        } else if (this.shouldUpdateHeight) {
          this.layout.updateHeight();
        }
      });
    },
    clear_scrollTop() {
      if (this.bodyWrapper) {
        this.bodyWrapper.scrollTop = 0;
      }
    },
    clear_scrollLeft() {
      if (this.bodyWrapper) {
        this.bodyWrapper.scrollLeft = 0;
      }
    }
  },

  created() {
    this.tableId = "el-table_" + tableIdSeed + "_";
    this.debouncedLayout = debounce(50, () => this.doLayout());
    this.$root.eventHub &&
      this.$root.eventHub.$on("clearOrder", () => {
        this.store.states.sortOrder = "";
      });
  },
  computed: {
    bodyWrapper() {
      return this.$refs.bodyWrapper;
    },
    fixedBodyWrapper() {
      return this.$refs.fixedBodyWrapper;
    },
    fixedOverFlow() {
      if (this.scrollFixed) {
        return {
          "overflow-y": "auto"
        };
      } else {
        return {
          "overflow-y": "hidden"
        };
      }
    },
    shouldUpdateHeight() {
      return (
        typeof this.height === "number" ||
        this.fixedColumns.length > 0 ||
        this.rightFixedColumns.length > 0
      );
    },

    selection() {
      return this.store.selection;
    },

    columns() {
      return this.store.states.columns;
    },

    tableData() {
      return this.store.states.data;
    },

    fixedColumns() {
      return this.store.states.fixedColumns;
    },

    rightFixedColumns() {
      return this.store.states.rightFixedColumns;
    },

    bodyHeight() {
      let style = {};

      if (this.height) {
        style = {
          height: this.layout.bodyHeight ? this.layout.bodyHeight + "px" : ""
        };
      } else if (this.maxHeight) {
        style = {
          "max-height":
            (this.showHeader
              ? this.maxHeight - this.layout.headerHeight
              : this.maxHeight) + "px"
        };
      }

      return style;
    },
    tableHeight() {
      let style = {};

      const height = this.layout.tableHeight
        ? Math.max(this.layout.tableHeight, this.maxHeight) + "px"
        : "";

      if (this.height) {
        style = {
          height
        };
      } else if (this.maxHeight) {
        style = {
          "max-height": height
        };
      }

      return style;
    },

    bodyWidth() {
      const { bodyWidth, scrollY, gutterWidth } = this.layout;
      return bodyWidth ? bodyWidth - (scrollY ? gutterWidth : 0) + "px" : "";
    },

    fixedBodyHeight() {
      let style = {};

      if (this.height) {
        style = {
          height: this.layout.fixedBodyHeight
            ? this.layout.fixedBodyHeight + "px"
            : ""
        };
      } else if (this.maxHeight) {
        let maxHeight = this.layout.scrollX
          ? this.maxHeight - this.layout.gutterWidth
          : this.maxHeight;

        if (this.showHeader) {
          maxHeight -= this.layout.headerHeight;
        }

        style = {
          "max-height": maxHeight + "px"
        };
      }

      return style;
    },

    fixedHeight() {
      let style = {};

      if (this.maxHeight) {
        style = {
          bottom:
            this.layout.scrollX && this.data.length
              ? this.layout.gutterWidth - 1 + "px"
              : ""
        };
      } else {
        style = {
          height: this.layout.viewportHeight
            ? this.layout.viewportHeight + "px"
            : ""
        };
      }

      return style;
    }
  },

  watch: {
    height(value) {
      this.layout.setHeight(value);
    },

    currentRowKey(newVal) {
      this.store.setCurrentRowKey(newVal);
    },

    data: {
      immediate: true,
      handler(val) {
        this.store.commit("setData", val);
      }
    },

    expandRowKeys(newVal) {
      this.store.setExpandRowKeys(newVal);
    },
    maxHeight(height) {
      this.layout.setMaxHeight(height);
    },
    clearScrollTop(obj) {
      if (this.bodyWrapper) {
        this.bodyWrapper.scrollTop = 0;
      }
    },
    clearScrollLeft(obj) {
      if (this.bodyWrapper) {
        this.bodyWrapper.scrollLeft = 0;
      }
    }
  },

  destroyed() {
    if (this.windowResizeListener)
      removeResizeListener(this.$el, this.windowResizeListener);
  },

  mounted() {
    this.bindEvents();
    this.doLayout();

    this.$ready = true;
    this.node_scroll = this.bodyWrapper;
  },

  data() {
    const store = new TableStore(this, {
      rowKey: this.rowKey,
      defaultExpandAll: this.defaultExpandAll
    });
    const layout = new TableLayout({
      store,
      table: this,
      fit: this.fit,
      showHeader: this.showHeader
    });
    return {
      store,
      layout,
      renderExpanded: null,
      resizeProxyVisible: false,
      timer: 0,
      node_scroll: null,
      node_timer: 0
    };
  }
};
</script>

<style lang="less">
@import "../../../less/common/variables.less";
.el-table,
.el-table td,
.el-table th {
  box-sizing: border-box;
  position: relative;
}

.el-table .el-tooltip.cell,
.el-table th,
.el-table th > div {
  white-space: nowrap;
}

.el-table th {
  cursor: default;
}

.el-table {
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  border-left: 1px solid @border-stroke1;
  border-top: 1px solid @border-stroke1;
  border-bottom: 1px solid @border-stroke1;
  font-size: 14px;
}

.el-table td,
.el-table th {
  height: 34px;
  min-width: 0;
  text-overflow: ellipsis;
  vertical-align: middle;
}

/*.el-table::after, .el-table::before {*/

/*content: '';*/

/*position: absolute;*/

/*background-color: @border-stroke1;*/

/*z-index: 1*/

/*}*/

.el-table td.is-right,
.el-table th.is-right {
  text-align: right;
}

.el-table td.is-left,
.el-table th.is-left {
  text-align: left;
}

.el-table td.is-center,
.el-table th.is-center {
  text-align: center;
}

.el-table td.gutter,
.el-table th.gutter {
  width: 15px;
  border-right-width: 0;
  border-bottom-width: 0;
  padding: 0;
}

.el-table .cell {
  box-sizing: border-box;
  text-overflow: ellipsis;
  padding-left: 18px;
  padding-right: 18px;
}

.el-table td.is-hidden > *,
.el-table th.is-hidden > * {
  visibility: hidden;
}

.el-table td.is-hidden {
  margin-left: -1px;
}

.el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
}

.el-table::after {
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
}

.el-table .caret-wrapper,
.el-table th > .cell {
  position: relative;
  vertical-align: middle;
  display: inline-block;
}

.el-table th {
  overflow: hidden;
  background-color: @table-rows-even;
  text-align: left;
}

.el-table th > div {
  display: inline-block;
  line-height: 34px;
  overflow: hidden;
}

.el-table td > div {
  box-sizing: border-box;
}

.el-table th.required > div::before {
  display: inline-block;
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff4d51;
  margin-right: 5px;
  vertical-align: middle;
}

.el-table th > .cell {
  word-wrap: normal;
  text-overflow: ellipsis;
  line-height: 20px;
  width: 100%;
  box-sizing: border-box;
}

.el-table th > .cell.highlight {
  color: #20a0ff;
}

.el-table .caret-wrapper {
  cursor: pointer;
  margin-left: 5px;
  margin-top: -2px;
  width: 16px;
  height: 34px;
  overflow: visible;
  overflow: initial;
}

.el-table .cell,
.el-table__header-wrapper {
  overflow: hidden;
}

.el-table__header-wrapper .cell {
  cursor: default;
}

.el-table .sort-caret {
  display: inline-block;
  width: 0;
  height: 0;
  border: 0;
  content: "";
  position: absolute;
  left: 3px;
  z-index: 2;
}

.el-table .sort-caret.ascending,
.el-table .sort-caret.descending {
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
}

.el-table .sort-caret.ascending {
  top: 11px;
  border-top: none;
  border-bottom: 5px solid #7F8FA4;
}

.el-table .sort-caret.descending {
  bottom: 11px;
  border-top: 5px solid #7F8FA4;
  border-bottom: none;
}

.el-table .ascending .sort-caret.ascending {
  border-bottom-color: #EE9B38;
}

.el-table .descending .sort-caret.descending {
  border-top-color: #EE9B38;
}

.el-table td.gutter {
  width: 0;
}

.el-table .cell {
  word-break: break-all;
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-table tr input[type="checkbox"] {
  margin: 0;
}

.el-table tr {
  background-color: #fff;
}

.el-table .hidden-columns {
  visibility: hidden;
  position: absolute;
  z-index: -1;
}

.el-table__empty-block {
  position: relative;
  min-height: 60px;
  text-align: center;
  width: 100%;
  height: 100%;
}

.el-table__empty-text {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  color: #5e7382;
}

.el-table__expand-column .cell {
  padding: 0;
  text-align: center;
}

.el-table__expand-icon {
  position: relative;
  cursor: pointer;
  color: #666;
  font-size: 12px; // -webkit-transition: -webkit-transform .2s ease-in-out;
  // transition: -webkit-transform .2s ease-in-out;
  // transition: transform .2s ease-in-out;
  // transition: transform .2s ease-in-out, -webkit-transform .2s ease-in-out;
  height: 34px;
}

.el-table__fixed-header-wrapper thead div,
.el-table__header-wrapper thead div {
  color: #7f8fa4;
  font-weight: normal; // background-color: #eef1f6
}

.el-table__expand-icon > .el-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -5px;
  margin-top: -5px;
}

.el-table__expand-icon--expanded {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}

.el-table__expanded-cell {
  padding: 20px 50px;
  background-color: #fbfdff; // box-shadow: inset 0 2px 0 @border-stroke1
}

.el-table__expanded-cell:hover {
  background-color: #fbfdff !important;
}

.el-table--fit {
  border-right: 0;
  /*border-bottom: 0;*/
}

.el-table--border th,
.el-table__fixed-right-patch {
  border-bottom: 1px solid @border-stroke1;
}

.el-table--fit td.gutter,
.el-table--fit th.gutter {
  border-right-width: 1px;
}

.el-table--border td,
.el-table--border th {
  border-right: 1px solid @border-stroke2;
  border-left: 1px solid @border-stroke2;
}

.el-table--border th:first-of-type {
  border-left: none;
}

.el-table__fixed,
.el-table__fixed-right {
  position: absolute;
  top: 0;
  left: 0; // box-shadow: 1px -4px 8px @border-stroke1;
  overflow-x: hidden;
}

.el-table__fixed {
  // border-right: 1px solid @border-stroke1;
  box-sizing: border-box;
}

.el-table__fixed-right::before,
.el-table__fixed::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background-color: transparent;
  z-index: 4;
}

.el-table__fixed-right-patch {
  position: absolute;
  top: -1px;
  right: 0;
  background-color: #eef1f6;
}

.el-table__fixed-right {
  top: 0;
  left: auto;
  right: 0; // box-shadow: -1px 0 8px @border-stroke1
}

.el-table__fixed-right .el-table__fixed-body-wrapper,
.el-table__fixed-right .el-table__fixed-header-wrapper {
  left: auto;
  right: 0;
}

.el-table__fixed-header-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 3;
}

.el-table__fixed-body-wrapper {
  position: absolute;
  left: 0;
  top: 37px;
  overflow: hidden;
  z-index: 3;
}

.el-table__body-wrapper,
.el-table__header-wrapper {
  width: 100%;
}

.el-table__body,
.el-table__header {
  border-collapse: collapse;
}

.el-table__body-wrapper {
  overflow: auto;
  position: relative;
}

.el-table--striped .el-table__body tr {
  td:first-of-type {
    border-left: none;
  }
  &:first-of-type {
    border-top: none;
  }
  border-bottom: 1px solid #263140;
}

// .el-table--striped .el-table__body tr:nth-child(even) {
//     background: @table-rows-even
// }
.el-table--striped .el-table__body tr {
  background: #19202a;
}

.el-table--striped .el-table__body tr:nth-child(even).current-row {
  background-color: @bg-chosen1;
  border-style: double;
  border-width: 1px;
  border-color: @border-stroke;
  border-left: none !important;
  border-right: none !important;
}

// .el-table--striped .el-table__body tr:nth-child(odd) {
//     background: @table-rows-odd
// }
.el-table--striped .el-table__body tr:nth-child(odd).current-row {
  background-color: @bg-chosen1;
  border-style: double;
  border-width: 1px;
  border-color: @border-stroke;
  border-left: none !important;
  border-right: none !important;
}

.el-table--enable-row-hover .el-table__body tr:hover,
.el-table .el-table__body tr.hover-row {
  background-color: @bg-chosen1;
  cursor: default;
}

.el-table--enable-row-hover {
  border-collapse: collapse;
}

.el-table--enable-row-hover .el-table__body {
  border-collapse: collapse;
}

.el-table__column-resize-proxy {
  position: absolute;
  left: 200px;
  top: 0;
  bottom: 0;
  width: 0;
  border-left: 1px solid @border-stroke1;
  z-index: 10;
}

.el-table__column-filter-trigger {
  display: inline-block;
  line-height: 34px;
  margin-left: 5px;
  cursor: pointer;
}

.el-table__column-filter-trigger i {
  color: #97a8be;
}

// .el-table--enable-row-transition .el-table__body td {
//     -webkit-transition: background-color .25s ease;
//     transition: background-color .25s ease
// }
.el-table--fluid-height .el-table__fixed,
.el-table--fluid-height .el-table__fixed-right {
  bottom: 0;
  overflow: hidden;
}

.asc:after {
  background: url("../../../assets/draggerDownHover.png");
}

.desc:after {
  background: url("../../../assets/downTabHover.png");
}

.pointer {
  display: inline-block;
  cursor: pointer;
}

.asc,
.desc {
  position: relative;
  padding-right: 10px;
}

.asc:after,
.desc:after {
  position: absolute;
  width: 9px;
  height: 5px;
  content: "";
  right: -18px;
  top: 8px;
}

.visited {
  color: @color-gray3 !important;
}

.asc,
.desc {
  position: relative;
}

.asc:after,
.desc:after {
  position: absolute;
  width: 9px;
  height: 5px;
  content: "";
  right: 0;
  top: 7px;
}

.asc:after {
  background: @sort-down;
}

.desc:after {
  background: @sort-up;
}

.ico-pdf,
.ico-doc,
.ico-excel,
.ico-text,
.ico-rar,
.ico-other {
  width: 12px;
  height: 12px;
  cursor: pointer;
  position: absolute;
  left: e("calc(50% - 6px)");
  top: e("calc(50% - 6px)");
}

.ico-pdf {
  background: url("../../../assets/rc-pdf.png");
}

.ico-excel {
  background: url("../../../assets/rc-excel.png");
}

.ico-doc {
  background: url("../../../assets/rc-word.png");
}

.ico-rar {
  background: url("../../../assets/compress12X12.png");
}

.ico-other {
  background: url("../../../assets/elseFile12x12.png");
}

.ico-text {
  background: url("../../../assets/TXT12x12.png");
}

.hand {
  cursor: pointer;
  &:hover {
    color: @color-blue;
  }
}

.recommend {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: url("../../../assets/rc-tuijian.png");
}

.ico-minute {
  .hand;
  display: inline-block;
  width: 16px;
  height: 25px;
  background: url("../../../assets/rc-minute.png") center 9px no-repeat;
}

.ico-minute:hover {
  background-image: url("../../../assets/rc-minute-hover.png");
}

.author {
  display: inline-block;
  margin-right: 5px;
}

.author:hover {
  color: @color-blue;
}

.industry:hover {
  color: @color-blue;
}

.core {
  display: inline-block;
  width: 14px;
  height: 24px;
  background: url("../../../assets/star.png") no-repeat left 3px;
  vertical-align: middle;
}

.el-table__fixed-body-wrapper td {
  border-right: none !important;
}

.el-table__fixed-body-wrapper .is-hidden {
  border-right: 1px solid @border-stroke2;
  border-left: none;
}

.el-table__fixed-header-wrapper th {
  border-right: none !important;
}

.el-table__fixed-header-wrapper .is-hidden {
  border-right: 1px solid @border-stroke2 !important;
  border-left: none !important;
}

// --- table style hack (only safari browser)
// --- add by wangjs
// .el-table thead th[rowspan] {
//     position: relative;
//     overflow: visible;
// }

// .el-table thead th[rowspan]:before {
//     position: absolute;
//     content: "";
//     top: 0;
//     right: -1px;
//     margin-left: -1px;
//     background-color: @border-stroke1;
//     width: 1px;
//     height: 100%;
// }

// --- hack end ---

// add chenjun

.el-table th {
  background-color: #232d3c;
  height: 38px;
}
</style>
