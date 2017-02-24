<template>
  <div class="search-table" id="search-table">
    <h1>{{service}} Results</h1>
    <table>
      <tr>
        <th>Artwork</th>
        <th>Artist</th>
        <th>Track</th>
        <th>Album</th>
        <th>Preview</th>
        <th>URL</th>
      </tr>
      <tr v-for="result in searchResults">
        <td><img class="album-art" v-bind:src="result.artwork"></td>
        <td>{{ result.artist }}</td>
        <td>{{ result.track }}</td>
        <td>{{ result.album }}</td>
        <td>
          <span class="preview-link" v-on:click="parentPlay(result.previewUrl, $event)">
            Preview
          </span>
        </td>
        <td><a v-bind:href="result.url">{{ playLinkText }}</a></td>
      </tr>   
    </table>  
  </div>
</template>

<script>
// import forEach from 'lodash/forEach'
export default {
  name: 'search-table',
  data () {
    return {
      audioObject: null
    }
  },
  props: ['service', 'searchResults', 'playLinkText'],
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
  width: 49%;
}

.album-art {
  width: 64px;
}

.preview-link {
  cursor: pointer;
  text-decoration: underline;
}
</style>
