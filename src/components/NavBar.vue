<template>
  <div id="nav-bar" class="nav-bar">
    <a href="/#/"><img class="nav-bar--logo" src="../assets/logo3.png"></a>
    <h1 class="nav-bar--heading">ShareWave</h1>
    <ul class="nav-links-ul">
      <li><a class="nav-bar--link" href="#/search">Search</a></li>
      <li><a class="nav-bar--link" href="#/myPlaylists">My Playlists</a></li>
    </ul>   
    <login></login>
  </div>
</template>

<script>
import SpotifyLogin from './SpotifyLogin.vue'

export default {
  name: 'nav-bar',
  components: {
    'login': SpotifyLogin
  }
}
</script>

<style lang="scss">
// @import "../assets/sass/styles.scss";
.nav-bar {
  background-color: #299dcf;
  height: 55px;
  margin: 0;
  padding: 10px 1%;
  width: 98%;
}

.nav-bar:after {
  content: "";
  display: block;
  clear: both;
}

.nav-links-ul {
  display: inline-block;
  float: left;
  list-style-type: none;
  margin-bottom: 0;
  padding-left: 14px; 
}

.nav-links-ul li {
  display: inline-block;
}

.nav-bar--heading {
  float: left;
}

.nav-bar--link {
  border-bottom: 2px solid white;
  float: left;
  margin-left: 10px;
}

.nav-bar--login {
  float: right;
}

.nav-bar--link {
  color: #fff;
  font-size: 20px;
  text-decoration: none;
}

.nav-bar--link:hover {
  border-bottom: 2px solid #17375c;
}

.login:hover {
  color: #17375c;
  cursor: pointer;
}

.nav-bar--heading {
  color: #fff;
  display: inline-block;
  font-size: 49px;
  text-decoration: none;
  font-weight: normal;
  margin: 0;
}

.nav-bar--logo {
  float: left;
  padding-right: 10px;
  width: 50px;
}

.login {
  float: right;
}

.login--username a {
  color: #fff;
  float: none;
  text-decoration: none;
}
/*logo*/
/* play - 299dcf */
/* 17375c */
</style>
