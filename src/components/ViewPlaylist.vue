<template>
  <div class="view-playlist">
    <span v-if="uploader">
      <div>
        <img class="view-playlist--cover" v-bind:src="imgUrl">
          <h2> {{ title }} </h2>
        <div>
          <p>Uploaded: {{ dateAdded }}</p>
          <p>Uploaded By: {{ uploader }}</p>
          <p>Created By: {{ owner }}</p>
          <p><a href="playlistUri">Open in Spotify</a></p>
          <p clas="view-playlist--delete" @click="deletePlaylist" v-show="ownPlaylist">
            <svg class="icon icon-bin"><use xlink:href="#icon-bin"></use></svg>
            Delete Playlist from ShareWave
          </p>
        </div>
      </div>
    </span>
    <div v-else>
      <p>Loading...</p>
    </div>
    <symbol id="icon-bin" viewBox="0 0 32 32">
      <title>bin</title>
      <path d="M4 10v20c0 1.1 0.9 2 2 2h18c1.1 0 2-0.9 2-2v-20h-22zM10 28h-2v-14h2v14zM14 28h-2v-14h2v14zM18 28h-2v-14h2v14zM22 28h-2v-14h2v14z"></path>
      <path d="M26.5 4h-6.5v-2.5c0-0.825-0.675-1.5-1.5-1.5h-7c-0.825 0-1.5 0.675-1.5 1.5v2.5h-6.5c-0.825 0-1.5 0.675-1.5 1.5v2.5h26v-2.5c0-0.825-0.675-1.5-1.5-1.5zM18 4h-6v-1.975h6v1.975z"></path>
    </symbol>
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
          this.user = user.uid.replace(/\%2E/g, '.');
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
          this.uploader = snapshot.val().uploader.replace(/\%2E/g, '.');
          if (this.user === this.uploader) { this.ownPlaylist = true };
          this.getPlaylistImage();
        })
    },
    convertTime(epoch) {
      let date = new Date(epoch);
      return date.toLocaleDateString('en-GB');
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

.view-playlist--delete {
  cursor: pointer;
}

.icon {
  display: block;
  margin: auto;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  cursor: pointer;
}

</style>
