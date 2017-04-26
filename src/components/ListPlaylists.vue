<template>
  <div>
    <a href="/#/myPlaylists"><button class="btn btn--main playlist--upload">Upload a Playlist to ShareWave</button></a>
    <div><input class="playlist--search input-box" placeholder="Search..." v-model="search"></div>
    <div>
      <span v-for="tag in tags" @click="addToSearch(tag)">
        <span class="tag">#{{tag}}</span>
      </span>
    </div>
    <transition-group class="playlist--all-containers" name="fade">
      <div class="playlist--container" v-for="playlist in searchResults" :key="playlist.id">
        <img class="playlist--art" v-bind:src="playlist.imgUrl">
        <h4 class="playlist--title">{{ playlist.title }}</h4>
        <a v-bind:href="createSpotifyLink(playlist.owner, playlist.id)"><img class="playlist--spotify" :src="spotifyBadge"></a>
        <a class="playlist--link" v-bind:href="shareWaveLink(playlist.id)">
          <svg class="icon icon-file-play"><use xlink:href="#icon-file-play"></use></svg>
          <span>Details</span>
        </a>
        <span class="playlist--tags" v-show="playlist.tags">
          <span v-for="tag in playlist.tags">
            <span class="tag" @click="addToSearch(tag)">#{{tag}}</span>
          </span>
        </span>
      </div>
    </transition-group>
  <symbol id="icon-file-play" viewBox="0 0 32 32">
    <title>file-play</title>
    <path d="M12 12l10 7-10 7v-14z"></path>
    <path d="M28.681 7.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-15.5c-1.378 0-2.5 1.121-2.5 2.5v27c0 1.378 1.122 2.5 2.5 2.5h23c1.378 0 2.5-1.122 2.5-2.5v-19.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 5.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-23c-0.271 0-0.5-0.229-0.5-0.5v-27c0-0.271 0.229-0.5 0.5-0.5 0 0 15.499-0 15.5 0v7c0 0.552 0.448 1 1 1h7v19.5z"></path>
  </symbol>
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
      spotifyBadge: '../static/spotifyBadge.svg',
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
      // returns true if tag or title
      return this.playlists.filter(el => {
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
      this.getTags();
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
        fields: 'images'
      }
      this.getSinglePlaylist(options, callback => {
        if (callback.images) {
          playlist.imgUrl = callback.images[1] ? callback.images[1].url : callback.images[0].url;
        } else {
          playlist.imgUrl = this.placeholder;
        }
      });
    },
    addToSearch(tag) {
      if (this.search.includes(tag)) {
        this.search = this.search.replace(tag + ' ', '');
      } else {
        this.search += tag + ' ';
      }
    },
    getTags() {
      Firebase.database().ref('tags/').once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          this.tags = Object.keys(snapshot.val());
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/colors.scss";

.playlist--link {
  cursor: pointer;
  float: left;
  height: 30px;
  padding: 0 10px;
  padding-top: 10px;
  text-decoration: none;
  span {
    text-decoration: underline;
  }
  @media screen and (max-width: $break-tablet) {
    display: block;
    float: none;
    padding-top: 4px;
  }
}

.playlist--link, .playlist--link a {
  color: $logo-color;
  transition: 0.3s;
}

.playlist--link:hover {
  color: $play-color;
}

.playlist--spotify {
  @media screen and (max-width: $break-tablet) {
    display: block;
    float: none;
  }
}

.playlist--upload {
  margin: 10px;
  margin-top: 20px;
}

.playlist--upload a {
  color: white;
  font-size: 16px;
  text-decoration: none;
}

.playlist--search {
  padding: 5px;
  margin: 10px;
  width: 35%;
  @media screen and (max-width: $break-tablet) {
    width: 90%;
  }
}

.icon {
  margin: auto;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  cursor: pointer;
}
</style>
