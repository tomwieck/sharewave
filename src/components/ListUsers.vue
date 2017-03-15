<template>
  <div class="users">
    <!-- <input class="users--search" placeholder="Search..." v-model="searchTerm"> -->
      <div v-for="user in users" :key="user.display_name" @click="userClicked(user)">
        <span>{{ user.display_name }}</span>
        <small>{{ user.email }}</small>
      </div>
  </div>
</template>

<script>
import Firebase from './firebaseMixin.js'

export default {
  name: 'ListUsers',
  data() {
    return {
      searchTerm: '',
      users: [],
      userRef: null
    }
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      console.log('here');
      // console.log(this.userRef.toString());
      let ref = Firebase.database().ref('users').orderByKey()
      ref.once('value')
        .then(snapshot => {
          this.users = snapshot.val();
        })
    },
    userClicked(user) {
      this.$emit('user-clicked', user);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.users { 
  height: 100px;
  overflow: scroll;
}
</style>
