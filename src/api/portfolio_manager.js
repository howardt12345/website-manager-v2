import { downloadFile, firestore, moveFirebaseFile, storage } from '@firebase-api';
import { currentTime, replaceAll, capitalize, filter } from '@utils';

const _ = require('lodash');

const url = "https://firebasestorage.googleapis.com/v0/b/portfolio-49b69.appspot.com/o/";
const token = "ea925040-1fca-4eda-b1e8-0eb96567ab7e";

//Modified from the Portfolio Manager used in website-v2 with additional functions for editing.

class PortfolioManager {
  constructor(menu) {
    this.menu = menu;
  }

  /**
   * Gets all the categories of the Picture Manager.
   * @return {!Array<String>} The list of categories.
   */
  getCategories = () => [...this.menu.keys()];
  /**
   * Gets all the categories of the Picture Manager, but capitalzed.
   * @return {!Array<String>} The list of categories but capitalized.
   */
  getCategoriesCapitalized = () => [...[...this.menu.keys()].map(category => capitalize(category))];
  /**
   * Gets all the categories of the Picture Manager, but in lowercase.
   * @return {!Array<String>} The list of categories, but in lowercase.
   */
  getCategoriesLowercase = () => [...[...this.menu.keys()].map(category => category.toLowerCase())];
  /**
   * Gets the category name at the given index.
   * @param {Number} index  The index to get category from. 
   * @return {String}       The category name at the given index.
   */
  getCategory = (index) => [...this.menu.keys()][index];

  getIconAt = (category) => this.getPicturesAt(category, 'icon')[0].name;
  getIconFrom = (index) => this.getPicturesFrom(index, 0)[0].name;

  /**
   * Gets the subcategories at the given category name.
   * @param {String} category The category to get the subcategories from.
   * @return {!Array<String>} The list of subcategories at the given category name.
   */
  getSubcategoriesAt = (category) => [...this.menu.get(category).keys()];  
  /**
  * Gets the subcategories at the given category name, but in lowercase.
  * @param {String} category  The category to get the subcategories from.
   * @return {!Array<String>} The list of subcategories at the given category name, but in lowercase.
  */
  getSubcategoriesAtLowercase = (category) => [...[...this.menu.get(category).keys()].map(s => s.toLowerCase())];
  /**
   * Gets the subcategories at the given category index.
   * @param {Number} index    The index of the category to get the subcategories from.
   * @return {!Array<String>} The list of subcategories at the given category index.
   */
  getSubcategoriesFrom = (index) => [...this.menu.get([...this.menu.keys()][index]).keys()];

  /**
   * Gets the subcategory name from the given category and subcategory index. Defaults to 'All' if the subcategory index is 0, regardless of category index.
   * @param {*} categoryIndex     The index of the category to get the subcategories from.
   * @param {*} subcategoryIndex  The index of the subcategory to get the name from.
   */
  getSubcategoryFrom = (categoryIndex, subcategoryIndex) => subcategoryIndex === 0 ? 'All' : this.getSubcategoriesFrom(categoryIndex)[subcategoryIndex];
  /**
   * Gets the list of pictures at the given category and subcategory keys.
   * @param {String} category     The category to get the pictures from.
   * @param {String} subcategory  The subcategory to get the pictures from.
   * @return {!Array<Picture>}    The list of pictures at the given category and subcategory keys.
   */
  getPicturesAt = (category, subcategory) => this.menu.get(category).get(subcategory);
  /**
   * Gets the list of pictures at the given category and subcategory indices.
   * @param {Number} category     The category to get the pictures from.
   * @param {Number} subcategory  The subcategory to get the pictures from.
   * @return {!Array<Picture>}    The list of pictures at the given category and subcategory indices.
   */
  getPicturesFrom = (category, subcategory) => this.menu.get([...this.menu.keys()][category]).get([...this.menu.get([...this.menu.keys()][category]).keys()][subcategory]);

  /**
   * Gets all the pictures at the given category name.
   * @param {String} category   The category to get the pictures from.
   * @return {!Array<Picture>}  The list of pictures at the given category name.
   */
  getAllPicturesAt = (category) => this.getPicturesAt(category, 'icon').filter(pic => pic.width !== 0 && pic.height !== 0);
    /**
   * Gets all the pictures at the given category index.
   * @param {Number} index      The category to get the pictures from.
   * @return {!Array<Picture>}  The list of pictures at the given category index.
   */
  getAllPicturesFrom = (index) => this.getPicturesAt(this.getCategory(index), 'icon').filter(pic => pic.width !== 0 && pic.height !== 0);

  /**
   * Gets all the picture urls in a given category name.
   * @param {String} category   The category to get the pictures from.
   * @return {!Array<String>}   The list of picture urls at the given category name.
   */
  getAllUrlsAt = (category) => [...this.getAllPicturesAt(category).map((pic) => `${url}${replaceAll(pic.path, '/', '%2F')}%2F${replaceAll(pic.name, ' ', '%20')}?alt=media&token=${token}`)];
  /**
   * Gets all the picture urls in a given category index.
   * @param {Number} index    The category to get the pictures from.
   * @return {!Array<String>} The list of picture urls at the given category index.
   */
  getAllUrlsFrom = (index) => [...this.getAllPicturesFrom(index).map((pic) => `${url}${replaceAll(pic.path, '/', '%2F')}%2F${replaceAll(pic.name, ' ', '%20')}?alt=media&token=${token}`)];
  /**
   * Gets all the picture urls for a given list of pictures.
   * @param {!Array<Picture>} pictures  The list of pictures to get urls for.
   * @return {!Array<String>}           The list of picture urls for the given list of pictures.
   */
  getUrlsFor = (pictures) => [...pictures.map((pic) => `${url}${replaceAll(pic.path, '/', '%2F')}%2F${replaceAll(pic.name, ' ', '%20')}?alt=media&token=${token}`)];

  /**
   * Gets all the pictures in the Picture Manager
   * @return {!Array<Picture>} A list of all the pictures in the Picture Manager.
   */
  getAllPictures = () => {
    let tmp = [];
    this.getCategories().forEach(category => tmp = tmp.concat(this.getAllPicturesAt(category)));
    tmp.sort((a, b) => b.time.localeCompare(a.time));
    return tmp;
  }

  /**
   * Gets the true category name from a given query string.
   * @param {String} query  The query string to search.
   * @return {String}       The true category name of the query string.
   */
  trueCategoryName = (query) => {
    let result = ''
    this.getCategories().forEach(category => {
      if(category.toLowerCase().localeCompare(query.toLowerCase()) === 0) {
        result = category;
      }
    });
    return result;
  }

  /**
   * Gets the true subcategory name from a given category and query string. If the query string is "misc", this returns "Miscellaneous".
   * @param {String} category The category to search in.
   * @param {String} query    The query string to search.
   * @return {String}         The true subcategory name of the query string.
   */
  trueSubcategoryName = (category, query) => {
    if(query.toLowerCase().localeCompare('misc') === 0) {
      return 'Miscellaneous';
    } else {
      let result = ''
      this.getSubcategoriesAt(this.trueCategoryName(category)).forEach(sc => {
        if(sc.toLowerCase().localeCompare(query.toLowerCase()) === 0) {
          result = sc;
        }
      });
      return result;
    }
  }

  /**
   * Searches for images in a given query string, and returns whether the query contains any pictures.
   * By default, a trailing forward slash ('.../') or '.../all' will search for the category preceding the forward slash.
   * @param {String} query  The query string to search.
   * @return {Boolean}      Whether the query contains any pictures.
   */
  hasPictures = (query) => {
    let raw = filter(query.split('/'));
    if(raw.length === 1) {
      let category = raw[0].toLowerCase();
      return !_.isEmpty(this.trueCategoryName(category));
    } else if(raw.length === 2) {
      let category = raw[0].toLowerCase();
      let subcategory = raw[1].toLowerCase();
      if(_.isEmpty(subcategory) || subcategory.localeCompare("all") === 0) {
        return this.hasPictures(category);
      } else {
        if(this.hasPictures(category)) {
          return !_.isEmpty(this.trueSubcategoryName(category, subcategory));
        } else {
          return false;
        }
      }
    } else if(query.toLowerCase().localeCompare('all') === 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if the given query string has any pictures, and returns the list of pictures if so.
   * By default, a trailing forward slash ('.../'), '.../all', or '.../icon' will return all the photos in the category.
   * 'all' will return all the pictures in the Picture Manager.
   * @param {String} query        The query string to search.
   * @return {!Array<Pictures>}   The list of pictures at the given query string. Returns an empty list if the query fails.
   */
  getPicturesQuery = (query) => {
    try {
      if(this.hasPictures(query)) {
        let raw = filter(query.split('/'));
        if(raw.length === 1) {
          let category = raw[0];
          return this.getAllPicturesAt(this.trueCategoryName(category));
        } else if(raw.length === 2) {
          let category = this.trueCategoryName(raw[0]);
          let subcategory = raw[1];
          if((subcategory.toLowerCase().localeCompare("all") === 0) || (subcategory.toLowerCase().localeCompare("icon") === 0) || _.isEmpty(subcategory)) {
            return this.getAllPicturesAt(category);
          } else {
            return this.getPicturesAt(category, this.trueSubcategoryName(category, subcategory));
          }
        } else {
          return [];
        }
      } else if(filter(query.split('/'))[0].toLowerCase().localeCompare('all') === 0) {
        return this.getAllPictures();
      }
      else {
        return [];
      }
    } catch (e) {
      return [];
    }  
  }

    /**
   * Returns the category and subcategory name of a given query string. 
   * By default, a trailing forward slash ('.../') or '.../all' will return '' as the subcategory.
   * 'all' will return 'All Photos'.
   * @param {String} query  The query string to search.
   * @return {object}       An object with the category and subcategory names. 
   */
  getNames = (query) => {
    try {
      if(this.hasPictures(query)) {
        let raw = filter(query.split('/'));
        if(raw.length === 1) { 
          return {
            category: this.trueCategoryName(raw[0]),
            subcategory: '',
          };
        } else if (raw.length === 2) {
          return {
            category: this.trueCategoryName(raw[0]),
            subcategory: this.trueSubcategoryName(this.trueCategoryName(raw[0]), raw[1]),
          };
        } else {
          return {
            category: '',
            subcategory: '',
          };
        }
      } else if(filter(query.split('/'))[0].toLowerCase().localeCompare('all') === 0) {
        return {
          category: 'All Photos',
          subcategory: '',
        };
      } else {
        return {
          category: '',
          subcategory: '',
        };
      }
    } catch (e) {
      return {
        category: '',
        subcategory: '',
      };
    }
  }

  /**
   * Adds a new category with the given category name and item. 
   * @param {String} category The category name.
   * @param {String} icon     The icon name.
   */
  addCategory = async (category, icon) => {
    let subTmp = new Map();
    subTmp.set('icon', [new Picture({ name: icon, time: currentTime() })]);
    this.menu.set(category, subTmp);

    firestore.collection('photos').doc(category).set({
      category: category,
      icon: icon,
      subcategories: []
    });
  }


  renameCategory = async (categoryOld, categoryNew) => {
    this.menu.set(categoryNew, this.menu.get(categoryOld));

    var oldData = await firestore.collection('photos').doc(categoryOld).get();
    
    await firestore.collection('photos').doc(categoryNew).set({
      category: categoryNew,
      icon: oldData.data().icon,
      subcategories: oldData.data().subcategories,
    });

    var images = this.getAllPicturesAt(categoryOld);
    console.log(images);
    for(var i = 0; i < images.length; i++) {
      var image = images[i];
      var path = image.path.split('/');
      var category = path[0], subcategory = path.length > 1 ? path[1] : null;
      var oldPath = image.path, newPath = `${categoryNew}${subcategory === null ? '' : `/${subcategory}`}`;
      image.path = newPath;
      console.log(newPath);

      if(subcategory) {
        await firestore.collection("photos").doc(categoryOld).collection(subcategory).doc(image.name).delete();
        await firestore.collection("photos").doc(categoryNew).collection(subcategory).doc(image.name).set({
          'name': image.name,
          'title': image.title,
          'w': image.width,
          'h': image.height,
          'desc': image.description,
          'buy': image.buy,
          'dl': image.download,
          'time': image.time,
        }).catch((error) => console.log(error));
        try {
          await moveFirebaseFile(`${oldPath}/${image.name}`, `${newPath}/${image.name}`);
          await moveFirebaseFile(`${oldPath}/${image.dl}`, `${newPath}/${image.dl}`);
        } catch (e) {
          console.log(e);
        }
      } else {
        await firestore.collection("photos").doc(categoryOld).collection('images').doc(image.name).delete();
        await firestore.collection("photos").doc(categoryNew).collection('images').doc(image.name).set({
          'name': image.name,
          'title': image.title,
          'w': image.width,
          'h': image.height,
          'desc': image.description,
          'buy': image.buy,
          'dl': image.download,
          'time': image.time,
        }).catch((error) => console.log(error));
        try {
          await moveFirebaseFile(`${oldPath}/${image.name}`, `${newPath}/${image.name}`);
          await moveFirebaseFile(`${oldPath}/${image.dl}`, `${newPath}/${image.dl}`);
        } catch (e) {
          console.log(e);
        }
      }
    }

    this.deleteCategory(categoryOld);
  }


  addPhoto = async (props) => {
    const { category, subcategory, newPic, newFile, newDLFile} = props;
    if(subcategory) {
      await firestore.collection("photos").doc(category).collection(subcategory).doc(newPic.name).set({
        'name': newPic.name,
        'title': newPic.title,
        'w': newPic.width,
        'h': newPic.height,
        'desc': newPic.description,
        'buy': newPic.buy,
        'dl': newPic.download,
        'time': newPic.time,
      }).catch((error) => console.log(error));
      try {
        if(newFile) {
          await storage.ref().child(category).child(subcategory).child(newPic.name).put(newFile);
        }
        if(newDLFile) {
          await storage.ref().child(category).child(subcategory).child(newPic.dl).put(newDLFile);
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      await firestore.collection("photos").doc(category).collection('images').doc(newPic.name).set({
        'name': newPic.name,
        'title': newPic.title,
        'w': newPic.width,
        'h': newPic.height,
        'desc': newPic.description,
        'buy': newPic.buy,
        'dl': newPic.download,
        'time': newPic.time,
      }).catch((error) => console.log(error));
      try {
        if(newFile) {
          await storage.ref().child(category).child(newPic.name).put(newFile);
        }
        if(newDLFile) {
          await storage.ref().child(category).child(newPic.dl).put(newDLFile);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  deleteCategory = async (category) => {
    const subcategories = this.getSubcategoriesAt(category);
    subcategories.forEach(async (subcategory) => {
      await firestore.collection('photos').doc(category).collection(subcategory).get().then(async (data) => {
        data.docs.map(async (val) => {
          await val.delete();
          return null;
        });
      });
    });
    await firestore.collection('photos').doc(category).delete();
    this.menu.delete(category);
  }
}

class Picture {
  constructor(data) {
    this.name = (typeof data.name !== 'undefined') ? data.name : '';
    this.title = (typeof data.title !== 'undefined') ? data.title : '';
    this.width = (typeof data.w !== 'undefined') ? data.w : 0;
    this.height = (typeof data.h !== 'undefined') ? data.h : 0;
    this.description = (typeof data.desc !== 'undefined') ? data.desc : '';
    this.buy = (typeof data.buy !== 'undefined') ? data.buy : '';
    this.download = (typeof data.dl !== 'undefined') ? data.dl : '';
    this.time = (typeof data.time !== 'undefined') ? data.time : '';
    this.path = (typeof data.path !== 'undefined') ? data.path : '';
  }

  /**
   * Gets the url for this picture.
   * @param {String} url    The url of the storage reference.
   * @param {String} token  The token for the firebase storage.
   * @return {String}       The url for this picture.
   */
  getUrl = () => `${url}${replaceAll(this.path, '/', '%2F')}%2F${replaceAll(this.name, ' ', '%20')}?alt=media&token=${token}`;
}

/**
 * Gets all the picture urls for a given list of pictures.
 * @param {!Array<Picture>} pictures  The list of pictures to get urls for.
 * @return {!Array<String>}           The list of picture urls for the given list of pictures.
 */
export const getUrlsFor = (pictures) => [...pictures.map((pic) => pic.getUrl())];

export const fromFirestore = async () => {
  let menu = new Map();

  await firestore
  .collection("photos")
  .orderBy('category')
  .get()
  .then(async (snapshot1) => {
    const categories = snapshot1.docs.map(doc => ({
      ...doc.data()
    }));
    for await (const item of categories) {
      let categoryName = item.category;
      let icon = item.icon;
      let subcategories = item.subcategories;

      let subTmp = new Map();

      subTmp.set( 'icon', [new Picture({ name: icon, time: currentTime() })] );

      if(subcategories.length !== 0) {
        subcategories.sort();

        for await (const subcategory of subcategories) {
          await firestore
            .collection("photos")
            .doc(categoryName)
            .collection(subcategory)
            .get()
            .then(snapshot2 => {
              const images = snapshot2.docs.map(doc => ({
                ...doc.data()
              }));
              let pictures = [];
              images.forEach((image) => {
                try {
                  //console.log(JSON.stringify(image));
                  if(image.name !== 'null') {
                    pictures.push(new Picture({
                      path: `${categoryName}/${subcategory}`,
                      ...image
                    }));
                  }
                } catch (e) {
                  console.log(e);
                }
              });
              pictures.sort((a, b) => b.time.localeCompare(a.time));
              subTmp.set(subcategory, pictures);
              subTmp.set('icon', [...subTmp.get('icon'), ...pictures]);
            });
          }
        }

      try {
        await firestore
        .collection("photos")
        .doc(categoryName)
        .collection("images")
        .get()
        .then(snapshot3 => {
          const images = snapshot3.docs.map(doc => ({
            ...doc.data()
          }));
          images.forEach((image) => {
            try {
              //console.log(JSON.stringify(image));
              if(image.name !== 'null') {
                subTmp.get('icon').push(new Picture({
                  path: `${categoryName}`,
                  ...image
                }));
                if(subcategories.length !== 0) {
                  if(typeof subTmp.get('Miscellaneous') === 'undefined') {
                    subTmp.set("Miscellaneous", [
                      new Picture({
                        path: `${categoryName}`,
                        ...image
                      })
                    ]);
                  } else {
                    subTmp.get('Miscellaneous').push(new Picture({
                      path: `${categoryName}`,
                      ...image
                    }));
                  }
                }
              }
              subTmp.get('icon').sort((a, b) => b.time.localeCompare(a.time));
              subTmp.get('Miscellaneous').sort((a, b) => b.time.localeCompare(a.time));
            } catch(e) {
              console.log(e);
            }
          });
        });
      } catch (e) {
        console.log(e);
      }
      
      subTmp.get('icon').sort((a, b) => b.time.localeCompare(a.time))
      menu.set(categoryName, subTmp);
      
    }
  });

  console.log("Picture Manager initialized.");

  return new PortfolioManager(menu);
}
