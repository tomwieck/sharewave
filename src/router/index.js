import Vue from 'vue'
import Router from 'vue-router'
import EmailLogin from 'components/EmailLogin'
import EmailSignup from 'components/EmailSignup'
import Home from 'components/Home'
import ListPlaylists from 'components/ListPlaylists'
import UserPlaylists from 'components/UserPlaylists'
import UploadPlaylist from 'components/UploadPlaylist'
import ViewPlaylist from 'components/ViewPlaylist'
import ViewUser from 'components/ViewUser'
import Wave from 'components/Wave'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/loggedin/:access_token/:refresh_token/:firebase_token',
      name: 'Logged In',
      component: Home
    },
    {
      path: '/allPlaylists',
      name: 'All Playlists',
      component: ListPlaylists
    },
    {
      path: '/myPlaylists',
      name: 'My Playlists',
      component: UserPlaylists
    },
    {
      path: '/upload/:user/:playlist',
      name: 'UploadPlaylist',
      component: UploadPlaylist
    },
    {
      path: '/playlist/:playlist',
      name: 'ViewPlaylist',
      component: ViewPlaylist
    },
    {
      path: '/user/:user',
      name: 'User',
      component: ViewUser
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
      path: '/wave',
      name: 'Wave',
      component: Wave
    }
  ]
})
