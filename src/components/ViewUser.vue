<template>
  <div class="view-user">
    <div v-if="displayName">
      <div class="view-user--profile-pic" :style="cssObject(imgUrl || placeholder)"/>
      <h1 v-show="displayName" class="view-user--name">{{ displayName }}</h1>
      <div v-show="ownProfile && displayName" class="view-user--logout" @click="logout">
        <svg class="icon icon-exit"><use xlink:href="#icon-exit"></use></svg>
        <a>Logout</a>
      </div>
      <div class="view-user--playlists" v-show="playlists.length !== 0">
        <h2>Playlists</h2>
        <small>Showing {{ topPlaylists.length }} of {{ playlists.length }}</small>
        <transition-group class="playlist--all-containers" name="fade">
          <div class="playlist--container" v-for="playlist in topPlaylists" :key="playlist.id">
        <!-- {{ playlist }} -->
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
          </div>
        </transition-group>
        <button class="btn btn--main show-all" :key="'btn'" @click="limit = 100">Show all Playlists</button>
      </div>
      <div class="user--friend-list">
        <h2>Friends</h2>
        <list-users :friendList="friendsArr" :remove="ownProfile" :search="false" v-on:userClicked="removeFriend"></list-users>
      </div>
      <div class="user--history">
        <h2>Wave History</h2>
        <div v-if="waveHistory.length !== 0" class="user--all-songs">
          <div class="user--song-container" v-for="wave in waveHistory">
            <h4 class="user--song">{{wave.song_artist}} - {{wave.song_title}}</h4>
            <div class="user--preview-service-container">
              <div class="btn btn--main user--preview" @click="playAudio(wave.preview_url, $event)">
                Preview
              </div>
              <a :href="wave.url"> <img class="user--service" :src="wave.service === 'itunes' ? itunesBadge : spotifyBadge"></a>
            </div>
            <div class="user--song-date">(Added: {{convertTime(wave.date_added)}})</div>
          </div>
        </div>
        <div class="user--no-wave" v-else>
          No previous Waves :(
        </div>
      </div>
      <div class="view-user--delete-container">
        <button v-show="ownProfile && displayName" class="btn btn--secondary view-user--delete" @click="deleteClicked = true">
          <svg class="icon icon-exit"><use xlink:href="#icon-bin"></use></svg>
          <a>Delete Profile</a>
        </button>
      </div>
      <delete-popup v-show="deleteClicked" v-on:close="deleteClicked = false">
        <h3 slot="header">Are you sure?</h3>
        <small slot="header">(This cannot be undone)</small>
        <button slot="body" class="btn btn--main"  @click="deleteProfile">
          Yes, Delete my Profile
        </button>
      </delete-popup>
    </div>
    <div v-else>Loading...</div>
    <symbol id="icon-exit" viewBox="0 0 32 32">
      <title>exit</title>
      <path d="M24 20v-4h-10v-4h10v-4l6 6zM22 18v8h-10v6l-12-6v-26h22v10h-2v-8h-16l8 4v18h8v-6z"></path>
    </symbol>
    <symbol id="icon-play3" viewBox="0 0 32 32">
      <title>play3</title>
      <path d="M6 4l20 12-20 12z"></path>
    </symbol>
    <symbol id="icon-stop2" viewBox="0 0 32 32">
      <title>stop2</title>
      <path d="M4 4h24v24h-24z"></path>
    </symbol>
    <symbol id="icon-file-play" viewBox="0 0 32 32">
      <title>file-play</title>
      <path d="M12 12l10 7-10 7v-14z"></path>
      <path d="M28.681 7.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-15.5c-1.378 0-2.5 1.121-2.5 2.5v27c0 1.378 1.122 2.5 2.5 2.5h23c1.378 0 2.5-1.122 2.5-2.5v-19.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 5.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-23c-0.271 0-0.5-0.229-0.5-0.5v-27c0-0.271 0.229-0.5 0.5-0.5 0 0 15.499-0 15.5 0v7c0 0.552 0.448 1 1 1h7v19.5z"></path>
    </symbol>
    <symbol id="icon-bin" viewBox="0 0 32 32">
      <title>bin</title>
      <path d="M4 10v20c0 1.1 0.9 2 2 2h18c1.1 0 2-0.9 2-2v-20h-22zM10 28h-2v-14h2v14zM14 28h-2v-14h2v14zM18 28h-2v-14h2v14zM22 28h-2v-14h2v14z"></path>
      <path d="M26.5 4h-6.5v-2.5c0-0.825-0.675-1.5-1.5-1.5h-7c-0.825 0-1.5 0.675-1.5 1.5v2.5h-6.5c-0.825 0-1.5 0.675-1.5 1.5v2.5h26v-2.5c0-0.825-0.675-1.5-1.5-1.5zM18 4h-6v-1.975h6v1.975z"></path>
    </symbol>
  </div>
</template>

<script>
import Firebase from './firebaseMixin.js'
import SpotifyMixin from './spotifyMixin.js'
import { EventBus } from './eventBus.js';
import Modal from './Modal.vue'
import ListUsers from './ListUsers.vue'
import VueNotifications from 'vue-notifications'

export default {
  name: 'ViewUser',
  data() {
    return {
      artPlaceholder: '../static/artplaceholder.png',
      audioObject: null,
      deleteClicked: false,
      displayName: false,
      friendsArr: [],
      limit: 3,
      imgUrl: false,
      ownProfile: false,
      placeholder: '../static/placeholder.png',
      playlists: [],
      playlistIds: [],
      user: '',
      userRef: '',
      waveHistory: [],
      itunesBadge: '../static/itunes.svg',
      spotifyBadge: '../static/spotifyBadge.svg'
    }
  },
  mixins: [SpotifyMixin],
  mounted() {
    this.getUrlParam();
  },
  beforeDestroy() {
    this.ifPlayingPause();
  },
  computed: {
    topPlaylists() {
      return this.playlists.slice(0, this.limit);
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.params.user !== to.params.user) {
        this.waveHistory = [];
        this.playlists = [];
        this.limit = 3;
        this.getUrlParam();
        this.ifPlayingPause();
      }
    }
  },
  methods: {
    getUrlParam() {
      this.user = this.$route.params.user;
      this.getUserDetails();
    },
    getUserDetails() {
      let unsubscribe = Firebase.auth().onAuthStateChanged(user => {
        if (this.user === user.uid.replace(/\%2E/g, '.')) {
          this.imgUrl = user.photoURL;
          this.ownProfile = true;
        } else {
          this.ownProfile = false;
        }
        this.getWave();
        this.getPlaylists();
        unsubscribe();
      });
      this.userRef = Firebase.database().ref(`users/${this.user.replace(/\./g, '%2E')}`);
      this.userRef.once('value')
      .then(snapshot => {
        if (!this.ownProfile) {
          this.imgUrl = snapshot.child('img_url').exists() ? snapshot.val().img_url : null;
        }
        this.displayName = snapshot.val().display_name;
        if (snapshot.child('friends').exists()) {
          this.friendsArr = Object.keys(snapshot.val().friends).map((k) => k)
        } else {
          this.friendsArr = [];
        }
      })
    },
    getWave() {
      let waveRef = Firebase.database().ref(`wave/${this.user.replace(/\./g, '%2E')}`)
      waveRef.orderByChild(`date_added`).on('child_added', snapshot => {
        this.waveHistory.unshift(snapshot.val());
      })
    },
    getPlaylists() {
      console.log(this.user);
      let safeUser = this.user.replace(/\./g, '%2E');
      this.playlistIds = [];
      let userRef = Firebase.database().ref(`users/${safeUser}/playlists`)
      userRef.once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          this.playlistIds = Object.keys(snapshot.val());
          this.playlistIds.forEach(id => {
            let playlistRef = Firebase.database().ref(`playlists/${id}`)
            playlistRef.once('value')
            .then(snapshot => {
              console.log('here');
              let childData = snapshot.val();
              childData.id = snapshot.key;
              childData.imgUrl = this.artPlaceholder;
              this.playlists.unshift(childData);
              this.getPlaylistDetails(snapshot.key, childData)
            })
          })
        }
      })
      // this.$forceUpdate();
    },
    getPlaylistDetails(id, playlist) {
      const options = {
        user: playlist.owner,
        playlist: id,
        fields: 'images'
      }
      this.getSinglePlaylist(options, callback => {
        console.log(callback);
        if (callback.images) {
          playlist.imgUrl = callback.images[1] ? callback.images[1].url : callback.images[0].url;
        } else {
          playlist.imgUrl = this.placeholder;
        }
      });
    },
    playAudio(url, e) {
      let target = e.target;
      if (target.classList.contains('playing')) {
        this.audioObject.pause();
      } else {
        if (this.audioObject) {
          this.audioObject.pause();
        }
        this.audioObject = new Audio(url);
        this.audioObject.play();
        target.classList.add('playing');
        target.innerHTML = 'Playing';
        this.audioObject.addEventListener('ended', () => {
          target.classList.remove('playing');
          target.innerHTML = 'Playing';
        });
        this.audioObject.addEventListener('pause', () => {
          target.classList.remove('playing');
          target.innerHTML = 'Preview';
        });
      }
    },
    removeFriend(user) {
      let index = this.friendsArr.indexOf(user.id);
      let safeUser = this.user.replace(/\./g, '%2E');
      let safeFriend = user.id.replace(/\./g, '%2E');
      if (index !== -1) {
        Firebase.database().ref(`users/${safeUser}/friends/${safeFriend}`).remove();
        this.friendsArr.splice(index, 1);
        VueNotifications.error({message: `Unfollowed ${user.display_name}`});
      }
    },
    deleteProfile() {
      let updatedUserData = {};
      let allTags = [];
      let safeId = this.safe(this.user);
      this.playlists.forEach(playlist => {
        // console.log(playlist.id);
        allTags[playlist.id] = playlist.tags;
        // console.log(allTags);
      })
      for (let key in allTags) {
        let obj = allTags[key];
        for (let val in obj) {
          updatedUserData[`tags/${obj[val]}/${key}`] = null;
        }
      }
      this.playlistIds.forEach(id => {
        updatedUserData[`playlists/${id}`] = null;
      })
      updatedUserData[`wave/${safeId}`] = null;
      updatedUserData[`users/${safeId}`] = null;
      console.log(updatedUserData);
      Firebase.database().ref().update(updatedUserData, (error) => {
        if (error) {
          VueNotifications.error({message: 'Something went wrong, please try again'})
          console.log('Error updating data:', error);
        } else {
          let user = Firebase.auth().currentUser;
          user.delete().then(() => {
            this.logout();
            VueNotifications.error({message: 'Profile Deleted'})
            this.$router.push(`/`);
          }, function(error) {
            console.log(error);
          });
        }
      });
      // Object.keys(allTags).forEach(tag => {
      //   console.log(tag);
      //   // updatedUserData[`tags/${tag}/`]
      // })
      // Firebase.database().ref('tags/').once('value')

      // allTags = [].concat(allTags);

      // Firebase.database().ref('tags/').once('value')
      // .then(snapshot => {
      //   console.log(snapshot.val());
      //   Object.values(snapshot.val()).forEach(tag => {
      //     console.log(tag + '/' + Object.keys(tag));
      //   })
      // })
      // // let playlistsRef = Firebase.database().ref('users/${safeId}/playlists');
      // let updatedUserData = {};

      // // updatedUserData[`tags/${tag}/${this.playlistId}`] = true;
      // updatedUserData[`playlists/${this.playlistId}`] = {
      //   date_added: new Date().getTime(),
      //   tags: this.tags,
      //   title: this.playlistName,
      //   owner: this.ownerId,
      //   owner_name: this.ownerName,
      //   uploader: this.uploader,
      //   uploader_name: this.uploaderName
      // };
      // updatedUserData[`users/${safeUploader}/playlists/${this.playlistId}`] = true;
      // // Do a deep-path update
    },
    safe(id) {
      return id.replace(/\./g, '%2E');
    },
    logout() {
      EventBus.$emit('logout');
    },
    cssObject(img) {
      return {
        background: `url(${img}) top/cover no-repeat`
      }
    },
    convertTime(epoch) {
      let date = new Date(epoch);
      return date.toLocaleDateString('en-GB');
    },
    ifPlayingPause() {
      if (this.audioObject) {
        this.audioObject.pause();
      }
    },
    shareWaveLink(id) {
      return `/#/playlist/${id}`;
    },
    createSpotifyLink(user, id) {
      return `spotify:user:${user}:playlist:${id}`;
    }
  },
  components: {
    'list-users': ListUsers,
    'delete-popup': Modal
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../assets/sass/colors.scss";

.show-all {
  display: block;
  margin: auto;
}

.user--friend-list {
  float: left;
  width: 49%;
  @media screen and (max-width: $break-tablet) {
    width: 100%;
  }
}

.icon-exit {
  display: inline-block;
  margin-bottom: -3px;
}

.icon-play3,
.icon-stop2 {
  pointer-events: none;
}

.view-user {
  margin-top: 10px;
}

.view-user--profile-pic {
  border-radius: 50%;
  height: 150px;
  margin: auto;
  width: 150px;
}

.view-user--logout {
  color: black;
  cursor: pointer;
  margin: 12px 0;
  transition: 0.25s;
}

.view-user--delete-container {
  float: right;
  margin: 12px auto;
  width: 100%;
}

.view-user--logout:hover {
  color: red;
}

.view-user--delete:hover {
  background-color: red;
}

.user--history {
  width: 49%;
  float: right;
  @media screen and (max-width: $break-tablet) {
    width: 100%;
  }
}

.user--all-songs {
}

.user--song-container {
  padding: 5px 0;
}
.user--song-container:nth-child(odd) {
  background: $light-grey;
}

.user--preview-service-container {
  height: 40px;
  margin: auto;
  width: 200px;
}

.user--preview {
  float: right;
}

.user--preview {
  float: left;
}

.user--service {
  width: 100px;
}

.user--no-wave {
  font-size: 24px;
}

.user--preview,
.user--service {
  // color: white;
  display: inline-block;
}
</style>
