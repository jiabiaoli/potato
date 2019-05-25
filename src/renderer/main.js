import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import md5 from 'js-md5';
import iView from 'iview'
import db from './datastore'
import {ipcRenderer} from 'electron'
import 'iview/dist/styles/iview.css'
Vue.use(iView,{
  transfer: true,
  size: 'small',
  select: {
    arrow: 'md-arrow-dropdown',
    arrowSize: 20
  }
})


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.$md5=md5
Vue.prototype.$db=db
Vue.prototype.$ipc=ipcRenderer
ipcRenderer.on('jump',(event,args)=>{
   router.push(args.jump)
})
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
