// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VuePouchDb from 'vue-pouchdb'
import VueCookie from 'vue-cookie'

Vue.use(VuePouchDb, {name: 'playlists'});
Vue.use(VueAxios, axios);
Vue.use(VueCookie);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
