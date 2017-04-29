<template>
  <div class="view-user">
    <div class="view-user--profile-pic" :style="cssObject(imgUrl || placeholder)"/>
    <h1 v-show="displayName" class="view-user--name">{{ displayName }}</h1>
    <div v-show="ownProfile && displayName" class="view-user--logout" @click="logout">
      <svg class="icon icon-exit"><use xlink:href="#icon-exit"></use></svg>
      <a>Logout</a>
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
            <img class="user--service" :src="wave.service === 'itunes' ? itunesBadge : spotifyBadge">
          </div>
          <div class="user--song-date">(Added: {{convertTime(wave.date_added)}})</div>
        </div>
      </div>
      <div class="user--no-wave" v-else>
        No previous Waves :(
      </div>
    </div>
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
  </div>
</template>

<script>
import Firebase from './firebaseMixin.js'
import ListUsers from './ListUsers.vue'
import { EventBus } from './eventBus.js';
import VueNotifications from 'vue-notifications'

export default {
  name: 'ViewUser',
  data() {
    return {
      displayName: false,
      friendsArr: [],
      imgUrl: false,
      ownProfile: false,
      placeholder: '../static/placeholder.png',
      user: '',
      userRef: '',
      waveHistory: [],
      itunesBadge: '../static/itunes.svg',
      spotifyBadge: '../static/spotifyBadge.svg'
    }
  },
  beforeMount() {
    this.getUrlParam();
  },
  watch: {
    '$route' (to, from) {
      if (from.params.user !== to.params.user) {
        this.waveHistory = [];
        this.getUrlParam();
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
      if (this.waveHistory.length === 0) { }
    },
    playAudio: function(url, e) {
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
        this.audioObject.addEventListener('ended', function () {
          target.classList.remove('playing');
          target.innerHTML = 'Playing';
        });
        this.audioObject.addEventListener('pause', function () {
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
        VueNotifications.error({message: `Removed ${user.display_name} from friends`});
      }
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
    }
  },
  components: {
    'list-users': ListUsers
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../assets/sass/colors.scss";

.user--friend-list {
  float: left;
  width: 49%;
  @media screen and (max-width: $break-tablet) {
    width: 100%;
  }
}

.icon-exit {
  margin-top: -4px;
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
  margin-bottom: 20px;
  transition: 0.25s;
}

.view-user--logout:hover {
  color: red;
}

.user--history {
  padding-top: 12px;
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
.user--song-container:nth-child(even) {
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
