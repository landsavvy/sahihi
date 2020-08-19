import Vue from "vue"
import Router from "vue-router"


import Keygen from "./views/Keygen.vue"
import Home from "./views/Home.vue"



Vue.use(Router)

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/keygen",
      name: "keygen",
      component: Keygen
    }
  ]
})
