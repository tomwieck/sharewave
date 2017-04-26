<template>
  <div id="nav-bar" class="nav-bar">
    <a v-bind:href="loggedIn ? '/#/wave' : '/#/'"><img class="nav-bar--logo" src="../assets/logo3.png">
      <h1 class="nav-bar--heading logo-font">ShareWave</h1>
    </a>
    <ul v-if="loggedIn" class="nav-links-ul">
      <li><a class="nav-bar--link" v-bind:class="checkRoute('Wave') ? 'active' : ''" href="#/wave">Wave</a></li>
      <li v-show="showPlaylists" v-bind:class="!showPlaylists ? 'no-margin' : ''"><a class="nav-bar--link" v-bind:class="checkRoute('All Playlists') ? 'active' : ''" href="#/allPlaylists">Playlists</a></li>
      <!-- <li><a class="nav-bar--link" v-bind:class="checkRoute('allPlaylists') ? 'active' : ''" href="#/allPlaylists">All Playlists</a></li> -->
      <!-- <li><a class="nav-bar--link nav-bar--link__logout" @click="emitLogout">Logout</a></li> -->
    </ul>
    <login ref="loginRef" v-on:loginEmit="checkSpotify"></login>
  </div>
</template>

<script>
import Login from './Login.vue'
import Firebase from './firebaseMixin.js'

export default {
  name: 'nav-bar',
  data() {
    return {
      loggedIn: false,
      isActive: false,
      route: false,
      showPlaylists: false
    }
  },
  mounted() {
    this.checkRoute();
    this.checkSpotify();
    this.registerStateChange();
  },
  beforeRouteLeave(to, from, next) {
    this.checkRoute();
    console.log(this.checkSpotify());
    this.checkSpotify();
    next();
  },
  methods: {
    checkRoute(route) {
      return route === this.$route.name;
    },
    registerStateChange() {
      // console.log(this.$route)
      Firebase.auth().onAuthStateChanged(user => {
        if (user === null) {
          console.log('loggedin = false')
          this.loggedIn = false;
        } else {
          console.log(user.displayName);
          if (user.displayName !== null) {
            console.log(user.uid);
            this.loggedIn = true;
            this.$forceUpdate();
            // unsubscribe();
          }
        }
      });
    },
    // checkSpotify() {
    //   let userRef = Firebase.database().ref(`users/${this.user.replace(/\./g, '%2E')}`);
    //   userRef.once('value')
    //   .then(snapshot => {
    //     if (!this.imgUrl) {
    //       this.imgUrl = snapshot.child('img_url').exists ? snapshot.val().img_url : null
    //     }
    //   })
    // },
    emitLogout() {
      this.$refs.loginRef.signout()
    },
    checkSpotify() {
      this.loggedIn = true;
      // console.log(this.$cookie.get('access_token'))
      this.showPlaylists = true;
    }
  },
  components: {
    'login': Login
  }
}
</script>

<style lang="scss">
@import "../assets/sass/colors.scss";

.hidden {
  display: none;
}

.nav-bar--link {
  border-bottom: 2px solid white;
  float: left;
  margin-left: 10px;
  color: #fff;
  font-size: 20px;
  text-decoration: none;
  transition: 0.2s;
}

.no-margin {
  margin-left: -10px;
}

.nav-bar--link__logout {
  float: right;
}

.nav-bar--link:hover {
  border-bottom: 2px solid #17375c;
  transition: 0.2s;
}

.nav-bar--login {
  float: right;
}

.active {
  border-bottom: 2px solid $logo-color;
  // color: $logo-color;
}

.nav-bar {
  background-color: $play-color;
  margin: 0;
  padding: 5px 1%;
  width: 98%;
}

.nav-bar:after {
  content: "";
  display: block;
  clear: both;
}

.nav-links-ul {
  // @media screen and (max-width: $break-tablet) {
  //   display: none;
  // }
  @media screen and (max-width: $break-tablet) {
    float: none;
    margin-top: 8px;
    padding-left: 0;
  }
  display: inline-block;
  float: left;
  list-style-type: none;
  margin-bottom: 0;
  padding-left: 14px;
}

.nav-links-ul li {
  display: inline-block;
}

.login:hover {
  color: #17375c;
  cursor: pointer;
}

.nav-bar--heading {
  @media screen and (max-width: $break-tablet) {
    display: none;
  }
  color: #fff;
  display: inline-block;
  font-size: 49px;
  float: left;
  text-decoration: none;
  margin: 0;
  padding-left: 10px;
}

.nav-bar--logo {
  float: left;
  width: 42px;
}
</style>
