<template>
  <div class="homepage">
    <h2>Welcome to ShareWave</h2>
    
    <transition-group name="fade">
      <div class="playlist-container" v-for="playlist in playlists" :key="playlist.id" >
        <img class="playlist-art" v-bind:src="playlist.imgUrl">
        <a class="playlist-link" v-bind:href="createLink(playlist.owner, playlist.id)">{{ playlist.title }}</a>
      </div>
    </transition-group>
  </div>
</template>

<script>
import Firebase from './firebaseMixin.js'
import SpotifyMixin from './spotifyMixin.js'

export default {
  name: 'Home',
  data() {
    return {
      placeholder: '../static/artplaceholder.png',
      playlists: []
    }
  },
  mixins: [SpotifyMixin],
  mounted: function() {
    let vm = this;
    vm.clientCredentials(function(callback) {
      vm.getPlaylists();
    });
  },
  methods: {
    getPlaylists: function() {
      let vm = this;
      var playlistRef = Firebase.database().ref('playlists/');
      playlistRef.orderByChild('date_added').on('child_added', function(snapshot) {
        var key = snapshot.key;
        var childData = snapshot.val();
        childData.id = key;
        childData.imgUrl = vm.placeholder;
        vm.playlists.unshift(childData);
        vm.getPlaylistImage(childData);
      });
    },
    createLink: function(user, id) {
      return `spotify:user:${user}:playlist:${id}`;
    },
    getPlaylistImages: function() {
      let vm = this;
      vm.playlists.forEach(function(playlist) {
        const options = {
          user: playlist.owner,
          playlist: playlist.id,
          fields: 'images'
        }
        vm.getSinglePlaylist(options, function(callback) {
          console.log(callback);
          playlist.imgUrl = callback.images[1] ? callback.images[1].url : callback.images[0].url
        });
      })
    },
    getPlaylistImage: function(playlist) {
      console.log('get playlist image');
      let vm = this;
      const options = {
        user: playlist.owner,
        playlist: playlist.id,
        fields: 'images,name'
      }
      vm.getSinglePlaylist(options, function(callback) {
        console.log('callback', callback);
        playlist.title = callback.name;
        playlist.imgUrl = callback.images[1] ? callback.images[1].url : callback.images[0].url;
      });
    },
    clientCredentials: function(callback) {
      var vm = this;
      vm.axios.get('http://localhost:8888/clientCredential')
      .then(function (response) {
        vm.$cookie.set('client_access_token', response.data.access_token);
        return callback();
      })
      .catch(function (error) {
        console.log(error);
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../assets/sass/styles.scss";

</style>
