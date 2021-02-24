import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import elementUI from './plugins/element-ui'
import axios from 'axios'

Vue.prototype.$http = axios.create({
  baseURL: process.env.VUE_APP_API
})

Vue.config.productionTip = false

Vue.use(elementUI)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
