<template>
  <div>
    <modal v-if="localShow" @closeButton="emitClose">
      <h3 slot="header">Login</h3>
        <button slot="body" class="btn btn--main block" @click="spotifyRedirect">
          <svg class="icon icon-spotify"><use xlink:href="#icon-spotify"></use></svg>
          <span v-if="loading">Loading...</span>
          <span v-else>With Spotify</span>
        </button>
        <a class="modal-link" slot="body" href="/#/emailLogin" v-on:click="emitClose">
          <button class="btn btn--main block">
          <svg class="icon icon-sharewave"><use xlink:href="#icon-sharewave"></use></svg>
          With ShareWave
          </button>
        </a>
      <h3 slot="footer">Don't have an account?</h3>
        <a class="modal-link" slot="footer" href="https://www.spotify.com/signup/"><button class="btn btn--secondary block">
          <svg class="icon icon-spotify"><use xlink:href="#icon-spotify"></use></svg>
          <span>Sign up for a Spotify Account</span>
        </button></a>
        <a class="modal-link" slot="footer" href="/#/emailSignup" v-on:click="emitClose">
          <button  class="btn btn--secondary block">
          <svg class="icon icon-sharewave"><use xlink:href="#icon-sharewave"></use></svg>
          Sign up for a Sharewave Account
          </button>
        </a>
    </modal>
    <symbol id="icon-spotify" viewBox="0 0 32 32">
      <title>spotify</title>
      <path d="M16 0c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.119-16-16-16zM23.363 23.119c-0.319 0.481-0.881 0.637-1.363 0.319-3.762-2.319-8.481-2.8-14.081-1.519-0.563 0.163-1.037-0.238-1.2-0.719-0.162-0.563 0.237-1.038 0.719-1.2 6.081-1.363 11.363-0.8 15.519 1.762 0.563 0.238 0.644 0.875 0.406 1.356zM25.281 18.719c-0.4 0.563-1.119 0.8-1.681 0.4-4.319-2.637-10.881-3.438-15.919-1.837-0.638 0.163-1.362-0.163-1.519-0.8-0.162-0.637 0.162-1.363 0.8-1.519 5.838-1.762 13.037-0.881 18 2.163 0.475 0.238 0.719 1.038 0.319 1.594zM25.438 14.238c-5.119-3.037-13.681-3.363-18.563-1.838-0.8 0.238-1.6-0.238-1.838-0.963-0.237-0.8 0.237-1.6 0.963-1.838 5.681-1.681 15.038-1.363 20.962 2.162 0.719 0.4 0.962 1.363 0.563 2.081-0.406 0.556-1.363 0.794-2.087 0.394z"></path>
    </symbol>
    <symbol id="icon-sharewave" width="64" height="64" viewBox="0 0 64 64">
      <title>sharewave</title>
      <g transform="scale(0.049)">
      <path d="M917 2.1C839.3 11 770.5 59.8 736 130.4c-16.3 33.4-23.2 63.5-23.4 102.8l-.1 21.7-32 19.7C640.8 299 542.3 360 443.7 421.2l-74.8 46.5-11.2-7.5c-12.8-8.5-34.6-19.4-49.3-24.5-41.4-14.5-87.6-17-129.9-7C130.1 440.1 86 467.4 53.8 506c-25.6 30.7-43.4 69.4-50.2 109.5-11 64.2 6.8 131.8 48.1 183 37.7 46.7 90.9 76.3 152.3 84.6 12.2 1.6 42.7 1.6 55 0 33.8-4.5 67.9-16.6 95.3-33.9l9.4-5.9 12.1 7.3c6.6 3.9 20 11.6 29.8 17 37.4 20.4 82.9 47.6 133.8 79.8 13.2 8.3 57.5 35.2 98.5 59.7l74.6 44.6.1 21.4c.2 36.2 5.8 63.6 19.5 94.7 12.1 27.3 28.5 50.9 50.5 72.2 71.3 69.2 177.3 85.2 265.8 40.2 68.3-34.7 115.3-102.3 124.6-179.2 1.5-12.2 1.5-40.8 0-53-6.5-53.7-30.9-102.6-69.7-140-18.7-18-36.4-30.3-59.8-41.6-54.1-26.1-114.7-30.1-171.5-11.4-35.6 11.7-62.7 28-88.7 53.3l-11.2 10.9-3.3-1.9c-1.8-1.1-40.6-25.1-86.3-53.5-79.9-49.6-163.3-101-208.6-128.6L452.3 722l2.4-8.8c10.3-38.3 10.3-82.4-.1-119.7-1.4-4.9-2.2-9.2-1.8-9.6.4-.3 42.1-25.3 92.7-55.5 50.6-30.1 103-61.8 116.5-70.3 41.5-26.2 110.5-68.1 112.3-68.1.2 0 3.9 3.4 8.3 7.6 58.4 56.1 139.6 77.7 217.8 58 42.2-10.7 78.2-31.8 109.7-64.2 62.8-64.8 81.5-161.5 47.4-246.4-11.7-29.1-28.6-54.3-52-77.5-36-35.8-82.2-58.2-133.8-65C958.9.9 929.8.7 917 2.1zM165 515.5c11.6 5.8 210.8 117.9 212.7 119.8 4.1 3.7 7.3 11.6 7.3 17.6 0 6.6-3.2 14.2-7.6 18.2-3.8 3.5-213.5 120.8-218.2 122.1-6.5 1.8-16-1.1-20.9-6.4-1.2-1.2-3.1-4.3-4.2-6.8-2-4.5-2.1-5.9-2.1-127.1V530.4l2.5-5.1c3-6 8.1-10.2 14.5-11.9 5.4-1.5 10-.9 16 2.1z"/>
      </path></g>
    </symbol>
  </div>
</template>

<script>
import Modal from './Modal.vue'
import { EventBus } from './eventBus.js'

export default {
  name: 'LoginPopup',
  components: {
    modal: Modal
  },
  data() {
    return {
      loading: false,
      localShow: false
    }
  },
  props: ['show'],
  watch: {
    show() {
      this.localShow = this.show;
    }
  },
  methods: {
    emitClose() {
      this.localShow = false;
      EventBus.$emit('close');
    },
    spotifyRedirect() {
      this.loading = true;
      this.axios.get('http://localhost:8888/login')
        .then(response => {
          if (response.data) {
            window.location.href = response.data;
          }
        })
        .catch(error => {
          console.log(error);
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/colors.scss";

.icon {
  margin-bottom: -2px;
}

.modal-link {
  text-decoration: none;
}

.btn {
  position: relative;
  width: 100%;
}

.btn--secondary {
  font-size: 16px;
}

.login-slot--link {
  border: 2px solid $play-color;
  border-radius: 5px;
  color: $logo-color;
  display: block;
  padding: 10px;
  margin: auto;
  margin-bottom: 10px;
  text-decoration: none;
  width: 200px;
}

.signup-slot--link {
  color: $logo-color;
  display: block;
  margin-bottom: 10px;
}

.login-slot--link:hover,
.signup-slot--link:hover  {
  color: $play-color;
}
</style>
