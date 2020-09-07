
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