<template>
  <div class="view-playlist">
    <span v-if="uploader">
      <div>
        <div class="view-playlist--cover-container">
          <img class="view-playlist--cover" v-bind:src="imgUrl ? imgUrl : placeholder">
          <small v-show="ownerName" class="view-playlist--created">Created by - {{ownerName}}</small>
        </div>
        <div>
          <div class="view-playlist--details-container">
            <h3 class="view-playlist--name-span"> {{ title }}</h3>
            <p>Uploaded: {{ dateAdded }}</p>
            <p>Uploaded By: {{ uploader }}</p>
            <p>Created By: {{ ownerName }}</p>
            <div class="upload-playlist--tags">
            <span>Tags</span>
              <span v-for="tag in tags">
                <div class="tag" @click="removeTag(tag)">#{{tag}}</div>
              </span>
            </div>
            <a v-bind:href="createSpotifyLink(ownerId, playlistUri)"><img class="playlist--spotify" :src="spotifyBadge"></a>
            <a class="view-playlist--delete" @click="deleteClicked = true" v-show="ownPlaylist">
              <button class="btn btn--secondary"><svg class="icon icon-bin"><use xlink:href="#icon-bin"></use></svg>
              Delete Playlist from ShareWave
              </button>
            </a>
          </div>
        </div>
      </div>
    </span>
    <div v-else>
      <p>Loading...</p>
    </div>
    <delete-popup v-show="deleteClicked" v-on:close="deleteClicked = false">
      <h3 slot="header">Are you sure?</h3>
        <button slot="body" class="btn btn--main"  @click="deletePlaylist">
          Delete
        </button>
    </delete-popup>
    <symbol id="icon-bin" viewBox="0 0 32 32">
      <title>bin</title>
      <path d="M4 10v20c0 1.1 0.9 2 2 2h18c1.1 0 2-0.9 2-2v-20h-22zM10 28h-2v-14h2v14zM14 28h-2v-14h2v14zM18 28h-2v-14h2v14zM22 28h-2v-14h2v14z"></path>
      <path d="M26.5 4h-6.5v-2.5c0-0.825-0.675-1.5-1.5-1.5h-7c-0.825 0-1.5 0.675-1.5 1.5v2.5h-6.5c-0.825 0-1.5 0.675-1.5 1.5v2.5h26v-2.5c0-0.825-0.675-1.5-1.5-1.5zM18 4h-6v-1.975h6v1.975z"></path>
    </symbol>
  </div>
<!--

      <div class="upload-playlist--details-container">
        <span v-if="ownPlaylist">
          <h4>Name: </h4>
          <span class="upload-playlist--icon-container">
            <input class="upload-playlist--name-input input-box" v-model="playlistName">
            <transition name="fade">
              <svg @click="resetChanges" v-show="resetButton" class="icon icon-undo"><use xlink:href="#icon-undo"></use></svg>
            </transition>
          </span>
          <small class="help is-danger"> Note: Changes to the name will be reflected in Spotify</small>
        </span>

        <div>
          <h4 class="upload-playlist--tags-span">Tags: </h4>
          <small>Enter as many tags as you'd like</small>
          <span class="upload-playlist--icon-container">
          <input class="upload-playlist--name-input input-box" name="tags" placeholder="Tag..." @keyup.enter="addTag" v-bind:class="{ 'padding-right': addButton }" v-model="tag">
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
    </div> -->
</template>

<script>
import SpotifyMixin from './spotifyMixin.js'
import Firebase from './firebaseMixin.js'
import VueNotifications from 'vue-notifications'
import Modal from './Modal.vue'

export default {
  name: 'Home',
  data() {
    return {
      dateAdded: '',
      deleteClicked: false,
      ownPlaylist: false,
      imgUrl: '',
      ownerId: '',
      ownerName: '',
      tags: [],
      title: '',
      uploader: '',
      user: '',
      placeholder: '../static/artplaceholder.png',
      playlistRef: '',
      playlistUri: '',
      spotifyBadge: '../static/spotifyBadge.svg'
    }
  },
  mixins: [SpotifyMixin],
  components: {
    'delete-popup': Modal
  },
  mounted() {
    this.getUser();
    this.getUrlParam();
    this.getPlaylistDetails();
    this.convertTime();
  },
  methods: {
    getUser() {
      let unsubscribe = Firebase.auth().onAuthStateChanged(user => {
        if (user === null) {
          // Not logged in
        } else {
          console.log()
          this.user = user.uid.replace(/\%2E/g, '.');
          unsubscribe();
        }
      });
    },
    getUrlParam() {
      this.playlistUri = this.$route.params.playlist;
    },
    getPlaylistDetails() {
      this.playlistRef = Firebase.database().ref(`playlists/${this.playlistUri}`);
      this.playlistRef.once('value')
        .then(snapshot => {
          this.dateAdded = this.convertTime(snapshot.val().date_added);
          this.ownerId = snapshot.val().owner;
          this.ownerName = snapshot.val().owner_name
          this.title = snapshot.val().title;
          this.tags = snapshot.val().tags;
          this.uploader = snapshot.val().uploader_name.replace(/\%2E/g, '.');
          if (this.user === this.uploader) { this.ownPlaylist = true };
          this.getPlaylistImage();
        })
    },
    convertTime(epoch) {
      let date = new Date(epoch);
      return date.toLocaleDateString('en-GB');
    },
    getPlaylistImage() {
      const options = {
        user: this.ownerId,
        playlist: this.playlistUri,
        fields: 'images'
      }
      this.getSinglePlaylist(options, callback => {
        this.imgUrl = callback.images[1] ? callback.images[1].url : callback.images[0].url;
      });
    },
    deletePlaylist() {
      if (this.tags) {
        let updates = {}
        this.tags.forEach(tag => {
          updates[`${tag}/${this.playlistUri}`] = null;
        })
        Firebase.database().ref('tags/').update(updates);
      }
      this.playlistRef.remove();
      VueNotifications.error({message: `Playlist deleted from ShareWave`});
      this.$router.push(`/allPlaylists`);
    },
    createSpotifyLink(user, id) {
      return `spotify:user:${user}:playlist:${id}`;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../assets/sass/colors.scss";

.view-playlist {
  padding-top: 20px;
}

.view-playlist--cover-container {
  float: left;
  padding-left: 20%;
  @media screen and (max-width: $break-tablet) {
    padding: 0;
    width: 100%;
  }
}

.view-playlist--details-container {
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

.view-playlist--created {
  display: block;
  padding-bottom: 12px;
}

.view-playlist--cover {
  width: 300px;
}

.view-playlist--delete {
  cursor: pointer;
  text-decoration: none;
}

</style>
