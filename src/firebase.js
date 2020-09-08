import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { firebaseConfig } from '@vars';
import { replaceAll, mergeTypedArrays } from '@utils';

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
            this.body = decodeURIComponent(data.body);
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
            await firestore.collection('messages').doc(this.id).update({
              archived: this.archived
            });
          }

          reply = async () => {
            this.replied = true;
            console.log(`mailto:${this.email}?subject=RE: ${encodeURI(this.subject)}&body=${replaceAll(encodeURI(this.body),'%0A', '<br>')}`);
            window.open(`mailto:${this.email}?subject=RE: ${encodeURI(this.subject)}&body=${replaceAll(encodeURI(this.body),'%0A', '<br>')}`, '_blank');
            await firestore.collection('messages').doc(this.id).update({
              replied: true
            });
          }

          markUnread = async () => {
            this.replied = false;
            await firestore.collection('messages').doc(this.id).update({
              replied: false
            });
          }

          deleteMessage = async () => {
            await firestore.collection('messages').doc(this.id).delete().then(() => {
              console.log(`${this.id} has been deleted. `)
            });
          }
        }
        messages.push(new Message(doc.data(), doc.id));
      }
    })
  });

  return messages;
}

/**
 * Moves a file in firebase storage from its current location to the destination
 * returns the status object for the moved file.
 * @param {String} currentPath The path to the existing file from storage root
 * @param {String} destinationPath The desired pathe for the existing file after storage
 */
export const moveFirebaseFile = (currentPath, destinationPath) => {
  let oldRef = storage.ref().child(currentPath);

  oldRef.getDownloadURL().then(url => {
    fetch((dev ? proxyurl : '') + url).then(htmlReturn => {
      let fileArray = new Uint8Array();
      const reader = htmlReturn.body.getReader();
      //get the reader that reads the readable stream of data
      reader
      .read()
      .then(function appendStreamChunk({ done, value }) {
        //If the reader doesn't return "done = true" append the chunk that was returned to us
        // rinse and repeat until it is done.
        if (value) {
          fileArray = mergeTypedArrays(fileArray, value);
        }
        if (done) {
          console.log(fileArray);
          return fileArray;
        } else {
          // "Readout not complete, reading next chunk"
          return reader.read().then(appendStreamChunk);
        }
      })
      .then(file => {
        //Write the file to the new storage place
        let status = storage
          .ref()
          .child(destinationPath)
          .put(file);
        //Remove the old reference
        oldRef.delete();
        return status;
      });
    });
  });
}