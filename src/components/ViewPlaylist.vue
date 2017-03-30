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
          <p @click="deletePlaylist" v-show="ownPlaylist">Delete Playlist from ShareWave</p>
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
import VueNotifications from 'vue-notifications'

export default {
  name: 'Home',
  data() {
    return {
      dateAdded: '',
      ownPlaylist: false,
      imgUrl: '',
      owner: '',
      title: '',
      uploader: '',
      user: '',
      playlistRef: '',
      playlistUri: ''
    }
  },
  mixins: [SpotifyMixin],
  mounted() {
    this.getUser();
    this.getUrlParam();
    this.getPlaylistDetails();
    this.convertTime();
  },
  methods: {
    getUser() {
      let unsubscribe = Firebase.auth().onAuthStateChanged(user => {
        if (user === null) {
          // Not logged in
        } else {
          console.log()
          this.user = user.uid.replace('/\%2E/g', '.');
          unsubscribe();
        }
      });
    },
    getUrlParam() {
      this.playlistUri = this.$route.params.playlist;
    },
    getPlaylistDetails() {
      this.playlistRef = Firebase.database().ref(`playlists/${this.playlistUri}`);
      this.playlistRef.once('value')
        .then(snapshot => {
          this.dateAdded = this.convertTime(snapshot.val().date_added);
          this.owner = snapshot.val().owner;
          this.title = snapshot.val().title;
          this.uploader = snapshot.val().uploader.replace('/\%2E/g', '.');
          if (this.user === this.uploader) { this.ownPlaylist = true };
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
        fields: 'images'
      }
      this.getSinglePlaylist(options, callback => {
        this.imgUrl = callback.images[1] ? callback.images[1].url : callback.images[0].url;
      });
    },
    deletePlaylist() {
      this.playlistRef.remove();
      VueNotifications.error({message: `Playlist deleted from ShareWave`});
      this.$router.push(`/allPlaylists`);
      // this.waveRef.child(id).remove();
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
