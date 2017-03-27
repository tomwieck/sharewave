<template>
  <div>
  <h2>All Playlists</h2>
    <div><input class="playlist--search" placeholder="Search..." v-model="search"></div>
    <div>
      <span>Search by Tags: </span>
      <span v-for="tag in tags" @click="addToSearch(tag)">
        {{tag}}
      </span>
    </div>
    <transition-group name="fade">
      <div class="playlist-container" v-for="playlist in searchResults" :key="playlist.id">
        <span class="playlist-text"><b>{{ playlist.title }} </b></span>
        <img class="playlist-art" v-bind:src="playlist.imgUrl">
          <span v-show="playlist.tags">
          <div>Tags: </div>
            <span v-for="tag in playlist.tags">
              <div class="playlist--tags">
                <span>#{{tag}}</span>
              </div>
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
      return this.playlists.filter(el => {
        // let tagResults;
        // if (el.tags) {
        //   tagResults = el.tags.filter(tag => {
        //     return tag.includes(this.search.toLowerCase());
        //   })
        // }
        // console.log(tagResults);
        return el.title.toLowerCase().includes(this.search.toLowerCase().trim());
          // el.tags.includes(this.search.toLowerCase()));
      });
      // let tags = this.playlists.filter(el => {
      //   if (el.tags) {
      //     tags = el.tags.forEach(tag => {
      //       return tag.includes(this.search.toLowerCase());
      //     })
      //   };
      // })
      // console.log(tags);
      // return title.concat(tags);
    }
  },
  methods: {
    getPlaylists() {
      this.playlistRef = Firebase.database().ref('playlists/');
      this.playlistRef.orderByChild('date_added').on('child_added', snapshot => {
        console.log(snapshot);
        let childData = snapshot.val();
        childData.id = snapshot.key;
        childData.imgUrl = this.placeholder;
        console.log(snapshot.val().tags)
        if (snapshot.child('tags').exists()) {
          this.tags = this.tags.concat(snapshot.val().tags);
        }
        console.log(this.tags);
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
    },
    addToSearch(tag) {
      this.search += tag + ' ';
      console.log(tag);
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
