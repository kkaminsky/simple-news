import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import Axios from "axios"
import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)

Vue.config.productionTip = false

Vue.prototype.$http = Axios

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
