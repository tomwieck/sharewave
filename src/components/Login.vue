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
        <button slot="body" class="btn btn--secondary block" v-on:click="spotifyRedirect">
          <svg class="icon icon-spotify"><use xlink:href="#icon-spotify"></use></svg>
          With Spotify
        </button>
        <a class="modal-link" slot="body" href="/#/emailLogin"><button class="btn btn--secondary block">
          <svg class="icon icon-sharewave"><use xlink:href="#icon-sharewave"></use></svg>
          With ShareWave
        </button></a>
      <h3 slot="footer">Don't have an account?</h3>
        <a class="modal-link" slot="footer" href="https://www.spotify.com/signup/"><button class="btn btn--main block">
          <svg class="icon icon-spotify"><use xlink:href="#icon-spotify"></use></svg>
          <span>Sign up for a Spotify Account</span>
        </button></a>
        <a class="modal-link" slot="footer" href="/#/emailSignup"> <button  class="btn btn--main block">
          <svg class="icon icon-sharewave"><use xlink:href="#icon-sharewave"></use></svg>
          Sign up for a Sharewave Account
        </button></a>
    </modal>
  <symbol id="icon-spotify" viewBox="0 0 32 32">
    <title>spotify</title>
    <path d="M16 0c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.119-16-16-16zM23.363 23.119c-0.319 0.481-0.881 0.637-1.363 0.319-3.762-2.319-8.481-2.8-14.081-1.519-0.563 0.163-1.037-0.238-1.2-0.719-0.162-0.563 0.237-1.038 0.719-1.2 6.081-1.363 11.363-0.8 15.519 1.762 0.563 0.238 0.644 0.875 0.406 1.356zM25.281 18.719c-0.4 0.563-1.119 0.8-1.681 0.4-4.319-2.637-10.881-3.438-15.919-1.837-0.638 0.163-1.362-0.163-1.519-0.8-0.162-0.637 0.162-1.363 0.8-1.519 5.838-1.762 13.037-0.881 18 2.163 0.475 0.238 0.719 1.038 0.319 1.594zM25.438 14.238c-5.119-3.037-13.681-3.363-18.563-1.838-0.8 0.238-1.6-0.238-1.838-0.963-0.237-0.8 0.237-1.6 0.963-1.838 5.681-1.681 15.038-1.363 20.962 2.162 0.719 0.4 0.962 1.363 0.563 2.081-0.406 0.556-1.363 0.794-2.087 0.394z"></path>
  </symbol>
  <symbol id="icon-sharewave" width="64" height="64" viewBox="0 0 64 64">
    <title>sharewave</title>
    <g transform="scale(0.049)">
    <path d="M917 2.1C839.3 11 770.5 59.8 736 130.4c-16.3 33.4-23.2 63.5-23.4 102.8l-.1 21.7-32 19.7C640.8 299 542.3 360 443.7 421.2l-74.8 46.5-11.2-7.5c-12.8-8.5-34.6-19.4-49.3-24.5-41.4-14.5-87.6-17-129.9-7C130.1 440.1 86 467.4 53.8 506c-25.6 30.7-43.4 69.4-50.2 109.5-11 64.2 6.8 131.8 48.1 183 37.7 46.7 90.9 76.3 152.3 84.6 12.2 1.6 42.7 1.6 55 0 33.8-4.5 67.9-16.6 95.3-33.9l9.4-5.9 12.1 7.3c6.6 3.9 20 11.6 29.8 17 37.4 20.4 82.9 47.6 133.8 79.8 13.2 8.3 57.5 35.2 98.5 59.7l74.6 44.6.1 21.4c.2 36.2 5.8 63.6 19.5 94.7 12.1 27.3 28.5 50.9 50.5 72.2 71.3 69.2 177.3 85.2 265.8 40.2 68.3-34.7 115.3-102.3 124.6-179.2 1.5-12.2 1.5-40.8 0-53-6.5-53.7-30.9-102.6-69.7-140-18.7-18-36.4-30.3-59.8-41.6-54.1-26.1-114.7-30.1-171.5-11.4-35.6 11.7-62.7 28-88.7 53.3l-11.2 10.9-3.3-1.9c-1.8-1.1-40.6-25.1-86.3-53.5-79.9-49.6-163.3-101-208.6-128.6L452.3 722l2.4-8.8c10.3-38.3 10.3-82.4-.1-119.7-1.4-4.9-2.2-9.2-1.8-9.6.4-.3 42.1-25.3 92.7-55.5 50.6-30.1 103-61.8 116.5-70.3 41.5-26.2 110.5-68.1 112.3-68.1.2 0 3.9 3.4 8.3 7.6 58.4 56.1 139.6 77.7 217.8 58 42.2-10.7 78.2-31.8 109.7-64.2 62.8-64.8 81.5-161.5 47.4-246.4-11.7-29.1-28.6-54.3-52-77.5-36-35.8-82.2-58.2-133.8-65C958.9.9 929.8.7 917 2.1zM165 515.5c11.6 5.8 210.8 117.9 212.7 119.8 4.1 3.7 7.3 11.6 7.3 17.6 0 6.6-3.2 14.2-7.6 18.2-3.8 3.5-213.5 120.8-218.2 122.1-6.5 1.8-16-1.1-20.9-6.4-1.2-1.2-3.1-4.3-4.2-6.8-2-4.5-2.1-5.9-2.1-127.1V530.4l2.5-5.1c3-6 8.1-10.2 14.5-11.9 5.4-1.5 10-.9 16 2.1z"/>
    </path></g>
  </symbol>
    <path d="M917 2.1C839.3 11 770.5 59.8 736 130.4c-16.3 33.4-23.2 63.5-23.4 102.8l-.1 21.7-32 19.7C640.8 299 542.3 360 443.7 421.2l-74.8 46.5-11.2-7.5c-12.8-8.5-34.6-19.4-49.3-24.5-41.4-14.5-87.6-17-129.9-7C130.1 440.1 86 467.4 53.8 506c-25.6 30.7-43.4 69.4-50.2 109.5-11 64.2 6.8 131.8 48.1 183 37.7 46.7 90.9 76.3 152.3 84.6 12.2 1.6 42.7 1.6 55 0 33.8-4.5 67.9-16.6 95.3-33.9l9.4-5.9 12.1 7.3c6.6 3.9 20 11.6 29.8 17 37.4 20.4 82.9 47.6 133.8 79.8 13.2 8.3 57.5 35.2 98.5 59.7l74.6 44.6.1 21.4c.2 36.2 5.8 63.6 19.5 94.7 12.1 27.3 28.5 50.9 50.5 72.2 71.3 69.2 177.3 85.2 265.8 40.2 68.3-34.7 115.3-102.3 124.6-179.2 1.5-12.2 1.5-40.8 0-53-6.5-53.7-30.9-102.6-69.7-140-18.7-18-36.4-30.3-59.8-41.6-54.1-26.1-114.7-30.1-171.5-11.4-35.6 11.7-62.7 28-88.7 53.3l-11.2 10.9-3.3-1.9c-1.8-1.1-40.6-25.1-86.3-53.5-79.9-49.6-163.3-101-208.6-128.6L452.3 722l2.4-8.8c10.3-38.3 10.3-82.4-.1-119.7-1.4-4.9-2.2-9.2-1.8-9.6.4-.3 42.1-25.3 92.7-55.5 50.6-30.1 103-61.8 116.5-70.3 41.5-26.2 110.5-68.1 112.3-68.1.2 0 3.9 3.4 8.3 7.6 58.4 56.1 139.6 77.7 217.8 58 42.2-10.7 78.2-31.8 109.7-64.2 62.8-64.8 81.5-161.5 47.4-246.4-11.7-29.1-28.6-54.3-52-77.5-36-35.8-82.2-58.2-133.8-65C958.9.9 929.8.7 917 2.1zM165 515.5c11.6 5.8 210.8 117.9 212.7 119.8 4.1 3.7 7.3 11.6 7.3 17.6 0 6.6-3.2 14.2-7.6 18.2-3.8 3.5-213.5 120.8-218.2 122.1-6.5 1.8-16-1.1-20.9-6.4-1.2-1.2-3.1-4.3-4.2-6.8-2-4.5-2.1-5.9-2.1-127.1V530.4l2.5-5.1c3-6 8.1-10.2 14.5-11.9 5.4-1.5 10-.9 16 2.1z"></path>
  </symbol>
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

.modal-link {
  text-decoration: none;
}

.btn {
  position: relative;
  width: 100%;
}

.btn--main {
  font-size: 16px;
}

.icon-sharewave, .icon-spotify {
  position: absolute;
  top: 7px;
  left: 4px;
}

.nav-login {
  cursor: pointer;
  float: right;
}

.login--username {
  width:100%;
  font-size: 20px;
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

.login--link {
  color: white;
  display: block;
  font-size: 22px;
  margin-top: 8px;
  transition: 0.3s;
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
