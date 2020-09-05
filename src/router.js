import Vue from "vue"
import Router from "vue-router"


import Keygen from "./views/Keygen.vue"
import Home from "./views/Home.vue"
import ChangeWitness from './views/ChangeWitness'
import ChangeKey from './views/ChangeKey'
import TitleTransfer from './views/TitleTransfer'
import TitleSubdivision from './views/TitleSubdivision'


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
    },
    {
      path: "/changeWitness",
      name: "changeWitness",
      component: ChangeWitness
    },
    {
      path: "/changeKey",
      name: "changeKey",
      component: ChangeKey
    },
    {
      path: "/titleSubdivision",
      name: "titleSubdivision",
      component: TitleSubdivision
    },
    {
      path: "/titleTransfer",
      name: "titleTransfer",
      component: TitleTransfer
    }
  ]
})
