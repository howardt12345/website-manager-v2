import { firestore, storage } from '@firebase-api';
import { replaceAll } from '@utils';

const url = "https://firebasestorage.googleapis.com/v0/b/portfolio-49b69.appspot.com/o/";
const token = "ea925040-1fca-4eda-b1e8-0eb96567ab7e";

const _ = require('lodash');

class NewPhotoManager {
  constructor(pictures) {
    this.pictures = pictures;
  }

  addPhoto = async (newPic, newFile) => {

    this.pictures.add(newPic);

    var data = new Map(this.pictures.map(pic => [pic.time, `"${pic.name}",${pic.width},${pic.height}`]));
    await firestore.collection("photo")
      .doc("all")
      .set({ 'photos': data })
      .catch((error) => console.log(error));

    try {
      if(newFile) {
        await storage.ref().child("photo").child(newPic.name).put(newFile);
      }
    } catch (e) {
      console.log(e);
    }
  }

  deletePhoto = async (name) => {
    this.pictures.remove(this.pictures.find((pic) => pic.name == name));
    
    var data = new Map(this.pictures.map(pic => [pic.time, `"${pic.name}",${pic.width},${pic.height}`]));
    await firestore.collection("photo")
      .doc("all")
      .set({ 'photos': data })
      .catch((error) => console.log(error));

    try {
      await storage.ref().child("photo").child(name).delete();
    } catch (e) {
      console.log(e);
    }
  }
}


class Picture {
  constructor(key, value) {
    this.time = key;
    this.name = value.split('"')[1];
    this.width = parseInt(value.split(",")[1]);
    this.height = parseInt(value.split(",")[2]);
  }

  /**
   * Gets the url for this picture.
   * @param {String} url    The url of the storage reference.
   * @param {String} token  The token for the firebase storage.
   * @return {String}       The url for this picture.
   */
  getUrl = () => `${url}photo%2F${replaceAll(this.name, ' ', '%20')}?alt=media&token=${token}`;
}

export const fromFirestoreNew = async () => {
  var list = [];

  await firestore
  .collection("photo")
  .doc("all")
  .get().then(response => {
      const data = response.data();
      const map = data.photos;
      for(const [key, value] of Object.entries(map)) {
        list.push(new Picture(key, value));
      }
  });

  return new NewPhotoManager(list);
}