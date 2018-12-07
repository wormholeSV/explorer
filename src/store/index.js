/**
** @Description: Author Message
** @author huyangyang
** @date 2018/11/3
**/

import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeRoute: ''
  },
  mutations: {
    changeActiveRoute (state, params) {
      state.activeRoute = params
    }
  }
})
