import Vue from 'vue';
import App from './App.vue';
import router from "./router"
import local from "./store/local"
import axios from "axios"

import swal from 'sweetalert';
window.axios = axios
window.swal = swal
Vue.prototype.$axios = axios
Vue.config.productionTip = false;


async function start() {
  new Vue({
    router,
    render: h => h(App)
  }).$mount("#app")
}
start()
