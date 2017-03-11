<template>
  <div class="nav-login">
    <div v-if="username" class="login--username">
        <a href="/#/myPlaylists">
          <img class="profile-img" :src="imgUrl">
        </a>
        <span class="profile-name"><a v-on:click="emailSignout">Logout</a></span>  
<!--         <span class="profile-name">{{ username }}</span> -->
    </div>
    <a v-else @click="showModal = true" class="login--link">
      <span>Login</span>
    </a>
    <modal v-if="showModal" @close="showModal=false">
      <h3 slot="header">Login</h3>
        <a slot="body" class="login-slot--link" v-on:click="spotifyRedirect">With Spotify</a>
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
      emailLogin: false,
      imgUrl: null,
      userId: null,
      username: null,
      showModal: false,
      stateChange: false
    }
  },
  mixins: [SpotifyMixin],
  mounted: function () {
    if (!this.stateChange) {
      this.registerStateChange();
    }
    if (this.$route.params.access_token) {
      this.updateHashParams();
    }
  },
  methods: {
    spotifyRedirect: function() {
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
    updateHashParams: function () {
      this.$cookie.set('access_token', this.$route.params.access_token, { expires: '1h' });
      this.$cookie.set('refresh_token', this.$route.params.refresh_token);
      this.$cookie.set('firebase_token', this.$route.params.firebase_token);
      this.firebaseSpotifyLogin(this.$route.params.firebase_token);
    },
    firebaseSpotifyLogin: function(token) {
      // Get Spotify User Details, set them to Vue variables, then assign these to Firebase user
      let vm = this;
      vm.getMe(function(callback) {
        vm.setDetails(callback);
      });
      Firebase.auth().signInWithCustomToken(token)
        .then(function(user) {
          console.log(user);
          if (vm.username !== user.displayName || vm.imgUrl !== user.photoURL || vm.userId !== vm.userId) {
            user.updateProfile({displayName: `${vm.username}`, photoURL: `${vm.imgUrl}`, userId: `${vm.userId}`});
          }
        });
    },
    setDetails: function(user) {
      this.username = user.display_name || user.id;
      this.imgUrl = (user.images !== undefined ? user.images[0].url : '../static/placeholder.png')
      this.userId = user.id;
    },
    emailSignout: function() {
      Firebase.auth().signOut()
        .then(function() {
        // Sign-out successful.
        }, function(error) {
          console.log(error);
        });
    },
    registerStateChange: function() {
      let vm = this;
      vm.stateChange = true;
      Firebase.auth().onAuthStateChanged(function(user) {
        console.log('changed');
        if (user === null) {
          vm.resetDetails();
        } else {
          console.log(user);
          if (!user.uid.startsWith('spotify')) {
            vm.updateEmailLogin(user);
          }
        }
      });
    },
    updateEmailLogin: function(user) {
      this.username = user.displayName;
      this.imgUrl = '../static/placeholder.png';
      this.userId = user.uid;
    },
    resetDetails: function(user) {
      this.username = null;
      this.imgUrl = null;
      this.userId = null;
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
