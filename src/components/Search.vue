<template>
  <div class="search" id="search">
    <div class="search-area">
      <div class="search-area--container">
        <input class="search-area--textbox input-box" placeholder="Search Spotify and iTunes..."v-model="searchTerm">
        <svg class="icon icon-search"><use xlink:href="#icon-search"></use></svg>
      </div>
      <p v-show="searchPlaceholder">{{ searchPlaceholder }}</p>
    </div>

    <div class="search--show-results" v-if="sSearchResults || iSearchResults" @click="showResults = !showResults">
      <div v-show="showResults"><b>Hide Search Results</b></div>
      <div v-show="!showResults"><b>Show Search Results</b></div>
    </div>

    <button v-show="sSearchResults" @click="show('spotify')" v-bind:class="[ selected === 'spotify' ? 'btn--secondary' : 'btn--disabled']" class="btn result-select">Spotify Results</button>
    <button v-show="iSearchResults" @click="show('itunes')" v-bind:class="[ selected === 'itunes' ? 'btn--secondary' : 'btn--disabled']" class="btn result-select">iTunes Results</button>

    <div v-show="showResults">
      <transition-group name="fade" mode="out-in">
        <s-search-table
          class="visible spotify"
          v-on:parentPlay="playAudio"
          v-on:tableToSearch="addToWave"
          v-if="sSearchResults"
          v-bind:key="sSearchResults"
          :searchResults="sSearchResults"
          :service="'Spotify'">
        </s-search-table>
        <!-- If no other result, width 100? -->

        <i-search-table
          class="hidden itunes"
          v-on:parentPlay="playAudio"
          v-on:tableToSearch="addToWave"
          v-if="iSearchResults"
          v-bind:key="iSearchResults"
          :searchResults="iSearchResults"
          :service="'iTunes'">
        </i-search-table>
      </transition-group>
    </div>
    <symbol id="icon-search" viewBox="0 0 32 32">
      <title>search</title>
      <path d="M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"></path>
    </symbol>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import debounce from 'lodash/debounce'

import SpotifyMixin from './spotifyMixin.js'
import SearchTable from './SearchTable.vue'

export default {
  name: 'Search',
  mixins: [SpotifyMixin],
  data () {
    return {
      audioObject: null,
      checked: ['Spotify', 'iTunes'],
      searchTerm: '',
      searchPlaceholder: '',
      searchResults: '',
      timer: false,
      selected: 'spotify',
      showResults: true,
      iSearchResults: false,
      sSearchResults: false,
      ySearchResults: false,
      youtubeTarget: '',
      videoId: ''
    }
  },
  beforeRouteLeave(to, from, next) {
    this.ifPlayingPause();
    next();
  },
  mounted: function () {
    if (!this.$cookie.get('client_access_token') || !this.$cookie.get('access_token')) {
      this.clientCredentials();
    }
  },
  watch: {
    // whenever search changes, this function will run
    searchTerm: function () {
      this.searchPlaceholder = 'Waiting for you to stop typing...'
      this.getSearch()
    },
    checked: function() {
      this.ifPlayingPause();
      this.getSearch()
    }
  },
  methods: {
    ifPlayingPause: function() {
      if (this.audioObject) {
        this.audioObject.pause();
      }
    },
    resetTables: function() {
      this.iSearchResults = null;
      this.sSearchResults = null;
    },
    clientCredentials: function() {
      var vm = this;
      vm.axios.get('http://localhost:8888/clientCredential')
      .then(function (response) {
        vm.$cookie.set('client_access_token', response.data.access_token, { expires: '1h' });
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    getSearch: debounce(
      function () {
        this.ifPlayingPause();
        if (/\S/.test(this.searchTerm)) {
          var services = '&services=';
          this.searchPlaceholder = 'Searching...'

          var length = this.checked.length;
          if (length !== 0) {
            // add selected services to URL
            this.checked.forEach(function(v, index) {
              services += v;
              if (index !== length - 1) { services += '+' };
            });
            let accessToken = this.$cookie.get('access_token') || this.$cookie.get('client_access_token')
            let accessTokenString = '&access_token=' + accessToken;
            var vm = this;
            vm.axios.get('http://localhost:8888/search?searchTerm=' + this.searchTerm + services + accessTokenString)
            .then(function (response) {
              vm.updateTables(response.data);
            })
            .catch(function (error) {
              console.log(error)
              vm.searchPlaceholder = 'Something went wrong, please try again' + error
            })
          } else {
            this.searchPlaceholder = 'Please select service(s) to search'
            this.resetTables;
          }
        } else {
          this.searchPlaceholder = 'Please enter a search term'
          this.resetTables;
        }
      },
    // This is the number of milliseconds we wait for the user to stop typing.
    500),
    updateTables: function (data) {
      this.searchPlaceholder = ' ';
      // if data is empty, either add to table or set to null so nothing is rendered
      !isEmpty(data.spotify) ? this.sSearchResults = data.spotify : this.sSearchResults = null;
      !isEmpty(data.itunes) ? this.iSearchResults = data.itunes : this.iSearchResults = null;
      // !isEmpty(data.youtube) ? this.ySearchResults = data.youtube : this.ySearchResults = null;
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
        target.innerText = 'Playing';
        this.audioObject.addEventListener('ended', function () {
          target.classList.remove('playing');
          target.innerText = 'Preview';
        });
        this.audioObject.addEventListener('pause', function () {
          target.classList.remove('playing');
          target.innerText = 'Preview';
        });
      }
    },
    show(service) {
      this.selected = service;
      let itunes = document.getElementsByClassName('itunes');
      let spotify = document.getElementsByClassName('spotify');
      let hiddenClass = itunes[0].classList.contains('hidden') ? itunes[0].classList : spotify[0].classList;
      let visibleClass = itunes[0].classList.contains('hidden') ? spotify[0].classList : itunes[0].classList;
      if (hiddenClass.contains(service)) {
        hiddenClass.remove('hidden');
        hiddenClass.add('visible');
        visibleClass.remove('visible');
        visibleClass.add('hidden');
      }
    },
    addToWave(result) {
      if (this.audioObject) {
        this.audioObject.pause();
      }
      this.$emit('addToWave', result);
    }
  },
  // instantiate two tables, one for Spotify and one for iTunes
  components: {
    'i-search-table': SearchTable,
    's-search-table': SearchTable
    // 'y-search-table': SearchTable
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/colors.scss";

.search-area--textbox {
  padding: 5px;
  margin-bottom: 10px;
  width: 90%;
}

.search-area--container {
  position: relative;
  display: inline-block;
  width: 50%;
  @media screen and (max-width: $break-tablet) {
    width: 98%;
  }
}

.search--show-results {
  cursor: pointer;
  transition: 0.2s;
}

.search--show-results:hover {
  color: $play-color;
}

.icon-search {
  color: #17385e;
  height: 20px;
  width: 20px;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  position: absolute;
  right: 5%;
  top: 5px;
}

.result-select {
  display: none;
  @media screen and (max-width: $break-tablet) {
    display: inline-block;
    width: 49%;
  }
}

.visible {
  @media screen and (max-width: $break-tablet) {
    display: block;
  }
}
.hidden {
  display: inline-block;
  @media screen and (max-width: $break-tablet) {
    display: none;
    position: absolute;
  }
}

</style>
