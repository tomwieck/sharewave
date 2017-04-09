<template>
  <div class="user-playlists">
   <div v-if="playlists" class="playlist-list">
      <transition appear name="fade">
      <div>
        <div>Showing {{ playlists.items.length }} of {{ playlists.total }} playlists</div>
        <div class="playlist-container" v-for="playlist in playlists.items">
          <span class="playlist-title"><b>{{ playlist.name }} </b></span>
          <img class="playlist-art" v-bind:src="playlist.images[0] ? playlist.images[0].url : placeholder">
          <a class="playlist-text" v-bind:href="playlist.uri">Open in Spotify</a>
          <a class="playlist-upload" v-bind:href="generateLink(playlist.owner.id, playlist.id)">Add to ShareWave</a>
        </div>
        <h2 v-show="playlists.total > 20" class="playlist-load-more"><a v-on:click="loadMore">{{ loadMoreText }}</a></h2>
      </div>
      </transition>
    </div>
    <div v-else class="playlist-error">
      <div v-if="error">
        <p> Please login to see your playlists </p>
      </div>
      <div v-else>
        <p> Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
import SpotifyMixin from './spotifyMixin.js'
// import Firebase from './firebaseMixin.js'

export default {
  name: 'UserPlaylists',
  data () {
    return {
      error: null,
      loadMoreText: 'Load more...',
      placeholder: '../static/artplaceholder.png',
      playlists: null
    }
  },
  mixins: [SpotifyMixin],
  mounted() {
    this.getPlaylists(callback => {
      if (callback.status === 401) {
        this.error = true;
      } else {
        this.playlists = callback;
      }
    });
  },
  methods: {
    loadMore() {
      let nextUrl = this.playlists.next;
      if (nextUrl) {
        this.loadMoreText = 'Loading...'
        let config = {
          headers: { Authorization: 'Bearer ' + this.$cookie.get('access_token') }
        };
        this.axios.get(nextUrl, config)
        .then(response => {
          response = response.data;
          this.playlists.next = response.next;
          this.playlists.items.push(...response.items);
          this.loadMoreText = 'Load more...';
          this.playlists.limit += response.items.length;
        })
        .catch(error => {
          this.searchPlaceholder = 'Could not reach the API. ' + error
        })
      } else {
        this.loadMoreText = '';
      }
    },
    generateLink: function(owner, id) {
      owner = encodeURIComponent(owner);
      return `/#/upload/${owner}/${id}`;
    }
  }
}
</script>

<style lang="scss" scoped>

.playlist-list {
  padding-top: 10px;
}

.playlist-load-more {
  cursor: pointer;
}

.playlist-load-more:hover {
  color: #17385e;
}

// .fade-enter-active, .fade-leave-active {
//   transition: opacity 0.5s
// }
// .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
//   opacity: 0;
//   transition: opacity 0.5s
// }

</style>
