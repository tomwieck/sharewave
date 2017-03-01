<template>
  <div class="search-table" v-bind:style="{ width: parentWidth + '%'}" id="search-table">
    <h1 class="search-table--heading">{{service}} Results</h1>
    <div v-for="result in searchResults" class="search-table--container">
      <img class="album-art" v-bind:src="result.artwork">
      <div class="search-table--container-artist"><span>{{ result.artist }}</span></div>
      <div class="search-table--container-artist"><span>{{ result.track }}</span></div>
      <div class="search-table--container-album"><span>{{ result.album }}</span></div>
      <div class="search-table--container-preview">
        <span>
          <span class="preview-link" v-on:click="parentPlay(result.previewUrl, $event)">
            <a>Preview</a>
          </span>  |  
        </span>
        <span><a v-bind:href="result.url">{{ playLinkText }}</a></span>
        <div class="search-table--container-add">
          <a href=""> Add to myWave </a>
        </div>
      </div>
    </div>   
  </div>
</template>

<script>
// import forEach from 'lodash/forEach'
export default {
  name: 'search-table',
  props: ['service', 'searchResults', 'playLinkText', 'parentWidth'],
  methods: {
    parentPlay: function(url, e) {
      this.$emit('parentPlay', url, e);
    }
  }
}
</script>

<style scoped>
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

.search-table--heading {
  width: 100%
}

.search-table--container {
  border: 2px solid #299dcf;
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
  color: #299dcf;
  font-weight: bold;
  padding-bottom: -2px;
}

.search-table--container-add a:hover {
  color: #17385e;
}

.album-art {
  float: left;
  padding-right: 10px;
  height: 62px;
}

.preview-link {
  cursor: pointer;
  text-decoration: underline;
}
</style>
