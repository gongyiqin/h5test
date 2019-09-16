const path = require('path');
const webpack = require('webpack');
const config = require('../config')

module.exports = {
  entry: {
    vendor: ['vue', 'vue-router', 'vue-resource', 'vuex', 'fastclick']
  },
  output: {
    path: config.vendorOutputDirectory,
    filename: '[name].[hash].dll.js',
    library: '[name]_[hash]'       // vendor.dll.js中暴露出的全局变量名
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '.', '[name]-manifest.json'),
      name: '[name]_[hash]'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};
