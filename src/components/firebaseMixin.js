import firebase from 'firebase'
// require('firebase/auth');

const config = {
  apiKey: 'AIzaSyAPL6SPIz7xx5JqPo-D5ZLnCXv0vI13UuI',
  authDomain: 'sharewave-d0ea7.firebaseapp.com',
  databaseURL: 'https://sharewave-d0ea7.firebaseio.com',
  storageBucket: 'sharewave-d0ea7.appspot.com',
  messagingSenderId: '905795275395'
};

var fbApp = firebase.initializeApp(config);
export default fbApp.auth();

// export default {
//   name: 'firebaseMixin',
//   data() {
//     return {
//       firebase: null
//     }
//   },
//   methods: {
//     initializeFirebase: function() {
//       this.firebase = Firebase.initializeApp(config);
//     },
//     createEmailUser: function(email, password, callback) {
//       if (!this.firebase) {
//         this.initializeFirebase();
//       }
//       this.firebase.auth().createUserWithEmailAndPassword(email, password)
//       .then(function(response) {
//         callback(response);
//       })
//       .catch(function(error) {
//         // Handle Errors here.
//         callback({error: error});
//         // ...
//       });
//     }
//   }
// }
