import Vue from 'vue'
import infiniteScroll from 'vue-infinite-scroll'
import Echarts from 'vue-echarts/components/ECharts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'

import store from './store/stock-detail-store/'
// import router from './router/stock-detail-router/'
import App from './pages/stock-detail/'
import goGoal from './goGoal/'
import eventBus from './plugins/eventBus/'

import '@less/common/theme.less'

Vue.component('chart', Echarts)
Vue.use(infiniteScroll)
Vue.use(eventBus)

// handle error
Vue.config.errorHandler = function (err, vm, info) {
    console.log("@ ", err)
    console.log("@@ ", vm)
    console.log("@@@ ", info)
}

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
