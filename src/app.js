import Vue from 'vue'
import VueTouch from 'vue-touch'
import VueResource from 'vue-resource'
import Quasar from 'quasar'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import Moment from 'moment'
import Router from './router'
import App from './components/App.vue'
import Storage from './services/lstorage'
import UserService from './services/user'
import locale from './services/locales'
/*
  If overriding Quasar style, leave uncommented
  just the first line.

  If NOT overriding Quasar style, leave uncommented
  just the second line. This option make compiling faster.

  WARNING!
  Leave just one of the two require() calls below
  uncommented.
 */
// require('./themes/app.' + __THEME + '.styl')
require('quasar/dist/quasar.' + __THEME + '.css')
Quasar.theme.set(__THEME)

Vue.use(VueTouch) // Touch events
Vue.use(VueResource) // Ajax Requests
Vue.use(Vuex)
Vue.use(Quasar) // Install Quasar Framework
Storage.setPrefix('NGEXPLORER')
Vue.http.interceptors.push((request, next) => {
  // modify request
  var token = Storage.get('token')
  if (token) {
    request.headers['Authorization'] = 'Bearer ' + token
  }
  // continue to next interceptor
  next((response) => {
    // modify response
    if (response.status === 401 || response.status === 403) {
      // desloguear user
      UserService.logout()
    }
  })
})
var Dev = false
var dirServer = Dev ? 'http://' + window.location.hostname + ':3010' : window.location.origin
dirServer = Storage.set('serverDir', dirServer)
UserService.init()
// install plugin
Vue.use(VueI18n)
// ready translated locales
const lan = Storage.get('lenguaje', 'es')
const locales = locale.i18n
Vue.config.lang = lan
// set locales
Object.keys(locales).forEach(function (lang) {
  Vue.locale(lang, locales[lang])
})
Vue.filter('moment', function (date, format) {
  return Moment(date).format(format)
})
Vue.http.options.root = dirServer
Quasar.start(() => {
  Router.start(App, '#ngexplorer-vuejs-client-app')
})
