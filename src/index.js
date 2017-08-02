// /----------- Extern
import './extern.js'

// /----------- Base
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { BS, Util, _ } from 'dove.max.sdk'

// /----------- Components
import App from './App.vue'
import KeenUI from 'keen-ui'
import Routes from './routes'
import http from 'vue-resource'
import VueAwesomeSwiper from 'vue-awesome-swiper'

import { languageConfiguration } from './extern.js'

// Allow inspection, even in production mode
Vue.config.devtools = true

// Use VueI18n
Vue.use(VueI18n, {})

window.Vue = Vue
window.VueI8n = VueI18n

const $ = Util.util.getJQuery$()

const languageList = BS.b$.App.getCompatibleWebkitLanguageList()
const localLanguagePackList = ['en-US','zh-CN']
const lang = _.intersection(languageList,localLanguagePackList).toString()

////
Vue.use(http)
Vue.http.options.emulateJSON = true

function startApp (i18nObj) {
  // Use KeenUI
  Vue.use(KeenUI)

  // Use VueAwesomeSwiper
  Vue.use(VueAwesomeSwiper)

  // Use router
  Vue.use(VueRouter)
  const router = new VueRouter({
    routes: Routes.routes,
    linkActiveClass: 'is-active'
  })

  // App
  const app = new Vue({
    i18n: i18nObj,
    router,
    components: {
      App
    },
    render (h) {
      console.log('start app render ....')
      return h(App)
    }
  })

  document.title = Routes.SysConfig.appName
  app.$mount('#app')
}

function main () {
  const bUseES6Fetch = false
  if (bUseES6Fetch) {
    languageConfiguration.___useES6Fetch(lang, startApp)
  } else {
    languageConfiguration.___useJQueryGet(lang, startApp)
  }
}

$(document).ready(() => {
  main()
})
