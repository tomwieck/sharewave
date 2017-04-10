<template>
  <div class="view-user">
    <img class="view-user--profile-pic" v-bind:src="imgUrl || placeholder ">
    <h1 class="view-user--name">{{ displayName }}</h1>
    <div v-show="ownProfile" class="view-user--logout" @click="logout"><a>Logout</a></div<>
    <h2>Friends</h2>
    <list-users :friendList="friendsArr" :remove="ownProfile" v-on:userClicked="removeFriend"></list-users>
  </div>
</template>

<script>
import Firebase from './firebaseMixin.js'
import ListUsers from './ListUsers.vue'
import { EventBus } from './eventBus.js';
import VueNotifications from 'vue-notifications'

export default {
  name: 'Home',
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
    this.getuserDetails();
    // this.getWave();
  },
  methods: {
    getUrlParam() {
      this.user = this.$route.params.user;
    },
    getuserDetails() {
      let unsubscribe = Firebase.auth().onAuthStateChanged(user => {
        if (this.user === user.uid.replace(/\%2E/g, '.')) {
          this.imgUrl = user.photoURL;
          this.ownProfile = true;
        };
        unsubscribe();
      });
      this.userRef = Firebase.database().ref(`users/${this.user.replace(/\./g, '%2E')}`);
      this.userRef.once('value')
      .then(snapshot => {
        if (!this.imgUrl) {
          this.imgUrl = snapshot.child('img_url').exists ? snapshot.val().img_url : null
        }
        this.displayName = snapshot.val().display_name;
        // this.friends = snapshot.val().friends;
        this.friendsArr = Object.keys(snapshot.val().friends).map((k) => k)
      })
    },
    removeFriend(user) {
      console.log(this.user.replace(/\./g, '%2E'));
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
      // Firebase.auth().signOut()
      //   .then(() => {
      //     Login.resetDetails();
      //     this.$cookie.delete('access_token', {domain: 'localhost'});
      //     this.$cookie.delete('refresh_token', {domain: 'localhost'});
      //     this.$router.push('/');
      //   });
    }
    // getWave() {

    // }
  },
  components: {
    'list-users': ListUsers
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.view-user {
  margin-top: 10px;
}

.view-user--profile-pic {
  border-radius: 50%;
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
