<template>
  <div class="upload-playlist">
    <h3>Upload a Playlist</h3>
    <div v-if="loading">
      <h3> Loading... </h3>
    </div>
    <div v-else>
      <img class="upload-playlist--cover" v-bind:src="imgUrl ? imgUrl : placeholder">
      <small class="upload-play--created"><p>Created by - {{owner}}</p></small>

      <span v-if="ownPlaylist">
        <span>Playlist Name: </span>
        <input class="upload-playlist--name-input" v-bind:class="{ 'padding-right': resetButton }" v-model="playlistName">
        <span class="upload-playlist--icon-container">
          <transition name="fade">
            <svg @click="resetChanges" v-show="resetButton" class="icon icon-undo"><use xlink:href="#icon-undo"></use></svg>
          </transition>
          <symbol id="icon-undo" viewBox="0 0 32 32">
            <title>undo</title>
            <path d="M32 12h-12l4.485-4.485c-2.267-2.266-5.28-3.515-8.485-3.515s-6.219 1.248-8.485 3.515c-2.266 2.267-3.515 5.28-3.515 8.485s1.248 6.219 3.515 8.485c2.267 2.266 5.28 3.515 8.485 3.515s6.219-1.248 8.485-3.515c0.189-0.189 0.371-0.384 0.546-0.583l3.010 2.634c-2.933 3.349-7.239 5.464-12.041 5.464-8.837 0-16-7.163-16-16s7.163-16 16-16c4.418 0 8.418 1.791 11.313 4.687l4.687-4.687v12z"></path>
          </symbol>
        </span>
        <span class="help is-danger"> Note: Changes made here will be reflected in Spotify</span>
      </span>

      <span v-else>
        <span class="upload-playlist--name-span"> {{ playlistName }}</span>
        <!-- <span class="help is-danger">Playlist names can only be changed if you own them</span> -->
      </span>

      <div>
        <span>Tags: </span>
        <input class="upload-playlist--name-input" name="tags" @keyup.enter="addTag" v-bind:class="{ 'padding-right': addButton }" v-model="tag">
        <span class="upload-playlist--icon-container">
          <transition name="fade">
            <svg class="icon icon-plus" @clicked="addTag" v-show="addButton"><use xlink:href="#icon-plus"></use></svg>
          </transition>
          <symbol id="icon-plus" viewBox="0 0 32 32">
          <title>plus</title>
          <path d="M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z"></path>
          </symbol>
        </span>
      </div>

      <div class="upload-playlist--tags">
        <span v-for="tag in tags">
          <div>{{tag}}</div>
        </span>
        <span v-show="errorMessage">{{ errorMessage }}</span>
      </div>

      <a class="upload-playlist--button" @click="addToDatabase"> Upload </a>
    </div>
  </div>
</template>

<script>
import SpotifyMixin from './spotifyMixin.js'
import Firebase from './firebaseMixin.js'
import VueNotifications from 'vue-notifications'

export default {
  name: 'UserPlaylists',
  data () {
    return {
      addButton: false,
      errorMessage: false,
      loading: false,
      imgUrl: '',
      originalPlaylistName: '',
      owner: '',
      ownPlaylist: '',
      placeholder: '../static/artplaceholder.png',
      playlistName: '',
      playlistId: '',
      resetButton: false,
      tag: '',
      tags: [],
      uploader: ''
    }
  },
  mixins: [SpotifyMixin],
  mounted() {
    this.getUser();
    this.loading = true;
    // https://developer.spotify.com/web-api/console/get-users-profile/#complete
    this.owner = this.$route.params.user;
    this.playlistId = this.$route.params.playlist;
    this.getPlaylist()
  },
  watch: {
    playlistName: function () {
      if (this.playlistNameChanged()) {
        this.resetButton = true;
      } else {
        this.resetButton = false;
      }
    },
    tag() {
      if (this.tag === '') {
        this.addButton = false;
      } else {
        this.addButton = true;
      }
    }
  },
  methods: {
    getUser() {
      let unsubscribe = Firebase.auth().onAuthStateChanged(user => {
        if (user === null) {
          // Not logged in
        } else {
          this.uploader = user.uid;
          this.ownPlaylist = this.isOwnPlaylist();
          unsubscribe();
        }
      });
    },
    getPlaylist() {
      let fields = 'name,images';
      let options = {user: this.owner, playlist: this.playlistId, fields: fields};
      this.getSinglePlaylist(options, callback => {
        this.loading = false;
        console.log(callback);
        this.imgUrl = (callback.images ? callback.images[0].url : null);
        this.playlistName = callback.name;
        this.originalPlaylistName = callback.name;
      });
    },
    resetChanges: function() {
      this.playlistName = this.originalPlaylistName;
    },
    isOwnPlaylist: function() {
      // Only update playlist if owned by them
      let safeOwner = this.owner.replace(/\./g, '%2E')
      return this.uploader === safeOwner;
    },
    playlistNameChanged: function() {
      return this.playlistName !== this.originalPlaylistName;
    },
    addTag() {
      let reg = new RegExp(/\/|\$|\#|\.|\[|\]/);
      if (reg.test(this.tag)) {
        this.errorMessage = 'Tags cannot contain ".", "#", "$", "/", "[", or "]"';
      } else {
        this.tags.push(this.tag.toLowerCase());
        this.tag = '';
        this.errorMessage = false;
      }
    },
    addToDatabase: function() {
      if (this.ownPlaylist && this.playlistNameChanged()) {
        this.updatePlaylistName(this.owner, this.playlistId, this.playlistName, function(callback) {
          console.log(callback);
        });
      }
      // https://firebase.googleblog.com/2015/09/introducing-multi-location-updates-and_86.html
      if (this.tags.length !== 0) {
        let updates = {}
        this.tags.forEach(tag => {
          updates[`${tag}/${this.playlistId}`] = true;
        });
        console.log(updates);
        Firebase.database().ref('tags/').update(updates);
        // Firebase.database().ref('tags/' + this.tags[0]).update(obj);
      }
      // Also add to user database, keep list of playlists
      Firebase.database().ref('playlists/' + this.playlistId).set({
        date_added: new Date().getTime(),
        tags: this.tags,
        title: this.playlistName,
        owner: this.owner,
        uploader: this.uploader
      })
      .then(() => {
        VueNotifications.success({message: 'Playlist uploaded'});
        this.$router.push(`/allPlaylists`);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/colors.scss";

.icon-undo {
  color: red;
  cursor: pointer;
  width: 12px;
  height: 12px;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  position: absolute;
  top: 6px;
  right: 7px;
}

.icon-plus {
  cursor: pointer;
  width: 12px;
  height: 12px;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  position: absolute;
  top: 6px;
  right: 7px;
}

.padding-right {
  // Temporary, try to remove if possible
  padding-right: 20px !important;
  width: 165px !important;
}

.upload-play--created {
  display: block;
}

.upload-playlist--cover {
  width: 300px;
}

.upload-playlist--icon-container {
  position: relative;
}

.upload-playlist--name-input {
  font-size: 12px;
  margin-bottom: 5px;
  padding: 5px;
  width: 180px;
}

.upload-playlist--name-span {
  display: inline-block;
  margin-bottom: 10px;
}

.upload-playlist--button {
  display: block;
  margin: auto;
  border: 2px solid $play-color;
  border-radius: 5px;
  color: $logo-color;
  cursor: pointer;
  display: block;
  padding: 10px;
  margin: auto;
  text-decoration: none;
  width: 200px;
}

.upload-playlist--button:hover {
  color: $play-color;
}

</style>