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
            <h2 class="view-playlist--name-span"> {{ title }}</h2>
            <p>Uploaded By: <a class="view-playlist--uploader" :href="'/#/user/' + uploaderId">{{ uploader }}</a></p>
            <p>Uploaded Date: {{ dateAdded }}</p>
            <div class="upload-playlist--tags">
            <span v-show="tags">Tags</span>
              <span v-for="tag in tags">
                <div class="tag">#{{tag}}</div>
              </span>
            </div>
            <a class="inline" v-bind:href="createSpotifyLink(ownerId, playlistUri)"><img class="playlist--spotify" :src="spotifyBadge"></a>
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
</template>

<script>
import SpotifyMixin from './spotifyMixin.js'
import Firebase from './firebaseMixin.js'
import VueNotifications from 'vue-notifications'
import Modal from './Modal.vue'

export default {
  name: 'ViewPlaylist',
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
      uploaderId: '',
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
          this.uploaderId = snapshot.val().uploader.replace(/\%2E/g, '.');
          if (this.user === this.uploaderId) { this.ownPlaylist = true };
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

.playlist--spotify {
  display: inline-block;
  padding-top: 14px;
  text-align: left;
  width: 150px;
}

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
  padding-left: 20px;
  position: relative;
  text-align: left;
  width: calc(60% - 320px);
  min-width: 250px;
  @media screen and (max-width: $break-tablet) {
    text-align: center;
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
  bottom: 0;
  cursor: pointer;
  display: block;
  left: 16px;
  margin: auto;
  text-decoration: none;
  .btn {
    margin-top: 8px;
  }
}

.view-playlist--uploader {
  color: $logo-color;
  font-weight: bold;
  transition: 0.3s;
}

.view-playlist--uploader:hover {
  color: $play-color;
}

</style>
