<template>
  <div class="nav-login">
    <div v-if="username" class="login--username">
      <a href="/#/myPlaylists">
        <img class="profile-img" :src="imgUrl">
        <span class="profile-name">{{ username }}</span>
      </a>
    </div>
    <a v-else @click="showModal = true" class="login--link">
      <span>Login</span>
    </a>
    <modal v-if="showModal" @close="showModal=false">
      <h3 slot="header">Login</h3>
        <a slot="body" class="login-slot--link" href="" v-on:click="spotifyLogin">With Spotify</a>
        <a slot="body" class="login-slot--link" href="/#/emailLogin">With ShareWave</a>
      <h3 slot="footer" href="">Don't have an account?</h3>
        <a slot="footer" class="signup-slot--link" href="https://www.spotify.com/signup/">Sign up for a Spotify Account</a>
        <a slot="footer" class="signup-slot--link" href="/#/emailSignup">Sign up for a Sharewave Account</a>
    </modal>
  </div>
</template>

<script>
import SpotifyMixin from './spotifyMixin.js'
import Firebase from './firebaseMixin.js'
import Modal from './Modal.vue'

export default {
  name: 'Login',
  data() {
    return {
      imgUrl: null,
      userId: null,
      username: null,
      showModal: false
    }
  },
  mixins: [SpotifyMixin],
  mounted: function () {
    let vm = this;
    this.registerStateChange();
    vm.updateHashParams();
    if (this.$cookie.get('access_token')) {
      if (!vm.username) {
        vm.getMe(function(callback) {
          vm.username = callback.display_name || callback.id;
          vm.imgUrl = callback.images.length > 0 ? callback.images[0].url : '../static/placeholder.png'
          vm.userId = callback.id;
        });
      }
    }
  },
  methods: {
    spotifyLogin: function() {
      let vm = this;
      vm.axios.get('http://localhost:8888/login')
        .then(function (response) {
          if (response.data) {
            window.location.href = response.data;
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    // Obtains parameters from the tokens object (route of the URL) @return Object
    updateHashParams: function () {
      if (this.$route.params.access_token) {
        this.$cookie.set('access_token', this.$route.params.access_token, { expires: '1h' });
        this.$cookie.set('refresh_token', this.$route.params.refresh_token, { expires: '1h' });
      }
    },
    updateDetails: function(user) {
      this.username = user.displayName;
      this.imgUrl = user.photoURL || '../static/placeholder.png'
      this.userId = user.uid;
    },
    resetDetails: function(user) {
      this.username = null;
      this.imgUrl = null;
      this.userId = null;
    },
    registerStateChange: function() {
      let vm = this;
      Firebase.auth().onAuthStateChanged(function(user) {
        if (user && vm.userId === null) {
          vm.updateDetails(user);
        } else {
          vm.resetDetails;
        }
      });
    }
  },
  components: {
    modal: Modal
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/styles.scss";

.nav-login {
  cursor: pointer;
  float: right;
}

.login--username a {
  color: #fff;
  float: left;
  text-decoration: none;
}

.profile-img {
  border-radius: 50%;
  height: 32px;
}

.profile-name {
  width: 100%;
  display: inline-block;
}

.login--username {
  width:100%;
  font-size: 20px;
}

.login--link {
  color: white;
  font-size: 22px;
  margin-top: 15px;
}

.login--link:hover {
  color: $logo-color;
}

.login-slot--link {
  border: 2px solid $play-color;
  border-radius: 5px;
  color: $logo-color;
  display: block;
  padding: 10px;
  margin: auto;
  margin-bottom: 10px;
  text-decoration: none;
  width: 200px;  
}

.signup-slot--link {
  color: $logo-color;
  display: block; 
  margin-bottom: 10px;
}

.login-slot--link:hover,
.signup-slot--link:hover  {
  color: $play-color;
}
</style>
