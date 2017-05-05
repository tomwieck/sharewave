<template>
  <div class="wave">
    <div id="background" class="wave-container--background">
      <div id="wave-container-all" class="wave-container--all">
        <!-- v-show when complete variable? -->
        <div class="my-wave">
          <div class="wave-container--user" v-for="(value, key) in waveSongs" v-if="userId === value.id">
            <a :href="'/#/user/' + value.id"><b>My Wave</b></a>
            <wave-user :userKey="key" :imgUrl="value.imgUrl" :waveTrue="waveSongs[key].songs.length !== 0" v-on:playWave="playWave"></wave-user>
            <svg @click="showDetails(key, $event)" class="icon icon-arrow"><use xlink:href="#icon-arrow"></use></svg>
          </div>
        </div>
        <div class="friend-wave float-left">
          <div class="wave-container--user"v-for="(value, key) in waveSongs" v-if="userId !== value.id && waveSongs[key].songs.length !== 0">
            <div class="wave-container--user-name"><a :href="'/#/user/' + value.id">{{ value.name }}</a></div>
            <wave-user :userKey="key" :imgUrl="value.imgUrl" :waveTrue="waveSongs[key].songs.length !== 0" v-on:playWave="playWave"></wave-user>
            <svg @click="showDetails(key, $event)" class="icon icon-arrow"><use xlink:href="#icon-arrow"></use></svg>
          </div>
        </div>
        <div class="friend-wave">
          <div class="wave-container--user"v-bind:class="{ 'float-left': waveSongs[key].songs.length !== 0 }" v-for="(value, key) in waveSongs" v-if="userId !== value.id && waveSongs[key].songs.length === 0">
            <div class="wave-container--user-name"><a :href="'/#/user/' + value.id">{{ value.name }}</a></div>
            <wave-user :userKey="key" :imgUrl="value.imgUrl" :waveTrue="waveSongs[key].songs.length !== 0" v-on:playWave="playWave"></wave-user>
          </div>
        </div>
        <span id="buttons">
          <span @click="scroll('left')"class="wave--scroll-button wave--scroll-button__left">
            <svg class="icon icon-arrow icon-arrow--left"><use xlink:href="#icon-arrow"></use></svg>
          </span>
          <span @click="scroll()" class="wave--scroll-button wave--scroll-button__right">
            <svg class="icon icon-arrow icon-arrow--right "><use xlink:href="#icon-arrow"></use></svg>
          </span>
        </span>
      </div>
      <div v-bind:class="{'slideup': !detailsOpen, 'slidedown': detailsOpen}">
        <span v-if="details.songs ? details.songs.length === 0 : false"> You have no songs, add some below. </span>
        <span v-else>
          <span><b>All Songs</b></span>
          <div v-for="(song, key) in details.songs">
            {{ song.song_artist }} - {{ song.song_title }}
            <span v-if="userId === details.name">
              <svg class="icon icon-bin" @click="deleteWave(song.id, key)"><use xlink:href="#icon-bin"></use></svg>
            </span>
            <span v-else>
              <a :target="song.service === 'itunes' ? '_blank' : ''" :href="song.url"><svg class="icon icon-new-tab"><use xlink:href="#icon-new-tab"></use></svg></a>
            </span>
          </div>
        </span>
      </div>
    </div>
    <span v-show="Object.keys(waveSongs).length === 1">
      Your friends Wave's will appear above. <br> Follow some Friends to get started.
    </span>
    <button class="btn btn--main margin block" @click="friendsClicked = !friendsClicked">
      Follow Friends <svg class="icon icon-user-plus white"><use xlink:href="#icon-user-plus"></use></svg>
    </button>
    <transition name="fade">
      <div v-show="friendsClicked">
        <list-users :add="true" :search="true" v-on:userClicked="addFriend"></list-users>
      </div>
    </transition>
    <h3 class="wave--add-songs">Add Songs to Your Wave: </h3>
    <search v-on:addToWave="addToWave"></search>
    <div class="recently-played--container">
      <div class="recently-played--inner">
        <button class="btn btn--main recently-played--btn" v-if="spotify" @click="spotifyRecentlyPlayed">
          Your Recent Spotify tracks
          <svg class="icon icon-arrow white"><use xlink:href="#icon-arrow"></use></svg>
        </button>
        <div v-if="recentlyPlayedClicked">
          <div v-if="recentlyPlayed.length === 0">
            {{ recentlyPlayedText }}
          </div>
          <div class="recently-played--tracks" v-else>
            <div class="recently-played" v-for="song in recentlyPlayed" :key="song.track.id">
              <span>{{ song.track.artists[0].name }} - {{ song.track.name }}</span>
              <span class="recently-played--add" @click="addRecentToWave(song.track)"> Add to Wave </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="top-tracks--container">
      <div class="top-tracks--inner">
        <button class="btn btn--main top-tracks--btn" v-if="spotify" @click="spotifyTopTracks">
          Your Top Spotify tracks
          <svg class="icon icon-arrow white"><use xlink:href="#icon-arrow"></use></svg>
        </button>
        <div v-if="topTracksClicked">
          <div v-if="topTracks.length === 0">
            {{ topTracksText }}
          </div>
          <div class="top-tracks--tracks" v-else>
            <div class="recently-played" v-for="song in topTracks" :key="song.id">
              <span>{{ song.artists[0].name }} - {{ song.name }}</span>
              <span class="recently-played--add" @click="addRecentToWave(song)"> Add to Wave </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  <div id="nowPlaying" class="now-playing">
    <a class="closebtn" @click="closeNowPlaying">&times;</a>
    <div v-if="Object.keys(playing).length !== 0" class="now-playing--artwork">
      <transition mode="out-in" name="fade">
        <img :key="playing.artwork" :src="playing.artwork ? playing.artwork : getArtwork(playing.id)">
      </transition>
    </div>
    <div class="now-playing--details">
      <div v-if="playing.title">
        <div class="now-playing--title-track">
          <h3 class="white">Now Playing</h3>
          <span class="now-playing--track">{{playing.artist}} - {{playing.title}}</span>
        </div>
        <div class="now-playing--service-control">
          <a v-bind:href="playing.url" class="now-playing--service">
            <img v-bind:target="playing.service === 'itunes' ? '_blank' : ''"
                 :src="playing.service === 'itunes' ? itunesBadge: spotifyBadge">
          </a>
          <div class="now-playing--controls">
            <span class=" now-playing--control" @click="playWave($event, playing.ownerId, true)">
              <svg class="icon icon-stop2"><use xlink:href="#icon-stop2"></use></svg>
            </span>
            <span class=" now-playing--control" @click="playWave($event, playing.ownerId)">
              <svg class="icon icon-forward3"><use xlink:href="#icon-forward3"></use></svg>
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>

  <symbol id="icon-bin" viewBox="0 0 32 32">
    <title>bin</title>
    <path d="M4 10v20c0 1.1 0.9 2 2 2h18c1.1 0 2-0.9 2-2v-20h-22zM10 28h-2v-14h2v14zM14 28h-2v-14h2v14zM18 28h-2v-14h2v14zM22 28h-2v-14h2v14z"></path>
    <path d="M26.5 4h-6.5v-2.5c0-0.825-0.675-1.5-1.5-1.5h-7c-0.825 0-1.5 0.675-1.5 1.5v2.5h-6.5c-0.825 0-1.5 0.675-1.5 1.5v2.5h26v-2.5c0-0.825-0.675-1.5-1.5-1.5zM18 4h-6v-1.975h6v1.975z"></path>
  </symbol>
  <symbol id="icon-arrow" viewBox="0 0 32 32">
    <title>ctrl</title>
    <path d="M23 14c-0.278 0-0.555-0.116-0.753-0.341l-6.247-7.14-6.247 7.14c-0.364 0.416-0.995 0.458-1.411 0.094s-0.458-0.995-0.094-1.411l7-8c0.19-0.217 0.464-0.341 0.753-0.341s0.563 0.125 0.753 0.341l7 8c0.364 0.416 0.322 1.047-0.094 1.411-0.19 0.166-0.424 0.247-0.658 0.247z"></path>
  </symbol>
  <symbol id="icon-user-plus" viewBox="0 0 32 32">
    <title>user-plus</title>
    <path d="M12 23c0-4.726 2.996-8.765 7.189-10.319 0.509-1.142 0.811-2.411 0.811-3.681 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h12.416c-0.271-0.954-0.416-1.96-0.416-3z"></path>
    <path d="M23 14c-4.971 0-9 4.029-9 9s4.029 9 9 9c4.971 0 9-4.029 9-9s-4.029-9-9-9zM28 24h-4v4h-2v-4h-4v-2h4v-4h2v4h4v2z"></path>
  </symbol>
  <symbol id="icon-new-tab" viewBox="0 0 32 32">
    <title>new-tab</title>
    <path d="M6 2v24h24v-24h-24zM28 24h-20v-20h20v20zM4 28v-21l-2-2v25h25l-2-2h-21z"></path>
    <path d="M11 8l5 5-6 6 3 3 6-6 5 5v-13z"></path>
  </symbol>
  <symbol id="icon-forward3" viewBox="0 0 32 32">
    <title>forward3</title>
    <path d="M16 27v-10l-10 10v-22l10 10v-10l11 11z"></path>
  </symbol>
  <symbol id="icon-stop2" viewBox="0 0 32 32">
    <title>stop2</title>
    <path d="M4 4h24v24h-24z"></path>
  </symbol>
  </div>
</template>

<script>
import SpotifyMixin from './spotifyMixin.js'
import Firebase from './firebaseMixin.js'
import ListUsers from './ListUsers.vue'
import Search from './Search.vue'
import WaveUser from './WaveUser.vue'
import VueNotifications from 'vue-notifications'
import debounce from 'lodash/debounce'

export default {
  name: 'Wave',
  data () {
    return {
      artPlaceholder: '../static/artplaceholder.png',
      audioObject: null,
      details: {},
      detailsOpen: false,
      imgUrl: '',
      friendsClicked: false,
      playing: {},
      previousTarget: '',
      recentlyPlayed: [],
      recentlyPlayedClicked: false,
      recentlyPlayedText: '',
      searchClicked: false,
      spotify: false,
      totalScroll: 0,
      topTracks: [],
      topTracksClicked: false,
      topTracksText: '',
      userId: '',
      userRef: false,
      wave: false,
      waveRef: '',
      waveSongs: {},
      itunesBadge: '../static/itunes.svg',
      spotifyBadge: '../static/spotifyBadge.svg'
    }
  },
  mixins: [SpotifyMixin],
  beforeDestroy() {
    this.ifPlayingPause();
    window.removeEventListener('resize', this.updateLayout)
  },
  mounted() {
    this.getUser();
    this.getTopTracks(callback => {
      console.log(callback);
    })
    window.addEventListener('resize', this.updateLayout, false);
  },
  watch: {
    playing() {
      if (Object.keys(this.playing).length === 0) {
        this.closeNowPlaying();
      }
    }
  },
  methods: {
    updateLayout: debounce(() => {
      // let vm = this;
      var adiv = document.getElementById('wave-container-all');
      var buttons = document.getElementsByClassName('wave--scroll-button')
      if (adiv.scrollWidth > window.innerWidth) {
        buttons[0].style.display = 'block';
        buttons[1].style.display = 'block';
        adiv.classList.add('lr-padding');
      } else {
        buttons[0].style.display = 'none';
        buttons[1].style.display = 'none';
        adiv.classList.remove('lr-padding');
      }
    }, 100),
    scroll(amount) {
      var adiv = document.getElementById('wave-container-all');
      amount === 'left' ? amount = -Math.abs(window.innerWidth) : amount = window.innerWidth;
      if (adiv.scrollWidth > this.totalScroll + amount) {
        this.totalScroll += amount
      }
      adiv.scrollLeft = this.totalScroll;
    },
    // Add LOADING...
    // When redirected to this page after login, user may not be created in DB in time (emit event?)
    // SET UP
    getUser() {
      // Get logged in user and check if wave
      let unsubscribe = Firebase.auth().onAuthStateChanged(user => {
        if (user === null) {
          // Not logged in
        } else {
          // this.userId = user.uid;
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
        this.spotify = snapshot.val().spotify;
        if (snapshot.child('friends').exists()) {
          let friends = snapshot.val().friends;
          this.wave = snapshot.val().wave;
          for (var user in friends) {
            // Should be non blocking, make each call to wave seperately after getting friend list ?
            this.checkFriendsWaves(user)
          }
        } else {

        }
      })
    },
    checkFriendsWaves(userId) {
      let friendRef = Firebase.database().ref(`users/${userId}`)
      friendRef.once('value', snapshot => {
        if (snapshot.exists()) {
          let user = {
            displayName: snapshot.val().display_name,
            photoURL: snapshot.val().img_url,
            uid: userId
          }
          this.regsiterChildAdded(user);
        } else {
          this.deleteFriend(userId);
        }
      })
    },
    deleteFriend(friendId) {
      let safeId = this.userId.replace(/\./g, '%2E')
      let friendRef = Firebase.database().ref(`users/${safeId}/friends/${friendId}`);
      friendRef.set(null);
    },
    regsiterChildAdded(user) {
      // Add Child removed listener too for real time updates ?
      let userId = user.uid;
      this.waveSongs[userId] = {};
      let userRef = this.waveSongs[userId];
      this.setUpUser(userRef, user);
      // get wave DB entry for specifc user and register child added
      this.waveRef = Firebase.database().ref(`wave/${userId}`);
      let day = 60 * 60 * 24 * 1000;
      let yesterday = new Date().getTime() - day;
      this.waveRef.orderByChild(`date_added`).startAt(yesterday).on('child_added', snapshot => {
        userRef.songs.unshift(snapshot.val());
        this.$forceUpdate();
      });
      this.$forceUpdate();
      this.updateLayout();
    },
    setUpUser(userRef, user) {
      userRef.counter = 0;
      userRef.id = user.uid.replace(/\%2E/g, '.');
      userRef.imgUrl = user.photoURL;
      userRef.name = user.displayName;
      userRef.songs = [];
    },
    // END OF SET UP
    showDetails(key, e) {
      // If clicked on the <use> tag, still apply class to svg
      let target = e.target.tagName === 'use' ? e.target.parentNode : e.target;
      // if clicked on the same rotate
      if (this.details.name === this.waveSongs[key].id) {
        setTimeout(() => { this.details = {}; }, 400);
        this.detailsOpen = false;
        target.classList.remove('rotate');
      } else {
        let el = document.getElementsByClassName('rotate');
        if (el.length > 0) {
          el[0].classList.remove('rotate');
        }
        target.classList.add('rotate');
        this.detailsOpen = true;
        let songs = this.waveSongs[key].songs.slice(0);
        this.details.name = this.waveSongs[key].id;
        this.details.songs = songs;
      }
      this.$forceUpdate();
    },
    // ADD / DELETE WAVE
    addRecentToWave(song) {
      // If album art is needed, could make API call here, or when retrieving album art
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
      let userId = this.userId.replace(/\./g, '%2E');
      this.ifPlayingPause();
      this.waveSongs[userId].counter = 0;
      this.closeNowPlaying();
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
      this.details.songs = this.waveSongs[userId].songs;
      VueNotifications.success({message: `Added to Wave`});
      this.$forceUpdate();
    },
    deleteWave(id, key) {
      // Pause and reset playing
      this.ifPlayingPause();
      this.playing = {};
      var userId = this.userId.replace(/\./g, '%2E');

      // Remove locally
      let userRef = this.waveSongs[userId];
      userRef.songs.splice(key, 1);
      this.checkEmpty(this.userId.replace(/\./g, '%2E'));
      this.waveSongs[userId].counter = 0;
      // Remove from DB
      this.waveRef = Firebase.database().ref(`wave/${userId}`);
      this.waveRef.child(id).remove();
      this.details.songs = this.waveSongs[userId].songs;
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
        this.recentlyPlayedClicked = true;
        this.recentlyPlayedText = 'Loading...';
        this.getRecentlyPlayed(callback => {
          if (callback.items.length === 0) {
            this.recentlyPlayedText = 'No results, try searching for a song instead';
          } else {
            this.recentlyPlayed = callback.items;
          }
        })
      }
    },
    spotifyTopTracks() {
      if (this.topTracksClicked === true) {
        this.topTracksClicked = false;
      } else {
        this.topTracksClicked = true;
        this.topTracksText = 'Loading...';
        this.getTopTracks(callback => {
          if (callback.items.length === 0) {
            this.topTracksText = 'No results, try searching for a song instead';
          } else {
            this.topTracks = callback.items;
          }
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
    playWave(e, id, stop) {
      // e.target when from click event, just e when from playAudio
      id = id.replace(/\./g, '%2E')
      let target = document.getElementsByClassName(`${id}`)[0];
      let waveRef = this.waveSongs[id];
      let counter = waveRef.counter;
      target.classList.add('wave--playing');
      target.classList.remove('pulse');
      this.resetClasses(id);
      if (counter === waveRef.songs.length || stop) {
        waveRef.counter = 0;
        this.ifPlayingPause();
        this.removeClass(target);
        this.playing = {};
        this.closeNowPlaying();
        this.$forceUpdate();
      } else {
        this.setPlaying(waveRef.songs[counter], id);
        let url = waveRef.songs[counter].preview_url;
        this.playAudio(url, target, id);
        waveRef.counter++;
      }
    },
    resetClasses(id) {
      let classes = Array.from(document.getElementsByClassName(`timer-${id}`));
      classes.forEach((elm) => {
        elm.classList.add('fill');
        var newone = elm.cloneNode(true);
        elm.parentNode.replaceChild(newone, elm);
      })
    },
    removeClass(target) {
      target.classList.remove('wave--playing');
      // target.classList.remove('pulse');
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
      let safeId = this.userId.replace(/\./g, '%2E')
      if (safeId !== user.id) {
        let friendsRef = Firebase.database().ref(`users/${this.userId.replace(/\./g, '%2E')}/friends`);
        friendsRef.child(user.id).set(true);
        VueNotifications.success({message: `Followed ${user.display_name || safeId}`});
        this.checkFriendsWaves(user.id);
      } else {
        VueNotifications.info({message: "Can't add yourself..."});
      }
    },
    correctCasing(service) {
      if (service === 'itunes') {
        return 'iTunes'
      } else {
        return 'Spotify'
      }
    },
    getArtwork(trackId) {
      this.playing.artwork = this.artPlaceholder;
      this.axios.get(`http://localhost:8888/trackArtwork?trackId=${trackId}`)
      .then(response => {
        this.playing.artwork = response.data;
      })
      .catch(error => {
        console.log(error);
      })
    },
    setPlaying(song, id) {
      this.playing = {
        artist: song.song_artist,
        artwork: song.artwork_url || null,
        id: song.id,
        ownerId: id.replace(/\%2E/g, '.'),
        title: song.song_title,
        service: song.service,
        url: song.url
      }
      this.openNowPlaying();
    },
    openNowPlaying() {
      document.getElementById('wave-container-all').classList.add('wave-container--now-playing');
      document.getElementById('nowPlaying').classList.add('now-playing--open');
    },
    closeNowPlaying() {
      document.getElementById('wave-container-all').classList.remove('wave-container--now-playing');
      document.getElementById('nowPlaying').classList.remove('now-playing--open');
    }
  },
  components: {
    'list-users': ListUsers,
    'search': Search,
    'wave-user': WaveUser
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/colors.scss";

a {
  color: $logo-color;
  text-decoration: none;
  transition: 0.3s;
}

a:hover {
  color: $play-color;
}
// Wave Styles START
.wave {
  // height of now playing
  margin-bottom: 125px;
}

.wave-container--background {
  background-color: $light-grey;
  margin: auto;
  padding-top: 10px;
  position: relative;
  width: 100%;
}

.wave-container--all {
  height: 160px;
  overflow-x: scroll;
  overflow-y: hidden;
  transition: 0.5s;
  white-space: nowrap;
  width: 100%;
  @media screen and (max-width: $break-tablet) {
    height: 140px;
  }
}

.wave-container--user {
  display: inline-block;
  width: 120px;
  @media screen and (max-width: $break-tablet) {
    width: 92px
  }
  // margin: auto;
}

.wave-container--user-name {
  display: inline-block;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  width: 125px;
  vertical-align: top;
  @media screen and (max-width: $break-tablet) {
    width: 92px
  }
}

.wave--add-songs {
  padding-bottom: 8px;
  padding-top: 16px;
}

.wave-add-songs--link,
.wave-playing--link {
  color: $logo-color;
  cursor: pointer;
  font-weight: bold;
  text-decoration: underline;
}

.my-wave,
.friend-wave {
  // float: left;
  display: inline-block;
}

.friend-wave {
  dispay: flex;
}

// .friend-wave:last-of-type {
//   padding-right: 110px;
// }
// Wave Styles END

// Recently Played START
.recently-played {
  background-color: $play-color;
  border: 2px solid $play-light-color;
  border-top: none;
  color: white;
  display: block;
  margin: auto;
  max-width: 237px;
  padding: 5px 2px;
}

.recently-played--add {
  color: $logo-color;
  cursor: pointer;
  display: block;
  font-weight: bold;
}

.top-tracks--btn,
.recently-played--btn {
  margin-top: 16px;
  width: 245px;
}

.recently-played--container,
.top-tracks--container {
  width: 48%;
  margin: 0 1%;
  @media screen and (max-width: $break-tablet) {
    width: 100%;
  }
}

.recently-played--container,
.top-tracks--inner {
  float: right;
  @media screen and (max-width: $break-tablet) {
    float: none;
  }
}


.top-tracks--container,
.recently-played--inner {
  float: left;
  @media screen and (max-width: $break-tablet) {
    float: none;
  }
}

.recently-played--btn,
.recently-played--tracks,
.top-tracks--container {
}
// Recently Played END

// Icons START
.icon {
  margin: auto;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  cursor: pointer;
  transition: 0.2s;
}

.icon-arrow {
  display: block;
  fill: $logo-color;
  font-size: 40px;
  margin-top: -18px;
  transform: rotate(180deg);
  // transition: 0.2s;
}

.icon-user-plus {
  font-size: 21px;
  margin-bottom: -5px;
}

.icon-bin {
  margin-bottom: -3px;
}

.icon-bin:hover {
  fill: red;
}

.icon-new-tab {
  margin-bottom: -3px;
  margin-left: 4px;
  display: inline-block;
}

.icon-new-tab:hover {
  fill: $play-color;
}

.icon-forward3,
.icon-stop2 {

}
// Icons END

// More Details START
.slideup, .slidedown {
    max-height: 0;
    overflow-y: hidden;
    -webkit-transition: max-height 0.4s ease-in-out;
    -moz-transition: max-height 0.4s ease-in-out;
    -o-transition: max-height 0.4s ease-in-out;
    transition: max-height 0.4s ease-in-out;
}

.slidedown {
    max-height: 300px;
}

// Rotate on arrow icon
@-moz-keyframes rotate { 100% { -moz-transform: rotate(180deg); } }
@-webkit-keyframes rotate { 100% { -webkit-transform: rotate(180deg); } }
@keyframes rotate { 100% { -webkit-transform: rotate(180deg); transform:rotate(180deg); } }

.rotate {
  margin-top: 0;
  transform: rotate(0deg);
}
// More Details END

// Now Playing START
.now-playing {
  background-color: $logo-color;
  bottom: 0;
  opacity: 0.95;
  overflow-y: hidden;
  position: fixed;
  right: 0;
  transition: 0.4s;
  transition-timing-function: cubic-bezier(0.61, 0.12, 0.43, 0.99);
  width: 0;
  z-index: 1;
}

.now-playing,
.now-playing--artwork img {
  height: 125px;

}

.now-playing .closebtn {
  cursor: pointer;
  font-size: 38px;
  right: 5px;
  padding: 0;
  position: absolute;
  top: -5px;
  transition: 0.3s;
}

.now-playing--service {
  float: left;
  width: 110px;
  @media screen and (max-width: $break-tablet) {
    width: 100px;
  }
}

.now-playing--controls {
  display: block;
  float: right;
  margin-top: 8px;
  @media screen and (max-width: $break-tablet) {
    margin-right: 0;
    margin-top: 5px;
  }
}


.now-playing--control {
  padding: 2px 2px;
  padding-top: 6px;
  border: none;
  font-size: 28px;
}

.now-playing--control:hover {
  color: $play-color;
}

.now-playing a, .now-playing span, .now-playing div{
    text-decoration: none;
    color: white;
    opacity: 0;
}

.now-playing--open {
  div {
    transition: 0.2s;
    -webkit-transition-delay: 0.3s;
    transition-delay: 0.3s;
  }
  width: 100%;
  .now-playing--artwork img {
    height: 125px;
    max-width: 125px;
  }
}

.now-playing--open {
  a, span, div {
    opacity: 1;
  }
}

.now-playing a:hover {
  color: #f1f1f1;
}

.now-playing .closebtn:hover {
  color: $play-color;
}

.now-playing--details {
  display: inline-block;
  height: 120px;
  float: left;
  padding: 5px;
  padding-left: 8px;
  text-align: left;
  width: calc(100% - 138px);
}

.now-playing--track {
  display: block;
  max-height: 45px;
  overflow-x: scroll;
  @media screen and (max-width: $break-tablet) {
    font-size: 13px;
    max-height: 38px;
  }
}

.now-playing--title-track {
  height: 65px;
}

.now-playing--artwork {
  float: left;
  width: 125px;
}

// Now Playing END

.white {
  color: white;
  fill: white;
}

.wave--scroll-button {
  background-color: $logo-color;
  border: none;
  border-radius: 50%;
  height: 30px;
  opacity: 0.5;
  position: absolute;
  top: 70px;
  transition: 0.3s;
  width: 30px;
  z-index: 999;
  @media screen and (max-width: $break-tablet) {
   top: 60px;
  }
}

.wave--scroll-button:hover {
  opacity: 1;
}

.wave--scroll-button svg {
  fill: white;
  margin-top: 0;
}

.wave--scroll-button__left {
  left: 2px;
  transform: rotate(90deg);
}

.wave--scroll-button__right {
  right: 2px;
  transform: rotate(270deg);
}

.icon-arrow--left {
  position: absolute;
  top: -12px;
  left: -5px;
}

.icon-arrow--right {
  position: absolute;
  top: -12px;
  left: -5px;
}

.lr-padding {
  padding: 0px 28px;
  width: calc(100% - 56px)
}
</style>
