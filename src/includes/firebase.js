import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAhLgpXfCb8cxKeSdVYH_nRIsdUBwtdULY",
  authDomain: "music-510d4.firebaseapp.com",
  projectId: "music-510d4",
  storageBucket: "music-510d4.appspot.com",
  messagingSenderId: "54131006006",
  appId: "1:54131006006:web:9e9c5dd73cc9937d0bd697",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const usersCollection = db.collection("users");

export { auth, db, usersCollection };
