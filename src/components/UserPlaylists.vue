<template>
  <div class="user-playlists">
   <div v-if="playlists" class="playlist-list">
      <transition appear name="fade">
      <div>
        <div>Showing {{ playlists.limit }} of {{ playlists.total }} playlists</div>
        <div class="playlist-container" v-for="playlist in playlists.items">
          <img class="playlist-art" v-bind:src="playlist.images[0].url">
          <a class="playlist-link" v-bind:href="playlist.uri">{{ playlist.name }}</a>
        </div>
        <h2 class="playlist-load-more"><a v-on:click="loadMore">{{ loadMoreText }}</a></h2>
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
import SpotifyMixin from './mixins.js'

export default {
  name: 'UserPlaylists',
  data () {
    return {
      error: null,
      loadMoreText: 'Load more...',
      playlists: null
    }
  },
  mixins: [SpotifyMixin],
  mounted: function () {
    if ('caches' in window) {
      // Use to add cache support to API call
      // console.log('Has support!')
    }
    if (this.$cookie.get('access_token') !== null) {
      var vm = this;
      vm.getPlaylists(function(callback) {
        if (callback.status === 401) {
          vm.error = true;
        } else {
          console.log(callback);
          vm.playlists = callback;
        }
      });
    } else {
      this.error = true;
    }
  },
  methods: {
    loadMore: function() {
      let nextUrl = this.playlists.next;
      if (nextUrl) {
        this.loadMoreText = 'Loading...'
        let vm = this;
        let config = {
          headers: { Authorization: 'Bearer ' + this.$cookie.get('access_token') }
        };
        vm.axios.get(nextUrl, config)
        .then(function (response) {
          console.log(response);
          response = response.data;
          vm.playlists.next = response.next;
          vm.playlists.items.push(...response.items);
          vm.loadMoreText = 'Load more...';
          vm.playlists.limit += response.items.length;
        })
        .catch(function (error) {
          vm.searchPlaceholder = 'Could not reach the API. ' + error
        })
      } else {
        this.loadMoreText = '';
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.playlist-list {
  padding-top: 10px;
}

.playlist-art {
  display: inline-block;
  height: 100px;
  max-width: 100px;
}

.playlist-link {
  display: block;
}

.playlist-container {
  border: 2px solid #299dcf;
  border-radius: 5px;
  display: inline-block;
  height: auto;
  padding: 10px 2%;
  margin: 5px 2%;
  max-width: 500px;
}

.playlist-load-more {
  cursor: pointer;
}

.playlist-load-more:hover {
  color: #17385e;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
  transition: opacity 0.5s
}

</style>
