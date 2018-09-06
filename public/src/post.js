import Vue from 'vue';
import VueResource from 'vue-resource';
import InfiniteScroll from 'vue-infinite-scroll';

// import App from './pages/private/zyPost.vue';
import App from './pages/private/post.vue';
import dataService from './dataService';
import goGoal from './goGoal';
import callQt from '@c/utils/callQt.js';
import util from '@c/utils/util.js';

Vue.use(VueResource);
Vue.use(InfiniteScroll);

window.goGoal = goGoal;
window.qtobj = callQt;
Vue.prototype.dataService = dataService;
Vue.prototype.util = util;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
})