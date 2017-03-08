<template>
  <div class="upload-playlist">
    <h3>Upload a Playlist</h3>
    <div v-if="loading">
      <h3> Loading... </h3>
    </div>
    <div v-else> 
      <img class="upload-playlist--cover" v-bind:src="imgUrl">
      <small class="upload-play--created"> Created by - {{owner}}</small>
      <p>
        <span>
          Playlist Name: 
          <input class="upload-playlist--name-input" v-bind:class="{ 'padding-right': resetButton }" v-model="playlistName">
        </span>
        <span class="upload-playlist--icon-container">
          <transition name="fade">
            <svg @click="resetChanges" v-show="resetButton" class="icon icon-spinner11"><use xlink:href="#icon-spinner11"></use></svg>
          </transition>
          <symbol id="icon-spinner11" viewBox="0 0 32 32">
            <title>spinner11</title>
            <path d="M32 12h-12l4.485-4.485c-2.267-2.266-5.28-3.515-8.485-3.515s-6.219 1.248-8.485 3.515c-2.266 2.267-3.515 5.28-3.515 8.485s1.248 6.219 3.515 8.485c2.267 2.266 5.28 3.515 8.485 3.515s6.219-1.248 8.485-3.515c0.189-0.189 0.371-0.384 0.546-0.583l3.010 2.634c-2.933 3.349-7.239 5.464-12.041 5.464-8.837 0-16-7.163-16-16s7.163-16 16-16c4.418 0 8.418 1.791 11.313 4.687l4.687-4.687v12z"></path>
          </symbol> 
        </span>
        <span class="help is-danger"> Note: Changes made here will be reflected in Spotify</span>
        <button @click="addToDatabase"> Upload </button>
      </p>
    </div>
  </div>
</template>

<script>
import SpotifyMixin from './spotifyMixin.js'
import Firebase from './firebaseMixin.js'

export default {
  name: 'UserPlaylists',
  data () {
    return {
      loading: false,
      imgUrl: '',
      originalPlaylistName: '',
      owner: '',
      playlistName: '',
      playlistId: '',
      resetButton: false
    }
  },
  mixins: [SpotifyMixin],
  mounted: function () {
    let vm = this;
    vm.loading = true;
    vm.owner = this.$route.params.user;
    vm.playlistId = this.$route.params.playlist;
    let fields = 'images,name';
    let options = {user: vm.owner, playlist: vm.playlistId, fields: fields};
    this.getSinglePlaylist(options, function(callback) {
      vm.loading = false;
      vm.imgUrl = callback.images[0].url;
      vm.playlistName = callback.name;
      vm.originalPlaylistName = callback.name;
    });
  },
  watch: {
    playlistName: function () {
      if (this.playlistName !== this.originalPlaylistName) {
        this.resetButton = true;
      } else {
        this.resetButton = false;
      }
    }
  },
  methods: {
    resetChanges: function() {
      this.playlistName = this.originalPlaylistName;
    },
    addToDatabase: function() {
      let vm = this;
      Firebase.database().ref('playlists/' + vm.playlistId).set({
        owner: vm.owner,
        uploader: vm.$cookie.get('user')
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../assets/sass/styles.scss";

.icon {
  color: red;
  cursor: pointer;
  width: 12px;
  height: 12px;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  position: absolute;
  top: 6px;
  right: 7px;
}

.padding-right {
  // Temporary, try to remove if possible
  padding-right: 20px !important;
  width: 165px !important;
}

.upload-play--created {
  display: block;
}

.upload-playlist--cover {
  width: 300px;
}

.upload-playlist--icon-container {
  position: relative;
}

.upload-playlist--name-input {
  font-size: 12px;
  margin-bottom: 5px;
  padding: 5px;
  width: 180px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
  transition: opacity 0.2s
}

</style>
