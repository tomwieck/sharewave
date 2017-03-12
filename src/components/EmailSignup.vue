<template>
  <div class="email-signup">
    <form @submit.prevent="validateBeforeSubmit">
      <div class="email-signup--container">
        <span :class="{ 'control': true }">
          <input 
            class="email-signup--usr" 
            data-vv-delay="500"
            name="username" 
            placeholder="Name"
            v-model="username" 
            v-validate="'required|min:6'" 
            >
          <transition name="fade">
            <span v-show="errors.has('username')" class="help is-danger">{{ errors.first('username') }}</span>
          </transition>

          <input 
            class="email-signup--email" 
            data-vv-delay="500"
            name="email" 
            placeholder="Email"
            type="text" 
            v-model="email" 
            v-validate="'required|email'" 
            >
          <transition name="fade">
            <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
          </transition>

          <input 
            class="email-signup--password"
            name="password" 
            placeholder="Password"
            type="password"
            v-model="password" 
            v-validate="{ rules: { required: true, min: 6, regex: /\d.*[A-Z]|[A-Z].*\d/}}"
            >
          <transition name="fade">
            <span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
          </transition>

          <span class="email-signup--label">Password must:
            <ul class="email-signup--list">
              <li>- Be longer than 6 characters</li>
              <li>- Contain atleast 1 number</li>
              <li>- Contain atleast 1 Uppercase Letter</li>
            </ul>
          </span>
        </span>
        <div class="help is-danger"v-if="errorMessage"> {{ errorMessage }}</div>
        <button> Submit </button>
      </div>
    </form>
  </div>
</template>

<script>
import Firebase from './firebaseMixin.js'

export default {
  name: 'EmailSignup',
  data() {
    return {
      email: '',
      errorMessage: '',
      password: '',
      regex: '\d.*[A-Z]|[A-Z].*\d',
      username: ''
    }
  },
  mounted: function() {
    this.registerStateChange();
  },
  methods: {
    emailSignup: function() {
      let vm = this;
      Firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
      .then(function(response) {
        vm.updateProfile();
      })
      .catch(function(error) {
        vm.errorMessage = error.message;
      });
    },
    updateProfile: function() {
      var user = Firebase.auth().currentUser;
      user.updateProfile({
        displayName: this.username
      });
    },
    validateBeforeSubmit: function() {
      // Validate All returns a promise and provides the validation result.
      this.$validator.validateAll()
      .then(success => {
        this.emailSignup();
        return false;
      })
    },
    registerStateChange: function() {
      // Test if needed or if handled by Login listener
      let vm = this;
      Firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          vm.$router.push('/');
        } else {
          console.log('not signed in');
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/styles.scss";

.email-signup--label {
  display: block;
  font-size: 14px;
  padding-bottom: 12px;
  margin: auto;
  text-align: left;
  width: 250px;
}

.email-signup--container {
    margin: 1em;
}

.email-signup--list {
  list-style: none;
  -webkit-margin-before: 0;
  -webkit-padding-start: 0;
}

.email-signup--usr,
.email-signup--email,
.email-signup--password {
  display: block;
  margin: auto;
  padding: 5px;
  margin-bottom: 10px;
  width: 250px;
}
</style>
