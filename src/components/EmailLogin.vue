<template>
  <div class="email-login">
  <form v-show="!signUp" @submit.prevent="emailLogin">
    <h2>Login with ShareWave</h2>
      <div class="email-login--container">
        <span>
          <input ref="emailInput" class="email-login--email input-box" placeholder="Email" v-model="email">
          <input class="email-login--password input-box" placeholder="Password" type="password" v-model="password">
        </span>
        <div class="help.is-danger" v-show="errorMessage">Incorrect Password, try again</div>
        <button class="btn btn--main">Submit</button>
      </div>
    </form>
  <div>Don't have an account? <button class="btn btn--secondary block" @click="signUp = !signUp">Sign up</button></div>
  <email-signup v-show="signUp"></email-signup>
  </div>
</template>

<script>
import Firebase from './firebaseMixin.js'
import EmailSignup from './EmailSignup.vue'

export default {
  name: 'EmailLogin',
  data() {
    return {
      email: '',
      errorMessage: '',
      password: '',
      regex: '\d.*[A-Z]|[A-Z].*\d',
      signUp: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.emailInput.focus();
    })
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
  },
  components: {
    'email-signup': EmailSignup
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/colors.scss";

.email-login--container {
  margin: 1em;
}

.email-login--email,
.email-login--password {
  display: block;
  margin: auto;
  padding: 5px;
  margin-bottom: 10px;
  width: 250px;
}
</style>
