<template>
  <div id="search">
    <div class="search-area">
      <p class="search-area_text"> Search for a Song:</p>
      <input class="search-area_textbox" v-model="searchTerm">
      
      <div class="search-area_checkbox">
        <label for="Spotify">Spotify</label>
        <input type="checkbox" id="checkbox" value="Spotify" v-model="checked">
        <label for="iTunes">iTunes</label>
        <input type="checkbox" id="checkbox" value="iTunes" v-model="checked">
      </div>
      <button @click="recentlyPlayed">Get Recently Played Songs</button>
      <p>{{ searchPlaceholder }}</p>
    </div>

    <transition-group name="fade">
      <s-search-table
        v-on:parentPlay="playAudio"
        v-if="sSearchResults"
        v-bind:key="sSearchResults" 
        :searchResults="sSearchResults"
        :parentWidth = "parentWidth"
        service="Spotify"> 
      </s-search-table>

      <i-search-table 
        v-on:parentPlay="playAudio"
        v-if="iSearchResults"
        v-bind:key="iSearchResults" 
        :searchResults="iSearchResults" 
        :parentWidth = "parentWidth"
        service="iTunes"> 
      </i-search-table>
    </transition-group>
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
      searchPlaceholder: 'Please enter a search term',
      searchResults: '',
      iSearchResults: false,
      sSearchResults: false,
      parentWidth: 49
    }
  },
  beforeRouteLeave: function(to, from, next) {
    this.ifPlayingPause();
    next();
  },
  mounted: function () {
    if (!this.$cookie.get('access_token')) {
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
    recentlyPlayed: function() {
      this.getRecentlyPlayed(function(callback) {
        console.log(callback);
      })
    },
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
              vm.searchPlaceholder = 'Could not reach the API. ' + error
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
      // if two tables, split width
      this.checked.length === 2 ? this.parentWidth = 49 : this.parentWidth = 98;
      // if data is empty, either add to table or set to null so nothing is rendered
      !isEmpty(data.spotify) ? this.sSearchResults = data.spotify : this.sSearchResults = null;
      !isEmpty(data.itunes) ? this.iSearchResults = data.itunes : this.iSearchResults = null;
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
    }
  },
  // instantiate two tables, one for Spotify and one for iTunes
  components: {
    's-search-table': SearchTable,
    'i-search-table': SearchTable
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/styles.scss";

.search-area_textbox {
  padding: 5px;
  margin-bottom: 10px;
  width: 35%;
}

</style>
