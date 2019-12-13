/* eslint-disable no-unused-expressions */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'

Vue.config.productionTip = false
// 配置axios的基础路径，最后会请求到spring boot的控制器
axios.defaults.baseURL = 'http://localhost:8082/or/'
// 将axios挂载到全局组件库中
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
