import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './registerServiceWorker'

axios.defaults.headers.common['x-access-qlee-token'] = localStorage.getItem('QLee_token') ? localStorage.getItem('QLee_token') : ''

// Vue axios
Vue.prototype.$http = axios

Vue.config.productionTip = false

const vueInit = () => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

// 로그인 먼저 처리
if (localStorage.getItem('QLee_token')) {
  axios.post('/api/sign/jwt')
    .then((result) => {
      const userData = {
        userEmail: result.data.email_address,
        userNickname: result.data.user_nickname,
        userSrl: result.data.user_srl,
        mod: result.data.mod
      }
      store.commit('Login', userData)
      vueInit()
    })
    .catch(() => {
      localStorage.removeItem('QLee_token')
      vueInit()
    })
} else {
  vueInit()
}
