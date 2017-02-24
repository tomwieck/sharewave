import Vue from 'vue'
import Router from 'vue-router'
import Home from 'components/Home'
import Search from 'components/Search'
import SpotifyLogin from 'components/SpotifyLogin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/loggedin/:tokens',
      name: 'Logged in',
      component: SpotifyLogin
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    }
  ]
})
