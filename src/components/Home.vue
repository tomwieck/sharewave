<template>
  <div class="homepage">
    <div class="left">
      <h1 class="homepage--welcome homepage--welcome__left logo-font">Share</h1>
      <div class="text-container">
        <h2 class="homepage--heading">Add songs to Your Wave</h2>
        <h2 class="homepage--heading">Follow your friends to hear what they are listening to</h2>
      </div>
      <div v-show="!loggedIn" class="homepage--login-container">
        <h3 class="homepage--heading">Create a free ShareWave Account, or, </h3>
        <h3 class="homepage--heading">Login with Spotify</h3>
      </div>
      <div v-show="loggedIn" class="homepage--wave">
        <a href="/#/wave"><button class="btn">See Your Wave</button></a>
      </div>
    </div>
    <div class="right">
      <h1 class="homepage--welcome homepage--welcome__right logo-font">Wave</h1>
      <div class="text-container">
        <h2 class="homepage--heading__right">Upload Playlists to ShareWave</h2>
        <h2 class="homepage--heading__right">Or search for and discover new ones</h2>
        <small class="homepage--login">(Must login with Spotify)</small>
      </div>
      <div v-show="!loggedIn" class="homepage--login-container">
        <h3 class="homepage--heading__right">Create a free ShareWave Account, or, </h3>
        <h3 class="homepage--heading__right">Login with Spotify</h3>
      </div>
      <div v-show="loggedIn" class="homepage--wave">
        <a href="/#/allPlaylists"><button class="btn btn--secondary">Go To Playlists</button></a>
      </div>
    </div>
  </div>
</template>

<script>
import Firebase from './firebaseMixin.js'

export default {
  name: 'Home',
  data() {
    return {
      loggedIn: false
    }
  },
  mounted() {
    this.getUser();
  },
  methods: {
    getUser() {
      let unsubscribe = Firebase.auth().onAuthStateChanged(user => {
        if (user === null) {
          // Not logged in
        } else {
          this.loggedIn = true;
          unsubscribe();
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../assets/sass/colors.scss";

.left, .right {
  display: inline-block;
  @media screen and (max-width: $break-tablet) {
    width: 100%;
    height: 45vh;
  }
  width: 50%;
  height: 95vh;
  position: relative;
}

.left {
  float: left;
  background-color: $logo-color;
}

.homepage--welcome {
  // position: absolute;
  font-size: 60px;
  padding-top: 10px;
  @media screen and (max-width: $break-tablet) {
    font-size: 40px;
  }
}

.homepage--welcome__right {
  color: $logo-color;
  text-align: left;
}

.homepage--welcome__left {
  color: white;
  text-align: right;
  @media screen and (max-width: $break-tablet) {
    text-align: left;
  }
}

.homepage--heading {
  color: white;
}

.homepage--heading__right {
  color: $logo-color;
}

.homepage--heading,
.homepage--heading__right {
  @media screen and (max-width: $break-tablet) {
    font-size: 16px;
    text-align: left;
  }
}

.homepage--login {
  @media screen and (max-width: $break-tablet) {
    font-size: 12px;
    float: left;
  }
}

.text-container {
  height: 200px;
  padding-top: 50px;
  @media screen and (max-width: $break-tablet) {
    height: 12vh;
    padding: 8px;
  }
}

.homepage--login-container {
  padding: 8px;
}
</style>
