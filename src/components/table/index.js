import sunTableColumn from './src/table-column';
import sunTable from './src/table';

/* istanbul ignore next */
export default function(Vue) {
  Vue.component(sunTable.name, sunTable);
  Vue.component(sunTableColumn.name, sunTableColumn);
};

export { sunTable, sunTableColumn };
