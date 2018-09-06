// import sunTableColumn from './src/table-column';
import datePicker from './src/datePicker';
import dateRange from './src/dateRange'

/* istanbul ignore next */
export default function(Vue) {
//   Vue.component(sunTable.name, sunTable);
  Vue.component(datePicker.name, datePicker);
  Vue.component(dateRange.name, dateRange);
};

// export { sunTable, sunTableColumn };
export { datePicker, dateRange };
