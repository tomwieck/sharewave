<template>
  <div class="search-table" v-bind:style="{ width: parentWidth + '%'}" id="search-table">
    <h1 class="search-table--heading">{{service}} Results</h1>
    <small class="search-table--small">Provided courtesy of {{service}}</small>
    <div v-for="result in searchResults" class="search-table--container">
      <img class="album-art" v-bind:src="result.artwork">
      <div class="search-table--container-details">
        <div class="search-table--container-artist"><span>{{ result.artist }}</span></div>
        <div class="search-table--container-artist"><span>{{ result.track }}</span></div>
        <div class="search-table--container-album"><span>{{ result.album }}</span></div>
      </div>
      <div class="search-table--container-preview">
        <span class="preview-link--wrapper">
          <span class="preview-link" v-on:click="parentPlay(result.previewUrl, $event)">
            <a>Preview</a>
          </span>
          <span v-if="service === 'iTunes'">
            <a v-bind:href="result.url"><img :src="itunesBadge"></a>
          </span>
          <span class="search-table--spotify-container" v-else>
            <a v-bind:href="result.url"><img class="search-table--spotify-badge" :src="spotifyBadge"></a>
          </span>
        </span>
        <div class="search-table--container-add">
          <a @click="addToWave(result)"> Add to myWave </a>
        </div>
      </div>
    </div>   
  </div>
</template>

<script>
// import forEach from 'lodash/forEach'
export default {
  name: 'search-table',
  data: () => ({
    itunesBadge: '../static/itunes.svg',
    spotifyBadge: '../static/spotifytext.png'
  }),
  props: ['service', 'searchResults', 'parentWidth'],
  methods: {
    parentPlay(url, e) {
      this.$emit('parentPlay', url, e);
    },
    addToWave(result) {
      this.$emit('tableToSearch', result);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/styles.scss";

table {
  table-layout:fixed;
  width: 100%;
}

td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; 
}

.search-table {
  float: left;
  margin-bottom: 10px;
}

.search-table--small {
  display: block;
}

.search-table--heading {
  margin: 0;
  width: 100%
}

.search-table--container {
  border: 2px solid $play-color;
  border-radius: 5px;
  display: inline-block;
  height: auto;
  padding: 10px 2%;
  margin: 5px 2%;
  margin-bottom: 0;
  width: 40%;
}

.search-table--container-artist,
.search-table--container-album {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-table--container-preview {
  display: inline-block;
}

.search-table--container-add a {
  color: $play-color;
  font-weight: bold;
  padding-bottom: -2px;
  cursor: pointer;
}

.search-table--container-add a:hover {
  color: $logo-color;
}

.search-table--container-details {
  margin-bottom: 10px;
}

.search-table--spotify-container {
  display: inline-block;
  font-size: 20px;
  text-align: bottom;
  height: 40px;
  width: 100px;
}

.search-table--spotify-badge {
  display: inline-block;
  float: left;
  width: 120px;
}

.album-art {
  float: left;
  padding-right: 10px;
  height: 62px;
}

.preview-link {
  border: 2px solid $play-color;
  border-radius: 5px;
  color: $logo-color;
  cursor: pointer;
  display: inline-block;
  float: left;
  padding: 7px;
  margin-right: 10px;
  text-decoration: none;
  width: 96px; 
}

.login-slot--link {
 
}
</style>
