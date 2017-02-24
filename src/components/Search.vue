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
    </div>

    <p>{{ searchPlaceholder }}</p>

    <s-search-table
      v-on:parentPlay="playAudio"
      v-if="sSearchResults"
      :playLinkText="'Stream'"
      :searchResults="sSearchResults"
      service="Spotify"> 
    </s-search-table>

    <i-search-table 
      v-on:parentPlay="playAudio"
      v-if="iSearchResults" 
      :playLinkText="'Purchase'" 
      :searchResults="iSearchResults" 
      service="iTunes"> 
    </i-search-table>
  </div>
</template>

<script>
import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'
import debounce from 'lodash/debounce'

import SearchTable from './SearchTable.vue'

export default {
  name: 'search',
  data () {
    return {
      audioObject: null,
      checked: ['Spotify', 'iTunes'],
      searchTerm: '',
      searchPlaceholder: 'Please enter a search term',
      searchResults: '',
      iSearchResults: false,
      sSearchResults: false
    }
  },
  watch: {
    // whenever search changes, this function will run
    searchTerm: function (newSearch) {
      this.searchPlaceholder = 'Waiting for you to stop typing...'
      this.getSearch()
    }
  },
  methods: {
    getSearch: debounce(
      function () {
        if (this.audioObject) {
          this.audioObject.pause();
        }
        if (/\S/.test(this.searchTerm)) {
          var services = '&services=';
          this.searchPlaceholder = 'Searching...'

          var length = this.checked.length;
          if (length !== 0) {
            // add selected services to URL
            forEach(this.checked, function(v, index) {
              services += v;
              if (index !== length - 1) { services += '+' };
            });

            var vm = this
            vm.axios.get('http://localhost:8888/search?searchTerm=' + this.searchTerm + services)
            .then(function (response) {
              vm.searchPlaceholder = '';
              if (!isEmpty(response.data.spotify)) { vm.sSearchResults = response.data.spotify };
              if (!isEmpty(response.data.itunes)) { vm.iSearchResults = response.data.itunes };
            })
            .catch(function (error) {
              vm.searchPlaceholder = 'Could not reach the API. ' + error
            })
          } else {
            this.searchPlaceholder = 'Please select service(s) to search'
          }
        } else {
          this.searchPlaceholder = 'Please enter a search term'
          this.iSearchResults = null;
          this.sSearchResults = null;
        }
      },
    // This is the number of milliseconds we wait for the user to stop typing.
    500),
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
