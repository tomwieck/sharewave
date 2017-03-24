<template>
  <div class="email-signup">
    <h2>Sign Up for a ShareWave Account</h2>
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
        <button class="email-signup--submit"> Submit </button>
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
      username: ''
    }
  },
  methods: {
    // ADD LOADING...
    emailSignup() {
      Firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
      .then(response => {
        var user = Firebase.auth().currentUser;
        this.updateProfile(user);
        this.addToUserDb(user);
      })
      .catch(error => {
        this.errorMessage = error.message;
      });
    },
    updateProfile(user) {
      return user.updateProfile({
        displayName: this.username
      });
    },
    addToUserDb(user) {
      // Check if display name is already in use?
      // Allow image upload (S3?)
      Firebase.database().ref('users/' + user.uid).set({
        display_name: this.username,
        email: this.email,
        spotify: false,
        wave: false
      })
      .then(() => {
        Firebase.auth().signOut()
          .then(() => {
            Firebase.auth().signInWithEmailAndPassword(this.email, this.password)
              .then(() => {
                this.$router.push(`/`);
              });
          });
      });
    },
    validateBeforeSubmit() {
      // Validate All returns a promise and provides the validation result.
      this.$validator.validateAll()
      .then(success => {
        this.emailSignup();
        return false;
      })
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

.email-signup--submit {
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

.email-signup--submit:hover {
  text-decoration: underline;
}
</style>
