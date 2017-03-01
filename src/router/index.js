import Vue from 'vue'
import Router from 'vue-router'
import Home from 'components/Home'
import Search from 'components/Search'
import UserPlaylists from 'components/UserPlaylists'
// import SpotifyLogin from 'components/SpotifyLogin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/loggedin/:access_token/:refresh_token',
      name: 'Logged in',
      component: UserPlaylists
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/myPlaylists',
      name: 'My Playlists',
      component: UserPlaylists
    }
  ]
})
