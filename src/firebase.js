import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { firebaseConfig } from '@vars';

const proxyurl = "https://cors-anywhere.herokuapp.com/";

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

const provider = new firebase.auth.GoogleAuthProvider();

const dev = true;

export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};

export const signIn = async (email, pass) => {
  let error = '';
  await auth.signInWithEmailAndPassword(email, pass).catch(e => {
    error = e.message
  });
  return error;
}
export const signOut = async () => {
  let error = '';
  await auth.signOut().catch(e => {
    error = e.message
  });
  return error;
}

export const uploadFile = async (file, id, ext, hash, api, apiList) => {

}

const upload = async (props, apiList) => {

}

export const deleteFile = async (id, ext, hash, api, apiList) => {
  
}

export const tinyccApi = async () => {
  
}