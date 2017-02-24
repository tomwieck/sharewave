<template>
  <div class="login">
    <button v-on:click="spotifyLogin">Login with Spotify</button>
    <button v-on:click="getMe">Get Details</button>
    <div></div>
  </div>
</template>

<script>
import Spotify from 'spotify-web-api-js'
export default {
  name: 'SpotifyLogin',
  data() {
    return {
      access_token: '',
      refresh_token: '',
      spotifyApi: new Spotify()
    }
  },
  mounted: function () {
    this.updateHashParams();
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
    getMe: function() {
      let accessToken = this.$cookie.get('access_token');
      this.spotifyApi.setAccessToken(accessToken);
      this.spotifyApi.getMe()
      .then(function(res) {
        console.log(res);
      })
      .catch(function(err) {
        console.log(err);
      })
    },
    // Obtains parameters from the hash of the URL @return Object
    updateHashParams: function () {
      let tokens = this.$route.params.tokens;
      if (tokens) {
        // -16 = '%26refresh_token'
        this.access_token = tokens.split('=')[1].slice(0, -14);
        this.refresh_token = tokens.split('=')[2];

        this.$cookie.set('access_token', this.access_token, 1);
        this.$cookie.set('refresh_token', this.refresh_token, 1);
      }
    },
    readCookie: function(name) {
      var nameEQ = name + '=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
