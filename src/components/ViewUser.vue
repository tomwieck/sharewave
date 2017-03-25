<template>
  <div class="view-user">
    <img class="view-user--cover" v-bind:src="imgUrl">
  </div>
</template>

<script>
import Firebase from './firebaseMixin.js'

export default {
  name: 'Home',
  data() {
    return {
      user: ''
    }
  },
  mounted() {
    this.getUrlParam();
  },
  methods: {
    getUrlParam() {
      this.user = this.$route.params.user;
    },
    getuserDetails() {
      Firebase.database().ref(`users/${this.user}`).once('value')
        .then(snapshot => {
          console.log(snapshot.val());
        })
    },
    getuserImage() {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.view-user--cover {
  width: 300px;
}
</style>
