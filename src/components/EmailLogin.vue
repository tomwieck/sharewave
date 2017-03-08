<template>
  <div class="email-login">
    <form @submit.prevent="emailLogin">
      <div class="email-login--container">
        <span>
          <input class="email-login--email" placeholder="Email" v-model="email"  >
          <input class="email-login--password" placeholder="Password" type="password" v-model="password">
        </span>
        <button> Submit </button>
      </div>
    </form>
  </div>    
</template>

<script>
import Firebase from './firebaseMixin.js'

export default {
  name: 'EmailLogin',
  data() {
    return {
      email: '',
      errorMessage: '',
      password: '',
      regex: '\d.*[A-Z]|[A-Z].*\d',
      username: ''
    }
  },
  methods: {
    emailLogin: function() {
      let vm = this;
      Firebase.auth().signInWithEmailAndPassword(vm.email, vm.password)
      .then(function(response) {
        vm.password = null;
        vm.$router.push('/');
      })
      .catch(function(error) {
        vm.errorMessage = error.message;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
// @import "../assets/sass/styles.scss";

// verifying classes
.help.is-danger {
  color: red;
  display: block;
  font-size: 12px;
  margin-bottom: 12px;
}

.email-login--label {
  display: block;
  font-size: 14px;
  padding-bottom: 12px;
  margin: auto;
  text-align: left;
  width: 250px;
}

.email-login--container {
    margin: 1em;
}

.email-login--list {
  list-style: none;
  -webkit-margin-before: 0;
  -webkit-padding-start: 0;
}

.email-login--usr,
.email-login--email,
.email-login--password {
  display: block;
  margin: auto;
  padding: 5px;
  margin-bottom: 10px;
  width: 250px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
  transition: opacity 0.5s
}

</style>
