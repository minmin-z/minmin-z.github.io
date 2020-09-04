//内外网标识


const state = {
  io:"",   //内外网
  loginFlag:false   //登录状态
}

const mutations = {
  IO: (state, io) => {
    state.io = io
  },
  LOGIN_FLAG:(state, loginFlag) => {
    state.loginFlag = loginFlag
  },
}

const actions = {
  getIO({ commit }, data) {
    var io = data
    commit('IO', io)
  },
  getFlag({ commit }, data) {
    var flag = data
    commit('LOGIN_FLAG', flag)
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
