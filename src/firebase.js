import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCWIxXQ7u9VbNQRg21pOwRYd1p5i7I0xCI",
  authDomain: "portfolio-49b69.firebaseapp.com",
  databaseURL: "https://portfolio-49b69.firebaseio.com",
  projectId: "portfolio-49b69",
  storageBucket: "portfolio-49b69.appspot.com",
  messagingSenderId: "1036625872430",
  appId: "1:1036625872430:web:46c11c7fdbd73b6b8e81bf",
  measurementId: "G-1RHVFTPQMT"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

const provider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};