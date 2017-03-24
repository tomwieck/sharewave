<template>
  <div class="users">
    <!-- <input class="users--search" placeholder="Search..." v-model="searchTerm"> -->
      <div class="users--user" v-for="user in users" :key="user.display_name">
        <img class="users--profile-pic" :src="user.img_url || placeholderUrl">
        <span>{{ user.display_name }}</span>
        <small>{{ user.email }}</small>
        <span class="users--add-user" @click="userClicked(user)">Add to Friends</span>
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
span {
  display: block;
}
.users { 
  height: 300px;
  overflow: scroll;
}

.users--user {
  padding-bottom: 10px;
}

.users--add-user {
  cursor: pointer;
  font-weight: bold;
}

.users--add-user:hover {
  text-decoration: underline;
}

.users--profile-pic {
  border-radius: 50%;
  display: block;
  margin: auto;
  width: 70px;
}
</style>
