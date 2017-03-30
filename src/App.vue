<template>
  <div id="app">
    <nav-bar></nav-bar>
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import miniToastr from 'mini-toastr'

export default {
  name: 'app',
  components: {
    'nav-bar': NavBar
  },
  mounted() {
    miniToastr.init();
  }
}
</script>

<style lang="scss">
@import "./assets/sass/styles.scss";
.block {
  display: block;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.mini-toastr {
  bottom: 12px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  top: auto !important;
}

.mini-toastr__notification {
  animation: fadein 0.5s;
  opacity: 1 !important;
}

@keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}

body {
  margin: 0;
}

/*logo*/
/* play - 299dcf */
/* 17375c */
</style>
