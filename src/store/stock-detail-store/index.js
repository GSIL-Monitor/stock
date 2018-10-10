import Vue from 'vue'
import Vuex from 'vuex'

import state from './rootState.js'
import getters from './rootGetters.js'
import mutations from './rootMutations.js'
import actions from './rootActions.js'
import plugins from './plugins.js'
import modules from './modules.js'


Vue.use(Vuex)

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    plugins,
    modules,
})
