<template>
  <div class="upload-playlist">
    <div v-if="loading">
      <h3> Loading... </h3>
    </div>
    <div v-else>
      <div class="upload-playlist--cover-container">
        <img class="upload-playlist--cover" v-bind:src="imgUrl ? imgUrl : placeholder">
      </div>
      <div class="upload-playlist--details-container">
        <span v-if="ownPlaylist">
          <h4>Name: </h4>
          <span class="upload-playlist--icon-container">
            <input class="upload-playlist--name-input input-box" v-model="playlistName">
            <transition name="fade">
              <svg @click="resetChanges" v-show="resetButton" class="icon icon-undo"><use xlink:href="#icon-undo"></use></svg>
            </transition>
          </span>
          <span class="help is-danger"> Note: Changes to the name will be reflected in Spotify</span>
        </span>

        <span v-else>
          <h3 class="upload-playlist--name-span"> {{ playlistName }}</h3>
        </span>

        <small v-show="ownerName" class="upload-playlist--created">Created by - {{ownerName}}</small>

        <div>
          <h4 class="upload-playlist--tags-span">Tags: </h4>
          <span class="upload-playlist--icon-container">
          <input class="upload-playlist--name-input input-box" name="tags" placeholder="Pop, Punk, 90s..." @keyup.enter="addTag" v-bind:class="{ 'padding-right': addButton }" v-model="tag">
            <transition name="fade">
              <svg class="icon icon-plus" v-show="addButton" @click="addTag"><use xlink:href="#icon-plus"></use></svg>
            </transition>
          </span>
        </div>

        <div class="upload-playlist--tags">
          <div v-show="errorMessage" class="help is-danger">{{ errorMessage }}</div>
          <span v-for="tag in tags">
            <div class="tag" @click="removeTag(tag)">#{{tag}}</div>
          </span>
        </div>
      <div class="inner">
        <a @click="addToDatabase">
          <button class="btn btn--main upload-playlist--button">
            <svg class="icon icon-cloud-upload"><use xlink:href="#icon-cloud-upload"></use></svg>
            Upload to ShareWave
          </button>
        </a>
        </div>
      </div>
    </div>
    <symbol id="icon-cloud-upload" viewBox="0 0 32 32">
      <title>cloud-upload</title>
      <path d="M27.883 12.078c0.076-0.347 0.117-0.708 0.117-1.078 0-2.761-2.239-5-5-5-0.444 0-0.875 0.058-1.285 0.167-0.775-2.417-3.040-4.167-5.715-4.167-2.73 0-5.033 1.823-5.76 4.318-0.711-0.207-1.462-0.318-2.24-0.318-4.418 0-8 3.582-8 8s3.582 8 8 8h4v6h8v-6h7c2.761 0 5-2.239 5-5 0-2.46-1.777-4.505-4.117-4.922zM18 20v6h-4v-6h-5l7-7 7 7h-5z"></path>
    </symbol>
    <symbol id="icon-undo" viewBox="0 0 32 32">
      <title>undo</title>
      <path d="M32 12h-12l4.485-4.485c-2.267-2.266-5.28-3.515-8.485-3.515s-6.219 1.248-8.485 3.515c-2.266 2.267-3.515 5.28-3.515 8.485s1.248 6.219 3.515 8.485c2.267 2.266 5.28 3.515 8.485 3.515s6.219-1.248 8.485-3.515c0.189-0.189 0.371-0.384 0.546-0.583l3.010 2.634c-2.933 3.349-7.239 5.464-12.041 5.464-8.837 0-16-7.163-16-16s7.163-16 16-16c4.418 0 8.418 1.791 11.313 4.687l4.687-4.687v12z"></path>
    </symbol>
    <symbol id="icon-plus" viewBox="0 0 32 32">
      <title>plus</title>
      <path d="M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z"></path>
    </symbol>
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
      ownerId: '',
      ownerName: '',
      ownPlaylist: '',
      placeholder: '../static/artplaceholder.png',
      playlistName: '',
      playlistId: '',
      resetButton: false,
      tag: '',
      tags: [],
      uploader: '',
      uploaderName: ''
    }
  },
  mixins: [SpotifyMixin],
  mounted() {
    this.loading = true;
    this.ownerId = this.$route.params.user;
    this.playlistId = this.$route.params.playlist;
    this.getLoggedInUser();
    this.getOwnerName();
    this.getPlaylist();
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
    getLoggedInUser() {
      let unsubscribe = Firebase.auth().onAuthStateChanged(user => {
        if (user === null) {
          // Not logged in
        } else {
          this.uploader = user.uid.replace(/\%2E/g, '.');
          this.ownPlaylist = this.isOwnPlaylist();
          this.getUploaderName();
          unsubscribe();
        }
      });
    },
    getPlaylist() {
      let fields = 'name,images';
      let options = {
        user: this.ownerId,
        playlist: this.playlistId,
        fields: fields
      };
      this.getSinglePlaylist(options, callback => {
        this.loading = false;
        this.imgUrl = (callback.images ? callback.images[0].url : null);
        this.playlistName = callback.name;
        this.originalPlaylistName = callback.name;
      });
    },
    getOwnerName() {
      this.getUser(this.ownerId, callback => {
        this.ownerName = callback.display_name || this.ownerId;
      })
    },
    getUploaderName() {
      this.getUser(this.uploader, callback => {
        this.uploaderName = callback.display_name || this.uploader;
      })
    },
    resetChanges: function() {
      this.playlistName = this.originalPlaylistName;
    },
    isOwnPlaylist: function() {
      // Only update playlist if owned by them
      return this.uploader === this.ownerId;
    },
    playlistNameChanged: function() {
      return this.playlistName !== this.originalPlaylistName;
    },
    addTag() {
      let reg = new RegExp(/\/|\$|\#|\.|\[|\]/);
      if (reg.test(this.tag)) {
        this.errorMessage = 'Tags cannot contain ".", "#", "$", "/", "[", or "]"';
      } else if (this.tag.trim().length === 0) {
        this.errorMessage = 'Please enter a tag'
        this.tag = '';
      } else if (this.tags.includes(this.tag)) {
        this.errorMessage = "Can't add the same tag twice"
      } else {
        this.tags.push(this.tag.trim().toLowerCase());
        this.tag = '';
        this.errorMessage = false;
      }
    },
    removeTag(tag) {
      let index = this.tags.indexOf(tag);
      this.tags.splice(index);
    },
    addToDatabase: function() {
      if (this.ownPlaylist && this.playlistNameChanged()) {
        this.updatePlaylistName(this.ownerId, this.playlistId, this.playlistName, function(callback) {
          console.log(callback);
        });
      }
      // https://firebase.googleblog.com/2015/09/introducing-multi-location-updates-and_86.html
      // Create the data we want to update
      let updatedUserData = {};
      if (this.tags.length !== 0) {
        this.tags.forEach(tag => {
          updatedUserData[`tags/${tag}/${this.playlistId}`] = true;
        });
      }
      updatedUserData[`playlists/${this.playlistId}`] = {
        date_added: new Date().getTime(),
        tags: this.tags,
        title: this.playlistName,
        owner: this.ownerId,
        owner_name: this.ownerName,
        uploader: this.uploader,
        uploader_name: this.uploaderName
      };
      let safeUploader = this.safe(this.uploader);
      updatedUserData[`users/${safeUploader}/playlists/${this.playlistId}`] = true;
      // Do a deep-path update
      Firebase.database().ref().update(updatedUserData, (error) => {
        if (error) {
          VueNotifications.error({message: 'Something went wrong, please try again'})
          console.log('Error updating data:', error);
        } else {
          VueNotifications.success({message: 'Playlist uploaded'});
          this.$router.push(`/allPlaylists`);
        }
      });
      // if (this.tags.length !== 0) {
      //   let updates = {}
      //   this.tags.forEach(tag => {
      //     updates[`${tag}/${this.playlistId}`] = true;
      //   });
      //   console.log(updates);
      //   Firebase.database().ref('tags/').update(updates);
      //   // Firebase.database().ref('tags/' + this.tags[0]).update(obj);
      // }
      // // Also add to user database, keep list of playlists
      // Firebase.database().ref('playlists/' + this.playlistId).set({
      //   date_added: new Date().getTime(),
      //   tags: this.tags,
      //   title: this.playlistName,
      //   owner: this.ownerId,
      //   owner_name: this.ownerName,
      //   uploader: this.uploader,
      //   uploader_name: this.uploaderName
      // })
      // .then(() => {
      // });
    },
    safe(id) {
      return id.replace(/\./g, '%2E');
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/colors.scss";

.upload-playlist {
  padding-top: 20px;
}

.upload-playlist--cover-container {
  float: left;
  padding-left: 20%;
  @media screen and (max-width: $break-tablet) {
    padding: 0;
    width: 100%;
  }
}

.upload-playlist--details-container {
  float: left;
  height: 300px;
  text-align: left;
  padding-left: 20px;
  position: relative;
  width: calc(60% - 320px);
  min-width: 250px;
  @media screen and (max-width: $break-tablet) {
    width: calc(100% - 50px);
  }
}

.inner {
  bottom: 0;
  position: absolute;
  width: calc(60%);
  @media screen and (max-width: $break-tablet) {
    text-align: center;
    padding-bottom: 20px;
    position: static;
    width: calc(100% + 12px);
  }
}

.tag:hover {
  color: red;
}

.icon {
  width: 20px;
  height: 20px;
  position: absolute;
}

.icon-undo {
  color: red;
}

.icon-plus,
.icon-undo {
  cursor: pointer;
  top: 0;
  right: 7px;
}

.icon-cloud-upload {
  bottom: 5px;
  left: 6px;
  height: 20px;
  width: 20px;
}

.upload-playlist--created {
  display: block;
  padding-bottom: 12px;
}

.upload-playlist--cover {
  width: 300px;
}

.upload-playlist--icon-container {
  position: relative;
}

.upload-playlist--name-input {
  margin-bottom: 5px;
  padding: 5px;
  width: 100%;
}

.upload-playlist--name-span {
  display: inline-block;
  margin-bottom: 10px;
}

.upload-playlist--button {
  margin-top: 12px;
  position: relative;
  padding-left: 30px;
  width: 235px;
}


</style>
