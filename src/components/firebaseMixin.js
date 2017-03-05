import firebase from 'firebase/app'
require('firebase/auth');
require('firebase/database');

const config = {
  apiKey: 'AIzaSyAPL6SPIz7xx5JqPo-D5ZLnCXv0vI13UuI',
  authDomain: 'sharewave-d0ea7.firebaseapp.com',
  databaseURL: 'https://sharewave-d0ea7.firebaseio.com',
  storageBucket: 'sharewave-d0ea7.appspot.com',
  messagingSenderId: '905795275395'
};

var firebaseApp = firebase.initializeApp(config);
export default firebaseApp;
