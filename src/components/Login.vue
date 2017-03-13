<template>
  <div class="nav-login">
    <div v-if="username" class="login--username">
        <a href="/#/myPlaylists">
          <img class="profile-img" :src="imgUrl || placeholderUrl">
        </a>
        <span class="profile-name"><a v-on:click="signout">Logout</a></span>  
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
      email: null,
      emailLogin: false,
      imgUrl: null,
      userId: null,
      username: null,
      showModal: false,
      stateChange: false,
      placeholderUrl: '../static/placeholder.png'
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
      this.$cookie.set('refresh_token', this.$route.params.refresh_token, { expires: '1Y' });
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
          // If Spotify email, img, id or email do not match whats on the server, update them
          if (vm.username !== user.displayName || vm.imgUrl !== user.photoURL || vm.userId !== user.userId || vm.email !== user.email) {
            user.updateProfile({
              displayName: `${vm.username}`,
              email: `${vm.emal}`,
              photoURL: `${vm.imgUrl}`,
              userId: `${vm.userId}`
            });
          }
          Firebase.database().ref('/users/' + vm.userId).once('value')
            .then(snapshot => {
              if (snapshot.val() === null) {
                vm.addToUserDatabase();
              };
            })
        });
    },
    addToUserDatabase: function() {
      let vm = this;
      console.log('added');
      Firebase.database().ref('users/' + this.userId).set({
        display_name: vm.username,
        email: vm.email,
        imgUrl: vm.imgUrl || null,
        spotify: true
      })
    },
    signout: function() {
      Firebase.auth().signOut()
        .then(function() {
        // Sign-out successful.
        });
    },
    registerStateChange: function() {
      let vm = this;
      vm.stateChange = true;
      Firebase.auth().onAuthStateChanged(function(user) {
        console.log('changed');
        if (user === null) {
          vm.resetDetails();
          vm.$cookie.delete('access_token', {domain: 'localhost'});
          vm.redirect();
        } else {
          vm.updateDetails(user);
        }
      });
    },
    setDetails: function(spotifyUser) {
      this.email = spotifyUser.email || null;
      this.imgUrl = (spotifyUser.images !== undefined ? spotifyUser.images[0].url : null)
      this.userId = spotifyUser.id.replace(/\./g, '%2E');
      this.username = spotifyUser.display_name || spotifyUser.id;
    },
    updateDetails: function(user) {
      this.imgUrl = user.photoURL;
      this.username = user.displayName;
      this.userId = user.uid;
    },
    resetDetails: function(user) {
      this.username = null;
      this.imgUrl = null;
      this.userId = null;
    },
    redirect() {
      this.$router.push('/');
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
