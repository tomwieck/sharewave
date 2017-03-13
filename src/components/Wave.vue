<template>
  <div class="wave">
    <h2> My Wave </h2>
    <img class="wave--profile-pic" v-bind:class="[{ 'wave-true': wave, 'wave--playing': playing}, 'wave-false']" @click="getWave" :src="imgUrl || placeholderUrl">
    <div v-if="playing">
      <div v-for="song in waveSongs" :key="song.id">
        {{ song.song_artist }} - {{ song.song_title }}
      </div>
    </div>
    <a @click="searchClicked = !searchClicked">
      <b>Search on Spotify and iTunes</b>
    </a><br>
    <a v-if="spotify" @click="spotifyRecentlyPlayed">
      <b>See your recently played Spotify tracks</b>
    </a>
    <div v-if="searchClicked">
      <search v-on:addToWave="addToWave"></search>
    </div>
    <div v-if="recentlyPlayedClicked">
      <transition-group name="fade">
      <div class="track-container" v-for="song in recentlyPlayed" :key="song.track.id">
        <span>{{ song.track.name }} - {{ song.track.artists[0].name }}</span>
        <span class="track-container--add" @click="addRecentToWave(song.track)"> Add to Wave </span>
      </div>
    </transition-group>
    </div>
  </div>
</template>

<script>
import SpotifyMixin from './spotifyMixin.js'
import Firebase from './firebaseMixin.js'
import Search from './Search.vue'

export default {
  name: 'Wave',
  data () {
    return {
      audioObject: null,
      imgUrl: '',
      placeholderUrl: '../static/placeholder.png',
      playing: false,
      recentlyPlayed: [],
      recentlyPlayedClicked: false,
      searchClicked: false,
      spotify: false,
      userRef: false,
      wave: false,
      waveRef: false,
      waveSongs: []
    }
  },
  mixins: [SpotifyMixin],
  beforeRouteLeave: function(to, from, next) {
    // if (this.waveRef) {
    //   this.waveRef.off('child_added');
    // }
    next();
  },
  mounted() {
    this.registerStateChange();
  },
  methods: {
    registerStateChange() {
      let unsubscribe = Firebase.auth().onAuthStateChanged(user => {
        if (user === null) {
          console.log('not logged in');
        } else {
          this.imgUrl = user.photoURL;
          this.userId = user.uid;
          this.checkWaveTrue(user.uid);
          unsubscribe();
        }
      });
    },
    checkWaveTrue(userId) {
      this.userRef = Firebase.database().ref(`users/${userId}`);
      this.userRef.on('value', snapshot => {
        this.spotify = snapshot.val().spotify;
        this.wave = snapshot.val().wave;
      })
    },
    getWave(e) {
      if (this.playing === true) {
        this.playing = false;
        this.audioObject.pause();
      } else {
        var userId = userId || this.userId;
        this.waveSongs = [];
        this.waveRef = Firebase.database().ref(`wave/${userId}`);
        this.waveRef.orderByChild('date_added').once('value', snapshot => {
          let values = snapshot.val();
          for (let key in values) {
            if (values.hasOwnProperty(key)) {
              this.waveSongs.push(values[key]);
            }
            // this.waveSongs.push(v);
          };
          this.playAudio(e);
        });
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
      console.log(result);
      let userId = Firebase.auth().currentUser.uid;
      Firebase.database().ref('wave/' + userId).push({
        artwork_url: (result.service === 'itunes' ? result.artwork : null),
        date_added: new Date().getTime(),
        id: result.id,
        preview_url: result.previewUrl,
        service: result.service,
        song_album: result.album,
        song_artist: result.artist,
        song_title: result.track
      });
      this.userRef.update({
        wave: true
      });
    },
    spotifyRecentlyPlayed() {
      this.getRecentlyPlayed(callback => {
        this.recentlyPlayed = callback.items;
        this.recentlyPlayedClicked = true;
      })
    },
    playAudio: function(e, index) {
      // let target = e.target;
      this.playing = true;
      if (this.audioObject) {
        this.audioObject.pause();
      }
      let i = index || 0;
      let url = this.waveSongs[i].preview_url;
      console.log(url);
      this.audioObject = new Audio(url);
      this.audioObject.play();
      // target.classList.add('playing');
      // target.innerText = 'Playing';
      // this.audioObject.addEventListener('ended', function () {
      //   target.classList.remove('playing');
      //   target.innerText = 'Preview';
      // });
      // this.audioObject.addEventListener('pause', function () {
      //   target.classList.remove('playing');
      //   target.innerText = 'Preview';
      // });
    }
  },
  components: {
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
  border: 3px solid grey;
}

.wave-true {
  border: 3px solid $play-color;
  cursor: pointer;
}

.wave--playing {
  -webkit-animation:spin 4s linear infinite;
  -moz-animation:spin 4s linear infinite;
  animation:spin 4s linear infinite;
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
  display: block;
  font-weight: bold;
}

</style>
