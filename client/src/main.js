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

if (localStorage.getItem('QLee_token')) {
  axios.get('/api/sign/jwt')
    .then((result) => {
      const userData = {
        userEmail: result.data.email_address,
        userNickname: result.data.user_nickname,
        mod: result.data.is_admin ? 1 : 2
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
