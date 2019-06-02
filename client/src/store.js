import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    userEmail: '',
    userNickname: '',
    userSrl: -1,
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
    },
    getUserSrl (state) {
      return state.userSrl
    }
  },
  mutations: {
    Login: function (state, payload) {
      state.isLogin = true
      state.userEmail = payload.userEmail
      state.userNickname = payload.userNickname
      state.userSrl = payload.userSrl
      state.mod = payload.mod
    },
    delUser (state) {
      state.isLogin = false
      state.userEmail = ''
      state.userNickname = ''
      state.userSrl = -1
      state.mod = 3
    }
  },
  actions: {

  }
})
