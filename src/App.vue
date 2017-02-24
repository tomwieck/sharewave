<template>
  <div id="app">
    <nav-bar></nav-bar>
    <router-view></router-view>
  </div>
</template> 

<script>
import NavBar from './components/NavBar.vue'

export default {
  name: 'app',
  components: {
    'nav-bar': NavBar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
}

/*logo*/
/* play - 299dcf */
/* 17375c */
</style>
