import Vue from 'vue'
import Router from 'vue-router'
import ListPlaylists from 'components/ListPlaylists'
import Search from 'components/Search'
import UserPlaylists from 'components/UserPlaylists'
import EmailSignup from 'components/EmailSignup'
import EmailLogin from 'components/EmailLogin'
import UploadPlaylist from 'components/UploadPlaylist'
// import SpotifyLogin from 'components/SpotifyLogin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: ListPlaylists
    },
    {
      path: '/loggedin/:access_token/:refresh_token/:firebase_token',
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
    },
    {
      path: '/emailLogin',
      name: 'Login',
      component: EmailLogin
    },
    {
      path: '/emailSignup',
      name: 'Signup',
      component: EmailSignup
    },
    {
      path: '/upload/:user/:playlist',
      name: 'UploadPlaylist',
      component: UploadPlaylist
    }
  ]
})
