<template>
  <div class="view-user">
    <div class="view-user--profile-pic" :style="cssObject(imgUrl || placeholder)"/>
    <h1 class="view-user--name">{{ displayName }}</h1>
    <div v-show="ownProfile" class="view-user--logout" @click="logout">
      <svg class="icon icon-exit"><use xlink:href="#icon-exit"></use></svg>
      <a>Logout
    </a></div>
    <h2>Friends</h2>
    <list-users :friendList="friendsArr" :remove="ownProfile" v-on:userClicked="removeFriend"></list-users>
    <symbol id="icon-exit" viewBox="0 0 32 32">
      <title>exit</title>
      <path d="M24 20v-4h-10v-4h10v-4l6 6zM22 18v8h-10v6l-12-6v-26h22v10h-2v-8h-16l8 4v18h8v-6z"></path>
    </symbol>
  </div>
</template>

<script>
import Firebase from './firebaseMixin.js'
import ListUsers from './ListUsers.vue'
import { EventBus } from './eventBus.js';
import VueNotifications from 'vue-notifications'

export default {
  name: 'ViewUser',
  data() {
    return {
      displayName: '',
      friendsArr: [],
      imgUrl: false,
      ownProfile: false,
      placeholder: '../static/placeholder.png',
      user: '',
      userRef: ''
    }
  },
  beforeMount() {
    this.getUrlParam();
    // this.getWave();
  },
  watch: {
    '$route' (to, from) {
      console.log('h');
      console.log(from.params);
      if (from.params.user !== to.params.user) {
        console.log('h2');
        this.getUrlParam();
      }
    }
  },
  methods: {
    getUrlParam() {
      this.user = this.$route.params.user;
      this.getUserDetails();
    },
    getUserDetails() {
      let unsubscribe = Firebase.auth().onAuthStateChanged(user => {
        if (this.user === user.uid.replace(/\%2E/g, '.')) {
          this.imgUrl = user.photoURL;
          this.ownProfile = true;
        } else {
          this.ownProfile = false;
        }
        unsubscribe();
      });
      this.userRef = Firebase.database().ref(`users/${this.user.replace(/\./g, '%2E')}`);
      this.userRef.once('value')
      .then(snapshot => {
        if (!this.ownProfile) {
          this.imgUrl = snapshot.child('img_url').exists() ? snapshot.val().img_url : null;
        }
        this.displayName = snapshot.val().display_name;
        // this.friends = snapshot.val().friends;
        if (snapshot.child('friends').exists()) {
          this.friendsArr = Object.keys(snapshot.val().friends).map((k) => k)
        } else {
          this.friendsArr = [];
        }
      })
    },
    removeFriend(user) {
      let index = this.friendsArr.indexOf(user.id);
      let safeUser = this.user.replace(/\./g, '%2E');
      let safeFriend = user.id.replace(/\./g, '%2E');
      if (index !== -1) {
        Firebase.database().ref(`users/${safeUser}/friends/${safeFriend}`).remove();
        this.friendsArr.splice(index, 1);
        VueNotifications.error({message: `Removed ${user.display_name} from friends`});
      }
    },
    logout() {
      EventBus.$emit('logout');
    },
    cssObject(img) {
      return {
        background: `url(${img}) top/cover no-repeat`
      }
    }
  },
  components: {
    'list-users': ListUsers
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.icon-exit {
  margin-top: -4px;
}

.view-user {
  margin-top: 10px;
}

.view-user--profile-pic {
  border-radius: 50%;
  height: 150px;
  margin: auto;
  width: 150px;
}

.view-user--logout {
  color: black;
  cursor: pointer;
  margin-bottom: 20px;
  transition: 0.25s;
}

.view-user--logout:hover {
  color: red;
}
</style>
