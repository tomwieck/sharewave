<template>
  <div>
  <h2>All Playlists</h2>
    <div><input class="playlist--search" placeholder="Search..." v-model="search"></div>
    <transition-group name="fade">
      <div class="playlist-container" v-for="playlist in searchResults" :key="playlist.id">
        <span class="playlist-text"><b>{{ playlist.title }} </b></span>
        <img class="playlist-art" v-bind:src="playlist.imgUrl">
        <a class="playlist-text" v-bind:href="createSpotifyLink(playlist.owner, playlist.id)">Open in Spotify</a>
        <a class="playlist-text" v-bind:href="shareWaveLink(playlist.id)">More Details</a>
        </span>
      </div>
    </transition-group>
  </div>
</template>

<script>
import Firebase from './firebaseMixin.js'
import SpotifyMixin from './spotifyMixin.js'

export default {
  name: 'ListPlaylists',
  data() {
    return {
      placeholder: '../static/artplaceholder.png',
      playlistRef: null,
      playlists: [],
      search: ''
    }
  },
  mixins: [SpotifyMixin],
  beforeRouteLeave(to, from, next) {
    if (this.playlistRef) {
      this.playlistRef.off('child_added');
    }
    next();
  },
  mounted() {
    this.getPlaylists();
  },
  computed: {
    searchResults() {
      return this.playlists.filter(post => {
        return post.title.toLowerCase().includes(this.search.toLowerCase());
      });
    }
  },
  methods: {
    getPlaylists() {
      this.playlistRef = Firebase.database().ref('playlists/');
      this.playlistRef.orderByChild('date_added').on('child_added', snapshot => {
        let childData = snapshot.val();
        childData.id = snapshot.key;
        childData.imgUrl = this.placeholder;
        this.playlists.unshift(childData);
        this.getPlaylistDetails(childData);
      });
    },
    createSpotifyLink(user, id) {
      return `spotify:user:${user}:playlist:${id}`;
    },
    shareWaveLink(id) {
      return `/#/playlist/${id}`;
    },
    getPlaylistDetails(playlist) {
      const options = {
        user: playlist.owner,
        playlist: playlist.id,
        fields: 'images,name'
      }
      this.getSinglePlaylist(options, callback => {
        console.log('callback', callback);
        playlist.imgUrl = callback.images[1] ? callback.images[1].url : callback.images[0].url;
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.playlist--search {
  padding: 5px;
  margin-bottom: 10px;
  width: 35%;
}
</style>
