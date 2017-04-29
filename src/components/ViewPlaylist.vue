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
          <a class="view-playlist--delete" :href="createSpotifyLink(playlistUri, owner)">
            <button class="btn btn--main block"><svg class="icon icon-spotify"><use xlink:href="#icon-spotify"></use></svg>
              Open in Spotify
            </button>
          </a>
          <a class="view-playlist--delete" @click="deletePlaylist" v-show="ownPlaylist">
            <button class="btn btn--secondary"><svg class="icon icon-bin"><use xlink:href="#icon-bin"></use></svg>
            Delete Playlist from ShareWave
            </button>
          </a>
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
    <symbol id="icon-spotify" viewBox="0 0 32 32">
      <title>spotify</title>
      <path d="M16 0c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.119-16-16-16zM23.363 23.119c-0.319 0.481-0.881 0.637-1.363 0.319-3.762-2.319-8.481-2.8-14.081-1.519-0.563 0.163-1.037-0.238-1.2-0.719-0.162-0.563 0.237-1.038 0.719-1.2 6.081-1.363 11.363-0.8 15.519 1.762 0.563 0.238 0.644 0.875 0.406 1.356zM25.281 18.719c-0.4 0.563-1.119 0.8-1.681 0.4-4.319-2.637-10.881-3.438-15.919-1.837-0.638 0.163-1.362-0.163-1.519-0.8-0.162-0.637 0.162-1.363 0.8-1.519 5.838-1.762 13.037-0.881 18 2.163 0.475 0.238 0.719 1.038 0.319 1.594zM25.438 14.238c-5.119-3.037-13.681-3.363-18.563-1.838-0.8 0.238-1.6-0.238-1.838-0.963-0.237-0.8 0.237-1.6 0.963-1.838 5.681-1.681 15.038-1.363 20.962 2.162 0.719 0.4 0.962 1.363 0.563 2.081-0.406 0.556-1.363 0.794-2.087 0.394z"></path>
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
      tags: '',
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
          this.tags = snapshot.val().tags;
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
      if (this.tags) {
        let updates = {}
        this.tags.forEach(tag => {
          updates[`${tag}/${this.playlistUri}`] = null;
        })
        Firebase.database().ref('tags/').update(updates);
      }
      this.playlistRef.remove();
      VueNotifications.error({message: `Playlist deleted from ShareWave`});
      this.$router.push(`/allPlaylists`);
    },
    createSpotifyLink(user, id) {
      return `spotify:user:${user}:playlist:${id}`;
    },
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
  text-decoration: none;
}

</style>
