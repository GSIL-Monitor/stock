import Vue from 'vue'
import Vuex from 'vuex'
// import VueRouter from 'vue-router'
import infiniteScroll from 'vue-infinite-scroll'

import App from './pages/stock-detail/'
import stores from './store/stock-detail-store/'
// import routes from './router/stock-detail-router/'
import eventBus from './plugins/eventBus/'
import goGoal from './goGoal/'

import Echarts from 'vue-echarts/components/ECharts'

import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'

Vue.component('chart', Echarts)

Vue.use(Vuex)
Vue.use(infiniteScroll)
Vue.use(eventBus)

// handle error
Vue.config.errorHandler = function (err, vm, info) {
    console.log("@ ", err)
    console.log("@@ ", vm)
    console.log("@@@ ", info)
}

// Vue.use(VueRouter)

// const router = new VueRouter({
//     routes,
//     mode: 'hash',
//     // strict: process.env.NODE_ENV !== 'production',
// })

window.goGoal = goGoal
goGoal.sockets = []

const store = new Vuex.Store(stores)

new Vue({
    store,
    template: '<App/>',
    components: {
        App,
    },
    // router,
}).$mount('#app')
