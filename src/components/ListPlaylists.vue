<template>
  <div>
  <h2>All Playlists</h2>
    <div><input class="playlist--search" placeholder="Search..." v-model="search"></div>
    <div>
      <span class="block">Search by Tags: </span>
      <span v-for="tag in tags" @click="addToSearch(tag)">
        <span class="button">{{tag}}</span>
      </span>
    </div>
    <transition-group name="fade">
      <div class="playlist-container" v-for="playlist in searchResults" :key="playlist.id">
        <span class="playlist-text"><b>{{ playlist.title }} </b></span>
        <img class="playlist-art" v-bind:src="playlist.imgUrl">
          <span class="block" v-show="playlist.tags">
            <span v-for="tag in playlist.tags">
              <span class="button" @click="addToSearch(tag)">#{{tag}}</span>
            </span>
          </span>
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
      search: '',
      tags: []
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
      // returns elements that return true
      return this.playlists.filter(el => {
        // Should return TRUE or FALSE only
        let tagCheck = false;
        if (el.tags) {
          el.tags.filter(v => {
            if (tagCheck === false) { tagCheck = this.search.toLowerCase().trim().includes(v) }
          })
        }
        let titleCheck = el.title.toLowerCase().includes(this.search.toLowerCase().trim())
        return titleCheck || tagCheck;
      });
    }
  },
  methods: {
    getPlaylists() {
      this.setAccessToken
      this.playlistRef = Firebase.database().ref('playlists/');
      this.playlistRef.orderByChild('date_added').on('child_added', snapshot => {
        let childData = snapshot.val();
        childData.id = snapshot.key;
        childData.imgUrl = this.placeholder;
        if (snapshot.child('tags').exists()) {
          this.tags = this.tags.concat(snapshot.val().tags);
        }
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
        // fields: 'name'
      }
      this.getSinglePlaylist(options, callback => {
        // console.log('callback', callback);
        if (callback.images) {
          playlist.imgUrl = callback.images[1] ? callback.images[1].url : callback.images[0].url;
        } else {
          playlist.imgUrl = this.placeholder;
        }
      });
    },
    addToSearch(tag) {
      this.search += tag + ' ';
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

/*.button:first-child {
  margin-right: 0;
}*/

</style>
