<template>
  <div class="view-playlist">
    <span v-if="uploader">
    <h2> {{ title }} </h2>
      <div>
        <img class="view-playlist--cover" v-bind:src="imgUrl">
        <div>
          <p>Uploaded: {{ dateAdded }}</p>
          <p>Uploaded By: {{ uploader }}</p>
          <p>Created By: {{ owner }}</p>
          <p><a href="playlistUri">Open in Spotify</a></p>
        </div>
      </div>
    </span>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import SpotifyMixin from './spotifyMixin.js'
import Firebase from './firebaseMixin.js'

export default {
  name: 'Home',
  data() {
    return {
      dateAdded: '',
      imgUrl: '',
      owner: '',
      title: '',
      uploader: '',
      playlistUri: ''
    }
  },
  mixins: [SpotifyMixin],
  mounted() {
    this.getUrlParam();
    this.getPlaylistDetails();
    this.convertTime();
  },
  methods: {
    getUrlParam() {
      this.playlistUri = this.$route.params.playlist;
    },
    getPlaylistDetails() {
      Firebase.database().ref(`playlists/${this.playlistUri}`).once('value')
        .then(snapshot => {
          this.dateAdded = this.convertTime(snapshot.val().date_added);
          this.owner = snapshot.val().owner;
          this.uploader = snapshot.val().uploader.replace('%2E', '.');
          this.getPlaylistImage();
        })
    },
    convertTime(epoch) {
      let date = new Date(epoch);
      return date.toLocaleDateString();
    },
    getPlaylistImage() {
      const options = {
        user: this.owner,
        playlist: this.playlistUri,
        fields: 'images,name'
      }
      this.getSinglePlaylist(options, callback => {
        this.title = callback.name;
        this.imgUrl = callback.images[1] ? callback.images[1].url : callback.images[0].url;
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.view-playlist--cover {
  width: 300px;
}
</style>
