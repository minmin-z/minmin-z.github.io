import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

import tagsView from './modules/tagsView'
import permission from './modules/permission'
import flag from './modules/flag'
//刷新页面的一瞬间，vuex数据消失，vuex回去sessionStorage中拿回数据，变相的实现了数据刷新不丢失
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    flag,
    tagsView,
    permission
  },
  getters,
  plugins: [createPersistedState({
      storage: window.sessionStorage
  })]
})

export default store
