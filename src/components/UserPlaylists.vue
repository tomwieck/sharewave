<template>
  <div class="user-playlists">
  <button @click="youtubeLogin">YouTube Login</button>
   <div v-if="playlists" class="playlist--list">
      <div>Showing {{ playlists.items.length }} of {{ playlists.total }} playlists</div>
      <transition-group appear class="playlist--all-containers" name="fade">
        <div class="playlist--container" v-for="playlist in playlists.items" :key="playlist.name">
          <img class="playlist--art" v-bind:src="playlist.images[0] ? playlist.images[0].url : placeholder">
          <span class="playlist--title"><b>{{ playlist.name }} </b></span>
          <a v-bind:href="playlist.uri"><img class="playlist--spotify" :src="spotifyBadge"></a>
          <!-- <a class="playlist--text" v-bind:href="">Open in Spotify</a> -->
          <div class="playlist--spotify-upload">
            <a class="playlist--upload" v-bind:href="generateLink(playlist.owner.id, playlist.id)">
              <button class="btn btn--main">Upload</button>
            </a>
          </div>
        </div>
      </transition-group>
      <h2 v-show="playlists.total > 20" class="playlist--load-more"><a v-on:click="loadMore">{{ loadMoreText }}</a></h2>
    </div>
    <div v-else class="playlist--error">
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
      playlists: null,
      spotifyBadge: '../static/spotifyBadge.svg'
    }
  },
  mixins: [SpotifyMixin],
  mounted() {
    console.log(this.$route);
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
    generateLink(owner, id) {
      owner = encodeURIComponent(owner);
      return `/#/upload/${owner}/${id}`;
    },
    youtubeLogin() {
      this.axios.get('http://localhost:8888/generateUri')
      .then(function (response) {
        if (response.data) {
          window.location.href = response.data;
        } else {
          console.log(response);
        }
        // vm.$cookie.set('client_access_token', response.data.access_token, { expires: '1h' });
      })
      .catch(function (error) {
        console.log(error);
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.playlist--list {
  padding-top: 10px;
}

.playlist--load-more {
  cursor: pointer;
}

.playlist--load-more:hover {
  color: #17385e;
}

</style>
