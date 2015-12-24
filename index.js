'use strict';

function SprocketsStatsWebpackPlugin(options) {
  var params = options || {};
  var subresourceIntegrity = (params.subResourceIntegrity === undefined ? true : params.subResourceIntegrity);

  if (subresourceIntegrity) {
    try {
      var sriPlugin = require('sri-webpack-plugin');
      this._sriEnabled = true;
    } catch(err) {
      this._sriEnabled = false;
    }
  }
};

SprocketsStatsWebpackPlugin.prototype.apply = function(compiler) {
};

module.exports = SprocketsStatsWebpackPlugin;
