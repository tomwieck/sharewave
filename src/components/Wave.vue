<template>
  <div class="wave">
    <div class="wave-container--background">
      <div class="wave-container--all">
        <!-- v-show when complete variable? -->
        <div v-bind:class="{ 'my-wave': userId === value.id }" class="wave-container--user" v-for="(value, key) in waveSongs">
          <img class="wave--profile-pic" v-bind:class="{ 'wave-true': waveSongs[key].songs.length !== 0, 'wave-false': waveSongs[key].songs.length === 0}" @click="playWave($event, key)" :src="value.imgUrl || placeholderUrl">
          <span class="wave--name">{{ value.name }}</span>
          <!-- {{ key }} : {{ value }} -->
        </div>
      </div>
    </div>
    <div v-if="playing.title">
      <h3>Now Playing</h3>
      <div>
        <span>{{playing.title}} - {{playing.artist}}</span>
        <br>
        <a class="wave-playing--link" v-bind:href="playing.url">Open in {{correctCasing(playing.service)}}</a>
        <span v-if="userId === playing.ownerId">
          <div @click="deleteWave(playing.id)">
            <svg class="icon icon-bin"><use xlink:href="#icon-bin"></use></svg>
           </div>
        </span>
      </div>
    </div>
    <h3> Add Songs </h3>
    <div class="wave-add-songs--container">
      <a class="wave-add-songs--link" @click="searchClicked = !searchClicked">
        Search on Spotify and iTunes
      </a>
      <div v-if="searchClicked">
        <search v-on:addToWave="addToWave"></search>
      </div>
      <br>
      <a class="wave-add-songs--link" v-if="spotify" @click="spotifyRecentlyPlayed">
        See your recently played Spotify tracks
      </a>
      <div v-if="recentlyPlayedClicked">
        <div v-if="recentlyPlayed === []">
          Loading...
        </div>
        <div v-else>
          <transition-group name="fade">
            <div class="track-container" v-for="song in recentlyPlayed" :key="song.track.id">
              <span>{{ song.track.name }} - {{ song.track.artists[0].name }}</span>
              <span class="track-container--add" @click="addRecentToWave(song.track)"> Add to Wave </span>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
  <h3 class="wave-add-songs--link" @click="friendsClicked = !friendsClicked">Add Friends</h3>
  <div v-if="friendsClicked">
    <list-users v-on:userClicked="addFriend"></list-users>
  </div>
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
import ListUsers from './ListUsers.vue'
import Search from './Search.vue'
import VueNotifications from 'vue-notifications'

export default {
  name: 'Wave',
  data () {
    return {
      audioObject: null,
      imgUrl: '',
      friendsClicked: false,
      placeholderUrl: '../static/placeholder.png',
      playing: {},
      recentlyPlayed: [],
      recentlyPlayedClicked: false,
      searchClicked: false,
      spotify: false,
      userId: '',
      userRef: false,
      wave: false,
      waveRef: '',
      waveSongs: {}
    }
  },
  mixins: [SpotifyMixin],
  beforeRouteLeave(to, from, next) {
    this.ifPlayingPause();
    next();
  },
  mounted() {
    this.getUser();
  },
  methods: {
    // Add LOADING...
    // SET UP
    getUser() {
      // Get logged in user and check if wave
      let unsubscribe = Firebase.auth().onAuthStateChanged(user => {
        if (user === null) {
          // Not logged in
        } else {
          this.userId = user.uid.replace(/\%2E/g, '.');
          this.checkWaveTrue(user.uid);
          // Add listener to see if wave added for user
          this.regsiterChildAdded(user);
          this.$forceUpdate();
          unsubscribe();
        }
      });
    },
    checkWaveTrue(userId) {
      // Could set listeners for all friends so that if they are added updated in real time
      this.userRef = Firebase.database().ref(`users/${userId}`);
      this.userRef.once('value', snapshot => {
        let friends = snapshot.val().friends;
        this.spotify = snapshot.val().spotify;
        this.wave = snapshot.val().wave;
        for (var user in friends) {
          // Should be non blocking, make each call to wave seperately after getting friend list ?
          this.checkFriendsWaves(user)
        }
      })
    },
    checkFriendsWaves(userId) {
      let friendRef = Firebase.database().ref(`users/${userId}`)
      friendRef.once('value', snapshot => {
        let friendWave = snapshot.child('wave').val();
        if (friendWave) {
          let user = {
            displayName: snapshot.val().display_name,
            photoURL: snapshot.val().img_url,
            uid: userId
          }
          this.regsiterChildAdded(user);
        }
      })
    },
    regsiterChildAdded(user) {
      // Add Child removed listener too for real time updates ?
      let userId = user.uid;
      this.waveSongs[userId] = {};
      let userRef = this.waveSongs[userId];
      this.setUpUser(userRef, user);
      // get wave DB entry for specifc user and register child added
      this.waveRef = Firebase.database().ref(`wave/${userId}`);
      this.waveRef.orderByChild(`date_added`).on('child_added', snapshot => {
        userRef.songs.unshift(snapshot.val());
        this.$forceUpdate();
      });
    },
    setUpUser(userRef, user) {
      userRef.counter = 0;
      userRef.id = user.uid.replace(/\%2E/g, '.');
      userRef.imgUrl = user.photoURL;
      userRef.name = user.displayName;
      userRef.songs = [];
    },
    // END OF SET UP
    // ADD / DELETE WAVE
    addRecentToWave(song) {
      // If album is needed, could make API call here, or when retrieving album art
      const result = {
        album: null,
        artist: song.artists[0].name,
        id: song.id,
        service: 'spotify',
        track: song.name,
        previewUrl: song.preview_url,
        url: song.uri
      }
      this.addToWave(result);
    },
    addToWave(result) {
      console.log('added to wave');
      this.ifPlayingPause();
      let userId = this.userId.replace(/\./g, '%2E');
      Firebase.database().ref(`wave/${userId}/${result.id}`).update({
        artwork_url: (result.service === 'itunes' ? result.artwork : null),
        date_added: new Date().getTime(),
        id: result.id,
        preview_url: result.previewUrl,
        service: result.service,
        song_album: result.album,
        song_artist: result.artist,
        song_title: result.track,
        url: result.url
      });
      // https://firebase.google.com/docs/database/web/read-and-write#updating_or_deleting_data
      if (this.wave === false) {
        this.userRef.update({
          wave: true
        });
        this.wave = true;
      }
      console.log('add');
      VueNotifications.success({message: `Added to Wave`});
      this.$forceUpdate();
    },
    deleteWave(id) {
      // Pause and reset playing
      this.ifPlayingPause();
      this.playing = {};
      var userId = this.userId.replace(/\./g, '%2E');
      // Remove from DB
      this.waveRef = Firebase.database().ref(`wave/${userId}`);
      this.waveRef.child(id).remove();
      // Remove locally
      let userRef = this.waveSongs[userId];
      userRef.counter--;
      userRef.songs.splice(userRef.counter, 1);
      this.checkEmpty(this.userId.replace(/\./g, '%2E'));
      VueNotifications.error({message: `Removed from Wave`});
      this.$forceUpdate();
    },
    checkEmpty(userId) {
      if (this.waveSongs[userId].songs.length === 0) {
        this.userRef.update({
          wave: false
        });
        this.wave = false;
      }
    },
    spotifyRecentlyPlayed() {
      if (this.recentlyPlayedClicked === true) {
        this.recentlyPlayedClicked = false;
      } else {
        this.getRecentlyPlayed(callback => {
          this.recentlyPlayed = callback.items;
          this.recentlyPlayedClicked = true;
        })
      }
    },
    playAudio: function(url, target, id) {
      // apply playing class only to target?
      // Toggle visibility of songs with target too??
      this.ifPlayingPause(target);
      this.resetOtherCounters(id);
      this.audioObject = new Audio(url);
      this.audioObject.play();
      this.audioObject.addEventListener('ended', () => {
        this.playWave(target, id);
      });
    },
    playWave(e, id) {
      // e.target when from click event, just e when from playAudio
      let target = e.target || e;
      let waveRef = this.waveSongs[id];
      let counter = waveRef.counter;
      target.classList.add('wave--playing');
      if (counter === waveRef.songs.length) {
        waveRef.counter = 0;
        this.ifPlayingPause();
        this.removeClass(target);
        this.playing = {};
        this.$forceUpdate();
      } else {
        this.setPlaying(waveRef.songs[counter], id);
        let url = waveRef.songs[counter].preview_url;
        this.playAudio(url, target, id);
        waveRef.counter++;
      }
    },
    setPlaying(song, id) {
      this.playing = {
        artist: song.song_artist,
        id: song.id,
        ownerId: id.replace(/\%2E/g, '.'),
        title: song.song_title,
        service: song.service,
        url: song.url
      }
    },
    removeClass(target) {
      target.classList.remove('wave--playing');
    },
    resetOtherCounters(id) {
      for (let key in this.waveSongs) {
        if (key !== id) {
          this.waveSongs[key].counter = 0;
        }
      }
    },
    ifPlayingPause(target, id) {
      if (this.previousTarget && this.previousTarget !== target) {
        this.removeClass(this.previousTarget);
      }
      this.previousTarget = target;
      if (this.audioObject) {
        this.audioObject.pause();
      }
    },
    addFriend(user) {
      console.log(user);
      if (this.userId !== user.id.replace(/\./g, '%2E')) {
        let friendsRef = Firebase.database().ref(`users/${this.userId.replace(/\./g, '%2E')}/friends`);
        friendsRef.child(user.id).set(true);
        VueNotifications.success({message: `Added ${user.display_name}`});
        this.checkFriendsWaves(user.id);
      } else {
        VueNotifications.info({message: "Can't add yourself..."});
      }
    },
    correctCasing(service) {
      switch (service) {
        case 'itunes':
          return 'iTunes'
        case 'spotify':
          return 'Spotify'
        case 'youtube':
          return 'YouTube'
      };
    }
  },
  components: {
    'list-users': ListUsers,
    'search': Search
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/colors.scss";

.wave-container--background {
  background-color: #e8e8e8;
  padding-top: 10px;
  width: 100%;
}

.wave-container--all {
  display: inline-block;
}

.wave-container--user {
  display: inline-block;
  float: right;
}

.wave-add-songs--link,
.wave-playing--link {
  color: $logo-color;
  cursor: pointer;
  display: block;
  font-weight: bold;
  text-decoration: underline;
}

.my-wave {
  float: left;
}

.wave--profile-pic {
  border-radius: 50%;
  display: inline-block;
  // margin: auto;
  margin-right: 10px;
  width: 100px;
}

.wave--name {
  display: block;
}

.wave-false {
  border: 5px solid grey;
  pointer-events: none;
  opacity: 0.8;
  background: #CCC;
}

.wave-true {
  border: 5px solid $play-color;
  cursor: pointer;
}

.wave--playing {
  -webkit-animation:spin 2s linear infinite;
  -moz-animation:spin 2s linear infinite;
  animation:spin 2s linear infinite;
}

@-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
@-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }

.track-container {
  border: 2px solid $play-color;
  border-radius: 5px;
  display: block;
  margin: auto;
  max-width: 200px;
  padding: 2px 2px;
  margin-bottom: 5px;
}

.track-container--add {
  color: $logo-color;
  cursor: pointer;
  display: block;
  font-weight: bold;
}

.icon {
  display: block;
  margin: auto;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  cursor: pointer;
}
</style>
