import { login, logout, getInfo } from '@/api/system/login'


const getDefaultState = () => {
  return {
    name: '',
  }
}

const state = getDefaultState()

const mutations = {
  SET_NAME: (state, name) => {
    state.name = name
  },
  USER_INFO:(state, info) => {
    state.userInfo = info
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    var form = {}
    form.userId = btoa(username)
    form.pwd = btoa(password)
    return new Promise((resolve, reject) => {
      login(form).then(response => {
        const { data } = response

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          return reject('无用户信息')
        }
        const { userName } = data
        commit('SET_NAME', userName)
        commit('USER_INFO',data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        sessionStorage.clear()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

