import Vue from 'vue'
import infiniteScroll from 'vue-infinite-scroll'
import Echarts from 'vue-echarts/components/ECharts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'

import store from './store/stock-detail-store/index.js'
// import router from './router/stock-detail-router/'
import App from './pages/stock-detail/index.js'
import goGoal from './goGoal/index.js'
import eventBus from './plugins/eventBus/index.js'

import '@less/common/theme.less'
import '@less/stockDetail.less'

Vue.component('chart', Echarts)
Vue.use(infiniteScroll)
Vue.use(eventBus)

window.goGoal = goGoal
goGoal.sockets = []

new Vue({
    store,
    template: '<App/>',
    components: {
        App,
    },
    // router,
}).$mount('#app')
