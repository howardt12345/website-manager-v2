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

export const getMessages = async () => {
  let messages = [];

  await firestore
  .collection('messages')
  .get()
  .then(async snapshot => {
    snapshot.docs.forEach(doc => {
      if(doc.id !== '0') {
        var Message = class {
          constructor(data, id) {
            this.archived = data.archived;
            this.body = data.body;
            this.date = data.date;
            this.email = data.email;
            this.name = data.name;
            this.read = data.read;
            this.replied = data.replied;
            this.subject = data.subject;
            this.id = id;
          }

          toggleArchive = async () => {
            this.archived = !this.archived;
            firestore.collection('messages').doc(this.id).update({
              archived: this.archived
            });
          }

          reply = async () => {
            this.replied = true;
            window.open(encodeURI(`mailto:${this.email}?subject=RE: ${this.subject}&body=${this.body}`), '_blank');
            firestore.collection('messages').doc(this.id).update({
              replied: true
            });
          }

          markUnread = async () => {
            this.replied = false;
            firestore.collection('messages').doc(this.id).update({
              replied: false
            });
          }
        }
        messages.push(new Message(doc.data(), doc.id));
      }
    })
  });

  return messages;
}