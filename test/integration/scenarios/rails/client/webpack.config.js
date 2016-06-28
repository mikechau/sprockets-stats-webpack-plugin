/* eslint quotes: [2, "double", "avoid-escape"] */

"use strict";

var webpack = require("webpack");
var path = require("path");
var RemoveWebpackPlugin = require("remove-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var SriStatsPlugin = require("sri-stats-webpack-plugin");
var SprocketsStatsPlugin = require("../../../../../");
var merge = require('lodash.merge');

module.exports = function(webpackDir, params) {
  var opts = merge({
    sprockets: {
      write: false
    },
    sri: {
      runAfterEmit: false
    }
  }, params);

  return {
    "devtool": "false",

    "entry": {
      "main": [
        path.resolve(__dirname, "./src/index.js")
      ]
    },

    "output": {
      "path": path.resolve(webpackDir, "build", "assets", "02-test"),
      "publicPath": "/assets/02-test/",
      "filename": "[name]-02-test.js",
      "chunkFilename": "chunk-[id].[name]-02-test.js",
      "sourceMapFilename": "debug/[file]-02-test.map",
      "pathInfo": "false"
    },

    "debug": false,

    "resolve": {
      "root": path.resolve(__dirname, "./src"),
      "extensions": ["", ".js"],
      "alias": {
        "app": path.resolve(__dirname, "./src"),
        "railsAssets": path.resolve(__dirname, "../app/assets")
      }
    },

    "resolveLoader": {
      "root": path.resolve(__dirname, "../../../../../node_modules")
    },

    "module": {
      "loaders": [
        {
          "test": /\.css$/,
          "loader": ExtractTextPlugin.extract("style-loader", "css")
        },
        {
          "test": /\.jpg$/,
          "loader": "url?limit=10&name=images/[name]-02-test.[ext]"
        }
      ]
    },

    "plugins": [
      new webpack.NoErrorsPlugin(),
      function() {
        if (opts.sprockets.write) {
          return new RemoveWebpackPlugin(path.resolve(webpackDir, "build", "sprockets-manifest.json"));
        }
      },
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        output: {
          comments: false
        },
        compress: {
          warnings: false
        }
      }),
      new ExtractTextPlugin("[name]-02-test.css"),
      new SriStatsPlugin({
        customStatsKey: "rails",
        runAfterEmit: opts.sri.runAfterEmit
      }),
      new SprocketsStatsPlugin({
        customStatsKey: "rails",
        saveAs: path.resolve(webpackDir, "build", "sprockets-manifest.json"),
        write: opts.sprockets.write,
        outputAssetsPath: path.resolve(webpackDir, "build", "assets", "02-test"),
        sourceAssetsPath: path.resolve(__dirname, "./src", "assets"),
        mappings: []
      })
    ]
  };
};
