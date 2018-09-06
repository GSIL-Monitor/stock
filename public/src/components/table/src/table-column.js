import checkBox from '../../CheckBox.vue';
// import ElTag from '../../tag';
import objectAssign from '../../utils/merge';
import { getValueByPath } from './util';

let columnIdSeed = 1;

const defaults = {
  default: {
    order: ''
  },
  selection: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: '',
    className: 'el-table-column--selection'
  },
  expand: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: ''
  },
  index: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: ''
  }
};
const forced = {
  selection: {
    renderHeader: function(h,{ store }) {
      return <span on-click={()=>{store.commit('checkAll');}}>
                  <checkBox check={ store.states.selection.length==store.states.data.length && store.states.data.length>0 }>
                  </checkBox>
             </span>;
    },

      renderCell: function(h, { row, column, store, $index }) {
          return    <span on-click={()=>{store.commit('toggleSingle',row)}}>
                        <checkBox check={ store.isSelected(row) }></checkBox>
                    </span>
      },
    sortable: false,
    resizable: false
  },
  index: {
    renderHeader: function(h, { column }) {
      return column.label || '#';
    },
    renderCell: function(h, { $index }) {
      return <div>{ $index + 1 }</div>;
    },
    sortable: false
  },
  expand: {
    renderHeader: function(h, {}) {
      return '';
    },
    renderCell: function(h, { row, store }, proxy) {
      const expanded = store.states.expandRows.indexOf(row) > -1;
      return <div class={ 'el-table__expand-icon ' + (expanded ? 'el-table__expand-icon--expanded' : '') }
                  on-click={ () => proxy.handleExpandClick(row) }>
        <i class='el-icon el-icon-arrow-right'></i>
      </div>;
    },
    sortable: false,
    resizable: false,
    className: 'el-table__expand-column'
  },
    sortable:{
        renderHeader: function(h, {column , store}) {
            return <div on-click={()=>{store.commit('sort',column.property);}} class={'pointer '+((store.states.label==column.property)?store.states.sortOrder:'')}>{column.label}</div>;
        },
        renderCell: function(h, { row, column, store, $index }) {
            return <div>{ row[column.property] }</div>;
        },
    },
    reportTitle:{
        renderHeader: function(h, {column , store}) {
            return <div on-click={()=>{store.commit('sort',column.property);}} class={'pointer '+((store.states.label==column.property)?store.states.sortOrder:'')} style={'paddingLeft:10px'}>{column.label}</div>;
        },
        renderCell: function(h, { row, column, store, $index }) {
            return <div style={'paddingLeft:10px;paddingRight:10px;textOverflow:ellipsis;overflow:hidden;whiteSpace:nowrap'}><span on-click={()=>{store.commit('clickTitle',row,$index+1)}} class={row.has_read?'visited hand':'hand'} >{row[column.property]}</span></div>;
        },
    },
    origin:{
        renderHeader: function(h, { column }) {
            return column.label || '#';
        },
        renderCell:function(h,{row, column, store, $index}){
            if(!row.guid || !(row.format||row.file_type)){
                return <span class="no-original">--</span>
            }
            var fileType = row.format||row.file_type,file_type;
            if(fileType.toLowerCase()=='pdf'){
                file_type = 'ico-pdf';
            }else{
                if(fileType.toLowerCase()=='doc' || fileType.toLowerCase()=='docx'){
                    file_type = 'ico-doc';
                }else if(fileType.toLowerCase()=='xlsx' || fileType.toLowerCase() =='xls'){
                    file_type = 'ico-excel';//'xls';
                }else if(fileType.toLowerCase()=='rar' || fileType.toLowerCase() =='zip'){
                    file_type = 'ico-rar';
                }else if(fileType.toLowerCase() == 'text' || fileType.toLowerCase() == 'txt'){
                    file_type = 'ico-text';
                }else{
                    file_type = 'ico-other';
                }
            }
            // return <span on-click={()=>{store.commit('readOriginal',row.title||row.report_title,row.guid,fileType.toLowerCase())}} title="点击阅读原文" class={file_type}></span>
            return <span on-click={()=>{store.commit('readOriginal',row)}} title="点击阅读原文" class={file_type}></span>
        }
    },
    fallRise:{
        renderHeader: function(h, { column,store }) {
            return <div on-click={()=>{store.commit('sort',column.property);}} class={'pointer '+((store.states.label==column.property)?store.states.sortOrder:'')}>{column.label}</div>;
        },
        renderCell: function(h, { row, column, store, $index }) {
            let fallRise='',colorClass='';
            if(row[column.property]==1){
                fallRise = '→';
            }else if(row[column.property]==2){
                fallRise = '↑';
                colorClass = 'red';
            }else if(row[column.property]==3){
                fallRise = '↓';
                colorClass = 'green';
            }else{
                fallRise = '--';
            }
            return <div class={colorClass}>{fallRise}</div>;
        },
    },
    price:{
        renderHeader: function(h, { column }) {
            return column.label || '#';
        },
        renderCell: function(h, { row, column, store, $index }) {
            let value=row[column.property],colorClass;
            if(!value && value !== 0){
                return <div>--</div>;
            }
            if(!Number(value)){
                return <div>{value}</div>;
            }
            colorClass = row.change_value > 0?'red':row.change_value < 0?'green':'';
            value = value?value.toFixed(2):'';
            return <div class={colorClass}>{value}</div>;
        },
    },
    changeRate:{
        renderHeader: function(h, { column }) {
            return column.label || '#';
        },
        renderCell: function(h, { row, column, store, $index }) {
            let value=row[column.property],colorClass='';
            if((!value && value !== 0) || !Number(value)){
                return <div>--</div>;
            }

            if(value > 0){
                colorClass = 'red';
                value = `+${value.toFixed(2)}%`;
            }else if(value < 0){
                colorClass = 'green';
                value = `${value.toFixed(2)}%`;
            }else{
                colorClass = '';
                value = '0.00%';
            }
            return <div class={colorClass}>{value}</div>;
        },
    },
    changeValue:{
        renderHeader: function(h, { column }) {
            return column.label || '#';
        },
        renderCell: function(h, { row, column, store, $index }) {
            let value =row[column.property],colorClass='';
            if((!value && value !== 0) || !Number(value)){
                return <div>--</div>;
            }
            if(value > 0){
                colorClass = 'red';
                value = `+${value.toFixed(2)}`;
            }else if(value < 0){
                colorClass = 'green';
                value = value.toFixed(2);
            }else{
                colorClass = '';
                value = '0.00';
            }
            return <div class={colorClass}>{value}</div>;
        },
    },
    fixedValue:{
        renderHeader: function(h, { column }) {
            return column.label || '#';
        },
        renderCell: function(h, { row, column, store, $index }) {
            let value =row[column.property];
            if((!value && value !== 0) || !Number(value)){
                return <div>--</div>;
            }
            value = value.toFixed(2);
            return <div>{value}</div>;
        },
    },
    fixedRate:{
        renderHeader: function(h, { column }) {
            return column.label || '#';
        },
        renderCell: function(h, { row, column, store, $index }) {
            let value =row[column.property];
            if((!value && value !== 0) || !Number(value)){
                return <div>--</div>;
            }
            value = value.toFixed(2);
            return <div>{value}%</div>;
        },
    },
    roundValue:{
        renderHeader: function(h, { column }) {
            return column.label || '#';
        },
        renderCell: function(h, { row, column, store, $index }) {
            let value =row[column.property];
            if((!value && value !== 0) || !Number(value)){
                return <div>--</div>;
            }
            value = Math.round(value);
            return <div>{value}</div>;
        },
    }
};

const getDefaultColumn = function(type, options) {
  const column = {};

  objectAssign(column, defaults[type || 'default']);

  for (let name in options) {
    if (options.hasOwnProperty(name)) {
      const value = options[name];
      if (typeof value !== 'undefined') {
        column[name] = value;
      }
    }
  }

  if (!column.minWidth) {
    column.minWidth = 80;
  }

  column.realWidth = column.width || column.minWidth;

  return column;
};

const DEFAULT_RENDER_CELL = function(h, { row, column }) {
    // console.log(56, row, column);

  const property = column.property;
  if (column && column.formatter) {
    return column.formatter(row, column);
  }

  if (property && property.indexOf('.') === -1) {
    //   console.log(property, property.indexOf('.'), row[property]);

    return row[property] || '--';
  }

  return getValueByPath(row, property);
};

export default {
  name: 'ElTableColumn',

  props: {
    type: {
      type: String,
      default: 'default'
    },
    label: String,
    className: String,
    labelClassName: String,
    property: String,
    prop: String,
    width: {},
    minWidth: {},
    renderHeader: Function,
    sortable: {
      type: [String, Boolean],
      default: false
    },
    sortMethod: Function,
    resizable: {
      type: Boolean,
      default: true
    },
    context: {},
    columnKey: String,
    align: String,
    headerAlign: String,
    showTooltipWhenOverflow: Boolean,
    showOverflowTooltip: Boolean,
    fixed: [Boolean, String],
    formatter: Function,
    selectable: Function,
    reserveSelection: Boolean,
    filterMethod: Function,
    filteredValue: Array,
    filters: Array,
    filterMultiple: {
      type: Boolean,
      default: true
    },
    notitle: {
        type: Boolean,
        default: false
    }
  },

  data() {
    return {
      isSubColumn: false,
      columns: []
    };
  },

  beforeCreate() {
    this.row = {};
    this.column = {};
    this.$index = 0;
  },

  components: {
      checkBox,
    // ElTag
  },

  computed: {
    owner() {
      let parent = this.$parent;
      while (parent && !parent.tableId) {
        parent = parent.$parent;
      }
      return parent;
    }
  },

  created() {
    this.customRender = this.$options.render;
    this.$options.render = h => h('div', this.$slots.default);
    this.columnId = (this.$parent.tableId || (this.$parent.columnId + '_')) + 'column_' + columnIdSeed++;

    let parent = this.$parent;
    let owner = this.owner;
    this.isSubColumn = owner !== parent;

    let type = this.type;

    let width = this.width;
    if (width !== undefined) {
      width = parseInt(width, 10);
      if (isNaN(width)) {
        width = null;
      }
    }

    let minWidth = this.minWidth;
    if (minWidth !== undefined) {
      minWidth = parseInt(minWidth, 10);
      if (isNaN(minWidth)) {
        minWidth = 80;
      }
    }

    let isColumnGroup = false;
    let column = getDefaultColumn(type, {
      id: this.columnId,
      columnKey: this.columnKey,
      label: this.label,
      className: this.className,
      labelClassName: this.labelClassName,
      property: this.prop || this.property,
      type,
      renderCell: null,
      renderHeader: this.renderHeader,
      minWidth,
      width,
      isColumnGroup,
      context: this.context,
      align: this.align ? 'is-' + this.align : null,
      headerAlign: this.headerAlign ? 'is-' + this.headerAlign : (this.align ? 'is-' + this.align : null),
      sortable: this.sortable === '' ? true : this.sortable,
      sortMethod: this.sortMethod,
      resizable: this.resizable,
      showOverflowTooltip: this.showOverflowTooltip || this.showTooltipWhenOverflow,
      formatter: this.formatter,
      selectable: this.selectable,
      reserveSelection: this.reserveSelection,
      fixed: this.fixed === '' ? true : this.fixed,
      filterMethod: this.filterMethod,
      filters: this.filters,
      filterable: this.filters || this.filterMethod,
      filterMultiple: this.filterMultiple,
      filterOpened: false,
      filteredValue: this.filteredValue || [],
      notitle: this.notitle
    });

    objectAssign(column, forced[type] || {});

    this.columnConfig = column;

    let renderCell = column.renderCell;
    let _self = this;

    if (type === 'expand') {
      owner.renderExpanded = function(h, data) {
        return _self.$scopedSlots.default
          ? _self.$scopedSlots.default(data)
          : _self.$slots.default;
      };

      column.renderCell = function(h, data) {
        return <div class="cell">{ renderCell(h, data, this._renderProxy) }</div>;
      };

      return;
    }

    column.renderCell = function(h, data) {
      // 未来版本移除
      if (_self.$vnode.data.inlineTemplate) {
        renderCell = function() {
          data._self = _self.context || data._self;
          if (Object.prototype.toString.call(data._self) === '[object Object]') {
            for (let prop in data._self) {
              if (!data.hasOwnProperty(prop)) {
                data[prop] = data._self[prop];
              }
            }
          }
          // 静态内容会缓存到 _staticTrees 内，不改的话获取的静态数据就不是内部 context
          data._staticTrees = _self._staticTrees;
          data.$options.staticRenderFns = _self.$options.staticRenderFns;
          return _self.customRender.call(data);
        };
      } else if (_self.$scopedSlots.default) {
        renderCell = () => _self.$scopedSlots.default(data);
      }

      if (!renderCell) {
        renderCell = DEFAULT_RENDER_CELL;
      }

      let cellTitle = ''
        if(!data.column.notitle && data.column){
            cellTitle = data.row[data.column.property] || ''
        }
      return _self.showOverflowTooltip || _self.showTooltipWhenOverflow
        ? <el-tooltip
            effect={ this.effect }
            placement="top"
            disabled={ this.tooltipDisabled }>
            <div class="cell">{ renderCell(h, data) }</div>
            <span slot="content">{ renderCell(h, data) }</span>
          </el-tooltip>
        : <div class="cell" title={cellTitle} style={(data.column.realWidth || data.column.width) ? 'width:'+((data.column.realWidth || data.column.width) -1) + 'px' : ''}>{ renderCell(h, data) }</div>;
    };
  },

  destroyed() {
    if (!this.$parent) return;
    this.owner.store.commit('removeColumn', this.columnConfig);
  },
  watch: {
    label(newVal) {
      if (this.columnConfig) {
        this.columnConfig.label = newVal;
      }
    },

    prop(newVal) {
      if (this.columnConfig) {
        this.columnConfig.property = newVal;
      }
    },

    property(newVal) {
      if (this.columnConfig) {
        this.columnConfig.property = newVal;
      }
    },

    filters(newVal) {
      if (this.columnConfig) {
        this.columnConfig.filters = newVal;
      }
    },

    filterMultiple(newVal) {
      if (this.columnConfig) {
        this.columnConfig.filterMultiple = newVal;
      }
    },

    align(newVal) {
      if (this.columnConfig) {
        this.columnConfig.align = newVal ? 'is-' + newVal : null;

        if (!this.headerAlign) {
          this.columnConfig.headerAlign = newVal ? 'is-' + newVal : null;
        }
      }
    },

    headerAlign(newVal) {
      if (this.columnConfig) {
        this.columnConfig.headerAlign = 'is-' + (newVal ? newVal : this.align);
      }
    },

    width(newVal) {
      if (this.columnConfig) {
        this.columnConfig.width = newVal;
        this.owner.store.scheduleLayout();
      }
    },

    minWidth(newVal) {
      if (this.columnConfig) {
        this.columnConfig.minWidth = newVal;
        this.owner.store.scheduleLayout();
      }
    },

    fixed(newVal) {
      if (this.columnConfig) {
        this.columnConfig.fixed = newVal;
        this.owner.store.scheduleLayout();
      }
    }
  },

  mounted() {
    const owner = this.owner;
    const parent = this.$parent;
    let columnIndex;

    if (!this.isSubColumn) {
      columnIndex = [].indexOf.call(parent.$refs.hiddenColumns.children, this.$el);
    } else {
      columnIndex = [].indexOf.call(parent.$el.children, this.$el);
    }

    owner.store.commit('insertColumn', this.columnConfig, columnIndex, this.isSubColumn ? parent.columnConfig : null);
  }
};
