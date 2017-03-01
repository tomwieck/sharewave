<template>
  <div class="login">
    <div v-if="username" class="login--username">
      <a href="#/myPlaylists">
        <img class="profile-img" :src="imgUrl">
        <span class="profile-name">{{ username }}</span>
      </a>
    </div>
    <a v-else @click="showModal = true" class="login--link">
      <span>Login</span>
    </a>
<!--     <a v-else v-on:click="spotifyLogin" class="login--link">
      <span>Login</span>
    </a> -->
    <!-- use the modal component, pass in the prop -->
    <modal v-if="showModal" @close="showModal = false">
      <h3 slot="header">Login</h3>
      <a slot="body" class="login-slot--link" href="" v-on:click="spotifyLogin">With Spotify</a>
      <a slot="body" class="login-slot--link" href="" v-on:click="genericLogin">Without Spotify</a>
    </modal>
  </div>
</template>

<script>
import SpotifyMixin from './mixins.js'
import Modal from './Modal.vue'

export default {
  name: 'SpotifyLogin',
  data() {
    return {
      access_token: null,
      refresh_token: null,
      imgUrl: null,
      userId: null,
      username: null,
      showModal: false
    }
  },
  mixins: [SpotifyMixin],
  mounted: function () {
    if ('caches' in window) {
      console.log('Has support!')
    }
    this.updateHashParams();
    if (this.$cookie.get('access_token')) {
      var vm = this;
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
      var vm = this;
      vm.axios.get('http://localhost:8888/login')
        .then(function (response) {
          if (response.data) {
            window.location.href = response.data;
          }
          // console.log(response);
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
    }
  },
  components: {
    modal: Modal
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/styles.scss";

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

.login-slot--link:hover {
  color: $play-color;
}

</style>
