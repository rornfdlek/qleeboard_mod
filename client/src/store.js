import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    userEmail: '',
    userNickname: '',
    mod: 3
  },
  getters: {
    getIsLogin: function (state) {
      return state.isLogin
    },
    getUserEmail (state) {
      return state.userEmail
    },
    getMod (state) {
      return state.mod
    },
    getUserNickname (state) {
      return state.userNickname
    }
  },
  mutations: {
    Login: function (state, payload) {
      state.isLogin = true
      state.userEmail = payload.userEmail
      state.userNickname = payload.userNickname
      state.mod = payload.mod
    },
    delUser (state) {
      state.isLogin = false
      state.userEmail = ''
      state.mod = 3
    }
  },
  actions: {

  }
})
