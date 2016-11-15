import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

/*
  Avoid lazy loading while in dev mode
  to benefit from HMR
 */
function load (name) {
  if (process.env.NODE_ENV === 'development') {
    return require('components/' + name + '.vue')
  }
  else {
    return (resolve) => {
      require('bundle?lazy!components/' + name + '.vue')(resolve)
    }
  }
}

let routes = {
  '/': {
    component: require('components/layout.vue'),
    subRoutes: {
      '/': { name: 'home', component: require('components/home.vue') },
      '/:idProve/:mode/*dir': { name: 'explore', component: load('index') },
      '/login': { component: require('components/users/login.vue') },
      '/stadist': { name: 'stadist', component: load('charts') },
      '/admin/:tab': { name: 'admin', component: load('admin') }
    }
  }
}
let Router = new VueRouter()
Router.map(routes)
export default Router
