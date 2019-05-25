import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '../pages/index'
import SettingPage from '../pages/settings'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: IndexPage
    },
    {
      path: '/settings',
      name: '设置',
      component: SettingPage
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
