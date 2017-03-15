<template>
  <div class="wave">
    <h2> My Wave </h2>
    <img class="wave--profile-pic" v-bind:class="{ 'wave-true': wave, 'wave--playing': playing, 'wave-false': !wave }" @click="playAudio" :src="imgUrl || placeholderUrl">
    <div v-if="playing">
      {{ counter }} / {{ waveSongs.length }}
        <div> 
          {{ waveSongs[counter - 1].song_artist }} - {{ waveSongs[counter - 1].song_title }} 
          <svg @click="deleteWave(waveSongs[counter - 1].id)" 
          class="icon icon-bin"><use xlink:href="#icon-bin"></use></svg>
          <!-- <span></span> -->
        </div>
    </div>
    <h3> Add Songs </h3>
    <a @click="searchClicked = !searchClicked"><b>Search on Spotify and iTunes</b></a>
    <div v-if="searchClicked">
      <search v-on:addToWave="addToWave"></search>
    </div>
    <br>
    <a v-if="spotify" @click="spotifyRecentlyPlayed">
      <b>See your recently played Spotify tracks</b>
    </a>
    <div v-if="recentlyPlayedClicked">
      <transition-group name="fade">
        <div class="track-container" v-for="song in recentlyPlayed" :key="song.track.id">
          <span>{{ song.track.name }} - {{ song.track.artists[0].name }}</span>
          <span class="track-container--add" @click="addRecentToWave(song.track)"> Add to Wave </span>
        </div>
      </transition-group>
    </div>
  <h3>Add Friends</h3>
  <list-users></list-users>

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

export default {
  name: 'Wave',
  data () {
    return {
      audioObject: null,
      counter: 0,
      imgUrl: '',
      placeholderUrl: '../static/placeholder.png',
      playing: false,
      recentlyPlayed: [],
      recentlyPlayedClicked: false,
      searchClicked: false,
      spotify: false,
      userId: '',
      userRef: false,
      wave: false,
      waveRef: '',
      waveSongs: []
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
    // Scenarions
    // User has no wave
    // User has wave with item(s)
    // User Adds an item, going from 0 - 1 and NOT(?) triggering child added
    getUser() {
      let unsubscribe = Firebase.auth().onAuthStateChanged(user => {
        if (user === null) {
          console.log('not logged in');
        } else {
          this.imgUrl = user.photoURL;
          this.userId = user.uid;
          this.checkWaveTrue(user.uid);
          this.regsiterChildAdded();
          unsubscribe();
        }
      });
    },
    checkWaveTrue(userId) {
      this.userRef = Firebase.database().ref(`users/${userId}`);
      this.userRef.once('value', snapshot => {
        this.spotify = snapshot.val().spotify;
        this.wave = snapshot.val().wave;
      })
    },
    deleteWave(id) {
      this.resetPlaying();
      var userId = userId || this.userId;
      this.waveRef = Firebase.database().ref(`wave/${userId}`);
      // If empty, wave false in User DB
      this.waveRef.child(id).remove()
      .then(() => {
        console.log('removed from DB');
      });
      this.waveSongs.splice(this.counter, 1);
      this.checkWave();
    },
    regsiterChildAdded() {
      let userId = userId || this.userId;
      console.log(userId);
      this.waveRef = Firebase.database().ref(`wave/${userId}`);
      this.waveRef.orderByChild(`date_added`).on('child_added', snapshot => {
        console.log(snapshot.val());
        this.waveSongs.unshift(snapshot.val());
        this.checkWave();
      });
    },
    checkWave() {
      if (this.waveSongs.length === 0) {
        this.wave = false;
        this.userRef.update({
          wave: false
        })
        this.counter = 0;
      }
    },
    addRecentToWave(song) {
      // If album is needed, could make API call here, or when retrieving album art
      const result = {
        album: null,
        artist: song.artists[0].name,
        id: song.id,
        service: 'spotify',
        track: song.name,
        previewUrl: song.preview_url
      }
      this.addToWave(result);
    },
    addToWave(result) {
      this.resetPlaying();
      let userId = this.userId;
      Firebase.database().ref(`wave/${userId}/${result.id}`).update({
        artwork_url: (result.service === 'itunes' ? result.artwork : null),
        date_added: new Date().getTime(),
        id: result.id,
        preview_url: result.previewUrl,
        service: result.service,
        song_album: result.album,
        song_artist: result.artist,
        song_title: result.track
      });
      if (this.wave === false) {
        this.userRef.update({
          wave: true
        });
        this.wave = true;
      }
    },
    spotifyRecentlyPlayed() {
      this.getRecentlyPlayed(callback => {
        this.recentlyPlayed = callback.items;
        this.recentlyPlayedClicked = true;
      })
    },
    playAudio: function(e) {
      if (this.counter === this.waveSongs.length) {
        this.resetPlaying();
      } else {
        this.playing = true;
        if (this.audioObject) {
          this.audioObject.pause();
        }
        let i = this.counter;
        let url = this.waveSongs[i].preview_url;
        console.log(url);
        this.audioObject = new Audio(url);
        this.audioObject.play();
        this.audioObject.addEventListener('ended', () => {
          if (this.counter === this.waveSongs.length) {
            this.resetPlaying();
          } else {
            this.playAudio();
          }
        });
        this.counter++;
      }
    },
    resetPlaying() {
      this.ifPlayingPause();
      this.playing = false;
      this.counter = 0
    },
    ifPlayingPause: function() {
      if (this.audioObject) {
        this.audioObject.pause();
        this.audioObject = null;
      }
    }
  },
  components: {
    'list-users': ListUsers,
    'search': Search
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/styles.scss";
.wave--profile-pic {
  border-radius: 50%;
  display: block;
  margin: auto;
  width: 100px;
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
  -webkit-animation:spin 3s linear infinite;
  -moz-animation:spin 3s linear infinite;
  animation:spin 3s linear infinite;
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
