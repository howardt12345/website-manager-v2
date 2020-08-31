const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./renderer.base.config');

module.exports = merge(baseConfig, {
  mode: 'production',
  entry: path.join(__dirname, '../src/main/index.js'),
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'renderer.prod.js'
  }
});
