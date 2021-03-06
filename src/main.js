import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'
import Popover  from 'vue-js-popover'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


Vue.use(Chartkick.use(Chart))
Vue.use(VueSweetalert2);
Vue.use(BootstrapVue)
Vue.use(Popover)


Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

// Agregamos la URL base de nuestra API
axios.defaults.baseURL = 'http://localhost:3000/api';
