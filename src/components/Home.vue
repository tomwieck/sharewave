<template>
  <div class="homepage">
    <div class="left">
      <h1 class="homepage--welcome homepage--welcome__left logo-font share">Share</h1>
      <h1 class="homepage--welcome homepage--welcome__left logo-font wave-left">Wave</h1>
      <div class="text-container">
        <h2 class="homepage--text">Add songs to Your Wave</h2>
        <h2 class="homepage--text">Follow your friends to hear what they are listening to</h2>
      </div>
      <div v-if="!loggedIn" @click="showModal = !showModal" class="homepage--login-container container--left hide-mobile">
        <h3 class="homepage--text">Create a free ShareWave Account or </h3>
        <h3 class="homepage--text hide-wide">Login with Spotify to get started</h3>
      </div>
      <div v-else="loggedIn" class="homepage--wave">
        <a href="/#/wave"><button class="btn">See Your Wave</button></a>
      </div>
    </div>
    <div class="right">
      <h1 class="homepage--welcome homepage--welcome__right logo-font wave-right">Wave</h1>
      <div class="text-container">
        <h2 class="homepage--text__right hide-wide">Upload Playlists to ShareWave</h2>
        <h2 class="homepage--text__right">Or search for and discover new ones</h2>
        <small class="homepage--login">(Must login with Spotify)</small>
      </div>
      <div v-if="!loggedIn" @click="showModal = !showModal" class="homepage--login-container container--right">
        <h3 class="homepage--text__right hide-wide">Create a free ShareWave Account or </h3>
        <h3 class="homepage--text__right">Login with Spotify to get started</h3>
      </div>
      <div v-else="loggedIn" class="homepage--wave">
        <a href="/#/allPlaylists"><button class="btn btn--secondary">Go To Playlists</button></a>
      </div>
    </div>
    <login-popup :show="showModal"></login-popup>
    <transition name="fade">
      <div v-show="!loggedIn" class="hompage--cookies">This website uses Cookies to ensure you get the best ShareWave experience. By continuing, you consent to Cookies being used. <a href="https://www.gov.uk/help/cookies">Find Out More</a> </div>
    </transition>
  </div>
</template>

<script>
import Firebase from './firebaseMixin.js'
import { EventBus } from './eventBus.js'
import LoginPopup from './LoginPopup.vue'

export default {
  name: 'Home',
  data() {
    return {
      loggedIn: false,
      showModal: false
    }
  },
  mounted() {
    this.getUser();
    EventBus.$on('close', () => {
      this.showModal = false;
    })
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
  },
  components: {
    'login-popup': LoginPopup
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../assets/sass/colors.scss";

.left, .right {
  display: inline-block;
  width: 50%;
  height: calc(100vh - 64px);
  position: relative;
  @media screen and (max-width: $break-tablet) {
    width: 100%;
    height: calc(50vh - 32px);
  }
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

.homepage--welcome__right,
.container--right {
  color: $logo-color;
  text-align: left;
}

.container--right {
  @media screen and (max-width: $break-tablet) {
    text-align: center;
  }
}

.homepage--welcome__left,
.container--left {
  color: white;
  text-align: right;
}

.homepage--text {
  color: white;
}

.homepage--text__right {
  color: $logo-color;
}

.homepage--text,
.homepage--text__right {
  @media screen and (max-width: $break-tablet) {
    font-size: 16px;
  }
}

.homepage--login {
  @media screen and (max-width: $break-tablet) {
    font-size: 12px;
  }
}

.text-container {
  height: 200px;
  padding: 50px 5px;
  padding-bottom: 0;
  @media screen and (max-width: $break-tablet) {
    height: 18vh;
    padding: 8px;
  }
}

.homepage--login-container {
  cursor: pointer;
  padding: 4px;
  h3 {
    transition: 0.2s;
  }
}

.homepage--login-container:hover {
  h3 {
    color: $play-color;
  }
}

.share {
  @media screen and (max-width: $break-tablet) {
    display: inline-block;
  }
}

.wave-left {
  display: none;
  @media screen and (max-width: $break-tablet) {
    display: inline-block;
  }
}

.wave-right {
  display: block;
  @media screen and (max-width: $break-tablet) {
    display: none;
  }
}

.hide-wide {
  display: none;
  @media screen and (max-width: $break-tablet) {
    display: block;
  }
}

.hide-mobile {
  display: block;
  @media screen and (max-width: $break-tablet) {
    display: none;
  }
}

.hompage--cookies {
  background: white;
  border-top: 2px solid $play-color;
  bottom: 0;
  padding: 5px 10px;
  position: absolute;
  text-align: left;
  width: calc(100% - 20px);
  @media screen and (max-width: $break-tablet) {
    font-size: 12px;
  }
}
</style>
