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
@import url('https://fonts.googleapis.com/css?family=Comfortaa|Raleway');
</style>
