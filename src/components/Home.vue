<template>
  <div class="homepage">
    <spotify-login></spotify-login>
  </div>
</template>

<script>
import SpotifyLogin from './SpotifyLogin.vue'

export default {
  name: 'Home',
  components: {
    'spotify-login': SpotifyLogin
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
