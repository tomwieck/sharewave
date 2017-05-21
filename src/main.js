// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VeeValidate from 'vee-validate';
import VueAxios from 'vue-axios'
import VueCookie from 'vue-cookie'
import VueNotifications from 'vue-notifications'
import miniToastr from 'mini-toastr'

function toast ({title, message, type, timeout, cb}) {
  return miniToastr[type](message, title, timeout, cb)
}

const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
}

Vue.use(VeeValidate);
Vue.use(VueAxios, axios);
Vue.use(VueCookie);
Vue.use(VueNotifications, options)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
