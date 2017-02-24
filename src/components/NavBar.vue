<template>
  <div id="nav-bar">
    <ul class="nav-bar">
      <li><a href="/#/"><img class="logo" src="../assets/logo3.png"></a></li>
      <li><a class="nav-bar--link" href="#/search">Search</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'nav-bar'
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

.nav-bar {
  /*background-color: #bdc3c7;*/
  background-color: #299dcf;
  /*border-bottom: 2px solid #17375c;*/
  border-top: 0;
  display: inline-block;
  left: 0;
  list-style-type: none;
  margin: 0px 10%;
  padding: 0;
  text-align: left;
  top: 0;
  width: 80%;
}

.nav-bar--link {
  color: #fff;
  display: inline-block;
  font-size: 30px;
  text-decoration: none;
}

.logo {
  margin-top: 10px;
  width: 50px;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a:hover {
  color: #17375c;
}

/*logo*/
/* play - 299dcf */
/* 17375c */
</style>
