<template>
  <div class="users">
    <!-- <input class="users--search" placeholder="Search..." v-model="searchTerm"> -->
    <div class="users--user" v-for="user in addedFriends" :key="user.display_name">
      <img class="users--profile-pic" :src="user.img_url || placeholderUrl">
      <span><a :href="'/#/user/' + user.id">{{ user.display_name }}</a></span>
      <small class="users--email">{{ user.email }}</small>
      <button @click="userClicked(user)" v-show="add" class="btn btn--secondary users--button">
        Follow
        <svg class="icon icon-user-plus">
          <use xlink:href="#icon-user-plus"></use>
        </svg>
      </button>
      <button @click="userClicked(user)" v-show="remove" class="btn btn--main users--button">
        Unfriend
        <svg class="icon icon-user-minus">
          <use xlink:href="#icon-user-minus"></use>
        </svg>
      </button>
    </div>
  <symbol id="icon-user-plus" viewBox="0 0 32 32">
    <title>user-plus</title>
    <path d="M12 23c0-4.726 2.996-8.765 7.189-10.319 0.509-1.142 0.811-2.411 0.811-3.681 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h12.416c-0.271-0.954-0.416-1.96-0.416-3z"></path>
    <path d="M23 14c-4.971 0-9 4.029-9 9s4.029 9 9 9c4.971 0 9-4.029 9-9s-4.029-9-9-9zM28 24h-4v4h-2v-4h-4v-2h4v-4h2v4h4v2z"></path>
  </symbol>
  <symbol id="icon-user-minus" viewBox="0 0 32 32">
    <title>user-minus</title>
    <path d="M12 23c0-4.726 2.996-8.765 7.189-10.319 0.509-1.142 0.811-2.411 0.811-3.681 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h12.416c-0.271-0.954-0.416-1.96-0.416-3z"></path>
    <path d="M23 14c-4.971 0-9 4.029-9 9s4.029 9 9 9c4.971 0 9-4.029 9-9s-4.029-9-9-9zM28 24h-10v-2h10v2z"></path>
  </symbol>
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
  props: ['add', 'friendList', 'remove'],
  mounted() {
    this.getUsers();
  },
  computed: {
    addedFriends() {
      if (this.friendList) {
        return this.users.filter(friend => {
          return this.friendList.includes(friend.id);
        })
      } else {
        return this.users;
      }
    }
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

<style lang="scss" scoped>
@import "../assets/sass/colors.scss";

a {
  color: $logo-color;
  text-decoration: none;
  transition: 0.3s;
}

a:hover {
  color: $play-color;
}

span {
  display: block;
}

.users {
  background-color: $light-grey;
  max-height: 500px;
  overflow-y: scroll;
}

.users--user {
  display: inline-block;
  position: relative;
  padding-bottom: 10px;
  margin: 5px;
  width: 150px;
}

.users--add-user {
  cursor: pointer;
  font-weight: bold;
}

.users--add-user:hover {
  text-decoration: underline;
}

.users--profile-pic {
  border: 2px solid $play-color;
  border-radius: 50%;
  display: inline-block;
  margin: auto;
  width: 70px;
}

.users--email {
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
}

.users--button {
  /*font-size:*/
  padding-right: 30px;
  position: relative;
}

.icon {
  position: absolute;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  font-size: 20px;
  bottom: 5px;
  right: 5px;
}
</style>