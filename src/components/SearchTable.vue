<template>
  <div class="search-table" id="search-table">
    <h1 class="search-table--heading">{{service}} Results</h1>
    <small class="search-table--small">Provided courtesy of {{service}}</small>
    <transition-group name="fade" mode="out-in">
    <div :key="result" v-for="result in searchResults" class="search-table--container">
      <img class="search-table--album-art" v-bind:src="result.artwork">
      <div class="search-table--container-details">
        <!-- <span v-if="service === 'YouTube'"><div>{{ result.title }}</div></span> -->
        <div class="search-table--container-artist"><span><b>{{ result.artist }}</b></span></div>
        <div class="search-table--container-track"><span>{{ result.track }}</span></div>
        <div class="search-table--container-album"><span>{{ result.album }}</span></div>
      </div>
      <div class="search-table--container-links">
        <div class="btn btn--secondary search-table--preview-link" v-on:click="parentPlay(result.previewUrl, $event)">
          <!-- Need to refactor playing logic for icon <svg class="icon icon-play3"><use xlink:href="#icon-play3"></use></svg> -->
          <a>Preview</a>
        </div>
        <div @click="addToWave(result)" class="btn btn--main search-table--container-add">
          <a>
            <svg class="icon icon-plus"><use xlink:href="#icon-plus"></use></svg>
            Add to Wave
          </a>
        </div>
        <div v-if="service === 'iTunes'" class="search-table--badge-container">
          <a v-bind:href="result.url" target="_blank"><img :src="itunesBadge"></a>
        </div>
        <div v-else class="search-table--badge-container">
          <a v-bind:href="result.url"><img class="search-table--spotify-badge" :src="spotifyBadge"></a>
        </div>
      </div>
    </div>
    </transition-group>
    <symbol id="icon-plus" viewBox="0 0 32 32">
      <title>plus</title>
      <path d="M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z"></path>
    </symbol>
    <symbol id="icon-play3" viewBox="0 0 32 32">
      <title>play3</title>
      <path d="M6 4l20 12-20 12z"></path>
    </symbol>
    <symbol id="icon-stop2" viewBox="0 0 32 32">
      <title>stop2</title>
      <path d="M4 4h24v24h-24z"></path>
    </symbol>
  </div>
</template>

<script>
export default {
  name: 'search-table',
  data: () => ({
    itunesBadge: '../static/itunes.svg',
    spotifyBadge: '../static/spotifyBadge.svg'
  }),
  props: ['service', 'searchResults', 'parentWidth', 'playing'],
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
@import "../assets/sass/colors.scss";

table {
  table-layout:fixed;
  width: 100%;
}

.search-table {
  float: left;
  width: 50%;
  @media screen and (max-width: $break-tablet) {
    width: 100%;
  }
}

.search-table--small {
  display: block;
}

.search-table--heading {
  margin: 0;
  width: 100%;
  @media screen and (max-width: $break-tablet) {
    display: none;
  }
}

.search-table--container {
  border: 2px solid $play-color;
  display: block;
  height: 110px;
  margin-bottom: 0;
  margin: 5px;
}

.search-table--album-art {
  float: left;
  height: 100%;
  @media screen and (max-width: $break-wide) {
    height: 65px;
    width: 65px;
  }
}

.search-table--container-details {
  float: left;
  text-align: left;
  margin-left: 10px;
  width: calc(100% - 122px);
}

.search-table--container-track,
.search-table--container-artist,
.search-table--container-album {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-table--container-links {
  display: inline-block;
  height: 45px;
  width: calc(100% - 112px);
  @media screen and (max-width: $break-wide) {
    padding-top: 2px;
    width: 100%;
  }
}

.search-table--preview-link,
.search-table--container-add {
  // border-left: none;
  margin: 0 5px;
  cursor: pointer;
  display: inline-block;
  text-decoration: none;
  font-size: 16px;
  padding: 8px 0;
  width: calc((100% - 155px) / 2);
  float: left;
  max-width: 200px;
  @media screen and (max-width: $break-wide) {
    font-size: 15px;
    max-width: 300px;
  }
  @media screen and (max-width: $break-mobile) {
    font-size: 12px;
    margin-top: 5px;
  }
}

.search-table--badge-container {
  // border-top: 2px solid #299dcf;
  display: inline-block;
  float: left;
  width: 110px;
  margin: 0 5px;
}

.search-table--spotify-badge {
  width: 100%;
}

.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  font-size: 10px;
}

.icon-plus {
  @media screen and (max-width: $break-mobile) {
    display: none;
  }
}
</style>
