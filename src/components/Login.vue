<template>
  <div class="nav-login">
    <div v-if="username" class="login--username">
        <a :href="`/#/user/${encodeURIComponent(userId.replace(/\%2E/g, '.'))}`">
          <img class="profile-img" :src="imgUrl || placeholderUrl">
        </a>
        <!-- <span class="profile-name"><a v-on:logout="signout" v-on:click="signout">Logout</a></span> -->
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
import { EventBus } from './eventBus.js';
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
  mounted() {
    this.setupListener();
    if (!this.stateChange) {
      this.registerStateChange();
    }
    if (this.$route.params.access_token) {
      this.updateHashParams();
    }
    this.$on('logout', this.signout);
  },
  methods: {
    setupListener() {
      EventBus.$on('logout', () => {
        this.signout();
      });
    },
    spotifyRedirect() {
      this.axios.get('http://localhost:8888/login')
        .then(response => {
          if (response.data) {
            window.location.href = response.data;
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
    updateHashParams() {
      this.$cookie.set('access_token', this.$route.params.access_token, { expires: '1h' });
      this.$cookie.set('refresh_token', this.$route.params.refresh_token, { expires: '1Y' });
      this.$cookie.set('firebase_token', this.$route.params.firebase_token);
      this.firebaseSpotifyLogin(this.$route.params.firebase_token);
    },
    firebaseSpotifyLogin(token) {
      // Get Spotify User Details, set them to Vue variables, then assign these to Firebase user
      this.getMe(callback => {
        this.setDetails(callback);
        Firebase.auth().signInWithCustomToken(token)
          .then(user => {
            // If Spotify email, img, id or email do not match whats on the server, update them
            if (this.username !== user.displayName || this.imgUrl !== user.photoURL || this.userId !== user.userId || this.email !== user.email) {
              user.updateProfile({
                displayName: this.username,
                email: this.email,
                photoURL: this.imgUrl,
                userId: this.userId
              });
            }
            // If user doesnt already exist in user database, add them
            Firebase.database().ref('/users/' + this.userId).once('value')
              .then(snapshot => {
                if (snapshot.val() === null) {
                  this.addToUserDatabase();
                };
              })
            this.$emit('loginEmit');
          });
      });
    },
    addToUserDatabase() {
      Firebase.database().ref('users/' + this.userId).set({
        display_name: this.username,
        email: this.email,
        img_url: this.imgUrl || null,
        spotify: true,
        wave: false
      })
    },
    signout() {
      Firebase.auth().signOut()
        .then(() => {
          this.resetDetails();
          this.$cookie.delete('access_token', {domain: 'localhost'});
          this.$cookie.delete('refresh_token', {domain: 'localhost'});
          this.redirect();
        });
    },
    registerStateChange() {
      this.stateChange = true;
      Firebase.auth().onAuthStateChanged(user => {
        if (user === null) {
          console.log('null');
        } else {
          this.updateDetails(user);
        }
      });
    },
    setDetails(spotifyUser) {
      this.email = spotifyUser.email || null;
      this.imgUrl = spotifyUser.images.length !== 0 ? spotifyUser.images[0].url : null
      this.userId = spotifyUser.id.replace(/\./g, '%2E');
      this.username = spotifyUser.display_name ? spotifyUser.display_name : spotifyUser.id;
    },
    updateDetails(user) {
      this.imgUrl = user.photoURL;
      if (user.displayName) { this.username = user.displayName; }
      this.userId = user.uid;
    },
    resetDetails(user) {
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
@import "../assets/sass/colors.scss";

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
  height: 44px;
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
