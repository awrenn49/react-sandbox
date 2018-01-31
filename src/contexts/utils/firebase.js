import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyC8Q68Y-oPJQP_y3JQQrVrvi9fR5-n44oo",
  authDomain: "ptchat-f2a9f.firebaseapp.com",
  databaseURL: "https://ptchat-f2a9f.firebaseio.com",
  projectId: "ptchat-f2a9f",
  storageBucket: "ptchat-f2a9f.appspot.com",
  messagingSenderId: "1005356665439"
};
  
export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();  
