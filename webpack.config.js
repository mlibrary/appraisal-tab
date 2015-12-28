'use strict';

var webpack = require('webpack');
var APP = __dirname + '/app';

module.exports = {
  context: APP,
  entry: './app.js',
  output: {
    path: APP,
    filename: 'appraisal_tab.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel?presets[]=es2015',
        exclude: /node_modules/,
      },
      {
        test: /\.css/,
        loader: 'style!css',
      },
      {
          test: /\.png$/,
          loader: 'url-loader',
          query: {
            mimetype: 'image/png',
          },
      },
      {
          test: /\.(eot|woff|woff2|ttf|svg)(\?v=\d\.\d\.\d)?$/,
          loader: 'url-loader',
      },
    ],
  },
};
