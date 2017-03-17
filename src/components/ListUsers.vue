<template>
  <div class="users">
    <!-- <input class="users--search" placeholder="Search..." v-model="searchTerm"> -->
      <div v-for="user in users" :key="user.display_name" @click="userClicked(user)">
        <img class="users--profile-pic" :src="user.imgUrl || placeholderUrl">
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
      placeholderUrl: '../static/placeholder.png',
      searchTerm: '',
      users: [],
      userRef: null
    }
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    // Check logged in user so yourself is not displayed
    getUsers() {
      let ref = Firebase.database().ref('users').orderByKey()
      ref.on('child_added', snapshot => {
        let childData = snapshot.val();
        childData.id = snapshot.key;
        this.users.push(childData);
      })
    },
    userClicked(user) {
      this.$emit('userClicked', user);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.users { 
  height: 300px;
  overflow: scroll;
}

.users--profile-pic {
  border-radius: 50%;
  cursor: pointer;
  display: block;
  margin: auto;
  width: 50px;
}
</style>
