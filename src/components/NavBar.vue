<template>
  <div id="nav-bar" class="nav-bar">
    <a href="/#/"><img class="nav-bar--logo" src="../assets/logo3.png"></a>
    <h1 class="nav-bar--heading">ShareWave</h1>
    <span v-if="loggedIn">
      <ul class="nav-links-ul">
        <li><a class="nav-bar--link" v-bind:class="checkRoute('wave') ? 'active' : ''" href="#/wave">Wave</a></li>
        <li><a class="nav-bar--link" v-bind:class="checkRoute('myPlaylists') ? 'active' : ''" href="#/myPlaylists">My Playlists</a></li>
        <li><a class="nav-bar--link" v-bind:class="checkRoute('allPlaylists') ? 'active' : ''" href="#/allPlaylists">All Playlists</a></li>
      </ul>
    </span>
    <login></login>
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
      route: false
    }
  },
  mounted() {
    this.checkRoute();
    this.registerStateChange();
  },
  beforeRouteLeave(to, from, next) {
    this.checkRoute();
    next();
  },
  methods: {
    checkRoute(route) {
      console.log(route === this.$route.path.substring(1));
      return route === this.$route.path.substring(1);
    },
    registerStateChange() {
      // console.log(this.$route)
      Firebase.auth().onAuthStateChanged(user => {
        if (user === null) {
          this.loggedIn = false;
        } else {
          if (user.displayName !== null) {
            this.loggedIn = true;
          }
        }
      });
    }
  },
  components: {
    'login': Login
  }
}
</script>

<style lang="scss">
@import "../assets/sass/colors.scss";

.nav-bar--link {
  border-bottom: 2px solid white;
  float: left;
  margin-left: 10px;
  color: #fff;
  font-size: 20px;
  text-decoration: none;
}

.nav-bar--login {
  float: right;
}

.nav-bar--link:hover {
  border-bottom: 2px solid #17375c;
}

.active {
  border-bottom: 2px solid $logo-color;
  // color: $logo-color;
}

.nav-bar {
  background-color: $play-color;
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
  // @media screen and (max-width: $break-tablet) {
  //   display: none;
  // }
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
  text-decoration: none;
  font-weight: normal;
  margin: 0;
}

.nav-bar--logo {
  float: left;
  padding-right: 10px;
  width: 50px;
}
</style>
