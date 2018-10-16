import Vue from 'vue'
import Vuex from 'vuex'

import App from './pages/login/'
// import crossStorage from './lib/crossStore'
import goGoal from './goGoal/index'

Vue.use(Vuex)

// window.crossStorage = crossStorage
window.goGoal = goGoal

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
});
