import firebase from 'firebase'
var firebaseConfig = {
  apiKey: "AIzaSyCY5s82r4lSIsIHVICANehv9FUrp08mmF8",
  authDomain: "find-fake.firebaseapp.com",
  databaseURL: "https://find-fake.firebaseio.com",
  projectId: "find-fake",
  storageBucket: "",
  messagingSenderId: "827372343574",
  appId: "1:827372343574:web:301239e6df0562fa068037"
};
// Initialize Firebase
let cf = firebase.initializeApp(firebaseConfig);
export const auth = cf.auth();