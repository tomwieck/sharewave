<template>
  <div>
    <a href="/#/myPlaylists">
      <button class="btn btn--main playlist--upload">
        <svg class="icon icon-cloud-upload"><use xlink:href="#icon-cloud-upload"></use></svg>Upload a Playlist to ShareWave
      </button>
    </a>
    <div class="playlist--search-container">
      <input class="playlist--search input-box" placeholder="Search by Title and Tags..." v-model="search">
      <svg class="icon icon-search"><use xlink:href="#icon-search"></use></svg>
    </div>
    <div v-if="loaded">
      <div id="playlist-tags">
        <span v-for="tag in tags" @click="addToSearch(tag)">
          <span class="tag">#{{tag}}</span>
        </span>
      </div>
      <div id="playlist-show-all" class="playlist--show-all" @click="showTags">Show All Tags</div>
      <transition-group class="playlist--all-containers" name="fade">
        <div class="playlist--container" v-for="playlist in searchResults" :key="playlist.id">
          <img class="playlist--art" v-bind:src="playlist.imgUrl">
          <h4 class="playlist--title">{{ playlist.title }}</h4>
          <small class="playlist--uploader"> Uploaded by {{playlist.uploader_name}}</small>
          <a v-bind:href="createSpotifyLink(playlist.owner, playlist.id)"><img class="playlist--spotify" :src="spotifyBadge"></a>
          <a class="playlist--link" v-bind:href="shareWaveLink(playlist.id)">
            <button class="btn btn--main">
              <svg class="icon icon-file-play"><use xlink:href="#icon-file-play"></use></svg>
              Details
            </button>
          </a>
          <span class="playlist--tags" v-show="playlist.tags">
            <span v-for="tag in playlist.tags">
              <span class="tag" @click="addToSearch(tag)">#{{tag}}</span>
            </span>
          </span>
        </div>
      </transition-group>
    </div>
    <div v-else>Loading...</div>
    <symbol id="icon-file-play" viewBox="0 0 32 32">
      <title>file-play</title>
      <path d="M12 12l10 7-10 7v-14z"></path>
      <path d="M28.681 7.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-15.5c-1.378 0-2.5 1.121-2.5 2.5v27c0 1.378 1.122 2.5 2.5 2.5h23c1.378 0 2.5-1.122 2.5-2.5v-19.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 5.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-23c-0.271 0-0.5-0.229-0.5-0.5v-27c0-0.271 0.229-0.5 0.5-0.5 0 0 15.499-0 15.5 0v7c0 0.552 0.448 1 1 1h7v19.5z"></path>
    </symbol>
    <symbol id="icon-cloud-upload" viewBox="0 0 32 32">
      <title>cloud-upload</title>
      <path d="M27.883 12.078c0.076-0.347 0.117-0.708 0.117-1.078 0-2.761-2.239-5-5-5-0.444 0-0.875 0.058-1.285 0.167-0.775-2.417-3.040-4.167-5.715-4.167-2.73 0-5.033 1.823-5.76 4.318-0.711-0.207-1.462-0.318-2.24-0.318-4.418 0-8 3.582-8 8s3.582 8 8 8h4v6h8v-6h7c2.761 0 5-2.239 5-5 0-2.46-1.777-4.505-4.117-4.922zM18 20v6h-4v-6h-5l7-7 7 7h-5z"></path>
    </symbol>
    <symbol id="icon-search" viewBox="0 0 32 32">
      <title>search</title>
      <path d="M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"></path>
    </symbol>
  </div>
</template>

<script>
import Firebase from './firebaseMixin.js'
import SpotifyMixin from './spotifyMixin.js'
import debounce from 'lodash/debounce'

export default {
  name: 'ListPlaylists',
  data() {
    return {
      loaded: false,
      placeholder: '../static/artplaceholder.png',
      playlistRef: null,
      playlists: [],
      search: '',
      showAll: false,
      spotifyBadge: '../static/spotifyBadge.svg',
      tags: []
    }
  },
  mixins: [SpotifyMixin],
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('resize', this.updateLayout)
    if (this.playlistRef) {
      this.playlistRef.off('child_added');
    }
    next();
  },
  mounted() {
    this.getPlaylists();
    window.addEventListener('resize', this.updateLayout, false);
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
    updateLayout: debounce(() => {
      var tags = document.getElementById('playlist-tags');
      var showAll = document.getElementById('playlist-show-all');
      // var buttons = document.getElementsByClassName('wave--scroll-button')
      if (tags.offsetHeight > 51 || tags.offsetHeight === 50) {
        showAll.style.display = 'block';
        tags.classList.add('hidden-tags');
      } else {
        showAll.style.display = 'none';
        tags.classList.remove('hidden-tags');
      }
    }, 100),
    showTags() {
      document.getElementById('playlist-show-all').style.display = 'none';
      document.getElementById('playlist-tags').classList.remove('hidden-tags');
    },
    getPlaylists() {
      this.playlistRef = Firebase.database().ref('playlists/');
      this.playlistRef.orderByChild('date_added').on('child_added', snapshot => {
        let childData = snapshot.val();
        childData.id = snapshot.key;
        childData.imgUrl = this.placeholder;
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
        if (snapshot.exists()) {
          this.tags = Object.keys(snapshot.val());
          this.updateLayout();
          this.loaded = true;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/colors.scss";

.hidden-tags {
  overflow-y: hidden;
  max-height: 50px;
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

.playlist--uploader {
  display: block;
  margin-bottom: 2px;
}

.playlist--search-container {
  position: relative;
}

.playlist--search {
  padding: 5px;
  margin: 10px;
  width: 60%;
  @media screen and (max-width: $break-tablet) {
    width: 90%;
  }
}

.playlist--tags {
  @media screen and (max-width: $break-tablet) {
    display: block;
    margin-top: -10px;
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

.icon-search {
  font-size: 24px;
  position: absolute;
  right: 20%;
  top: 15px;
  @media screen and (max-width: $break-tablet) {
    right: 5%;
  }
}

.icon-cloud-upload {
    display: inline-block;
    margin-bottom: -4px;
    margin-right: 4px;
}
</style>
