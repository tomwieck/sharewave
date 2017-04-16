<template>
  <div class="email-login">
  <h2>Login with ShareWave</h2>
    <form @submit.prevent="emailLogin">
      <div class="email-login--container">
        <span>
          <input class="email-login--email" placeholder="Email" v-model="email">
          <input class="email-login--password" placeholder="Password" type="password" v-model="password">
        </span>
        <div class="help.is-danger" v-show="errorMessage">Incorrect Password, try again</div>
        <button class="btn btn--main">Submit</button>
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
    emailLogin() {
      Firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then(response => {
        this.password = null;
        this.$router.push('/');
      })
      .catch(error => {
        this.errorMessage = error.message;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/colors.scss";

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

.email-login--submit {
  background-color: white;
  border: 2px solid $play-color;
  border-radius: 5px;
  color: $logo-color;
  cursor: pointer;
  display: block;
  margin: auto;
  padding: 10px;
  text-decoration: none;
  width: 96px;
}

.email-login--submit:hover {
  text-decoration: underline;
}

</style>
