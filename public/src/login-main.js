import Vue from 'vue'

import App from './pages/login/index.vue'

import crossStorage from '../lib/crossStore.js';
import goGoal from './goGoal';
import Echarts from 'vue-echarts/components/ECharts';
//import ECharts modules manually to reduce bundle size
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';

Vue.component('chart', Echarts);

window.crossStorage = crossStorage;
window.goGoal = goGoal;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
});
