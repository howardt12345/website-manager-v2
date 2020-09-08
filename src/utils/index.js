
const _ = require('lodash');

export const hex2rgba = (hex, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

export const replaceAll = (string, search, replace) => string.split(search).join(replace);

export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

export const currentTime = () => {
  let now = new Date();
  return `${now.getFullYear()}-${now.getMonth().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}-${now.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})} ${now.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${now.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${now.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}.${now.getMilliseconds().toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping:false})}`
}

export const filter = (array) => array.filter(function (e) {return !_.isEmpty(e);});

export const mergeTypedArrays = (a, b) => {
  // Checks for truthy values on both arrays
  if(!a && !b) throw Error('Please specify valid arguments for parameters a and b.');  

  // Checks for truthy values or empty arrays on each argument
  // to avoid the unnecessary construction of a new array and
  // the type comparison
  if(!b || b.length === 0) return a;
  if(!a || a.length === 0) return b;

  // Make sure that both typed arrays are of the same type
  if(Object.prototype.toString.call(a) !== Object.prototype.toString.call(b))
      throw Error('The types of the two arguments passed for parameters a and b do not match.');

  var c = new a.constructor(a.length + b.length);
  c.set(a);
  c.set(b, a.length);

  return c;
}