/* eslint quotes: [2, "double", "avoid-escape"] */

"use strict";

var webpack = require("webpack");
var path = require("path");
var CleanPlugin = require("clean-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var SriStatsPlugin = require("sri-stats-webpack-plugin");
var SprocketsStatsPlugin = require("sprockets-stats-webpack-plugin");

var PROJECT_DIR = process.env.WEBPACK_OUTPUT_PATH || process.cwd();

module.exports = {
  "devtool": "false",

  "entry": {
    "main": [
      "./src/index.js"
    ]
  },

  "output": {
    "path": path.join(PROJECT_DIR, "build", "assets", "01-test"),
    "publicPath": "/assets/01-test/",
    "filename": "[name]-01-test.js",
    "chunkFilename": "chunk-[id].[name]-01-test.js",
    "sourceMapFilename": "debug/[file]-01-test.map",
    "pathInfo": "false"
  },

  "debug": false,

  "resolve": {
    "root": path.join(PROJECT_DIR, "src"),
    "extensions": ["", ".js"],
    "alias": {
      "app": path.join(PROJECT_DIR, "src")
    }
  },

  "resolveLoader": {
    "root": path.join(PROJECT_DIR, "node_modules")
  },

  "module": {
    "loaders": [
      {
        "test": /\.css$/,
        "loader": ExtractTextPlugin.extract('style-loader', 'css')
      },
      {
        "test": /\.jpg$/,
        "loader": "url?limit=10&name=images/[name]-01-test.[ext]"
      }
    ]
  },

  "plugins": [
    new webpack.NoErrorsPlugin(),
    new CleanPlugin(["build"]),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin("[name]-01-test.css"),
    new SriStatsPlugin({
      customStatsKey: "rails"
    }),
    new SprocketsStatsPlugin({
      customStatsKey: "rails"
    })
  ]
};

