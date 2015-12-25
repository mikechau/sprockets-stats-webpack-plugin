'use strict';

var crypto = require('crypto');
var CustomStats = require('webpack-custom-stats-patch');

var DEFAULT_PARAMS = {
  customStatsKey: 'sprockets',
  sriKey: 'integrity'
};

function SprocketsStatsWebpackPlugin(options) {
  var params = options || {};
  var subresourceIntegrity = (params.subResourceIntegrity === undefined ? true : params.subResourceIntegrity);

  this._customStatsKey = options.customStatsKey || 'sprockets';
  this._sriKey = params.sriKey || 'integrity';

  if (subresourceIntegrity) {
    try {
      var sriPlugin = require('@mikechau/sri-webpack-plugin');
      this._sriEnabled = true;
    } catch(err) {
      this._sriEnabled = false;
    }
  }
};

SprocketsStatsWebpackPlugin.prototype.apply = function(compiler) {
  var customStatsKey = this._customStatsKey;
  var sriKey = this._sriKey;
  var sriEnabled = this._sriEnabled;
  var sprockets = {};

  compiler.plugin('this-compilation', function(compilation) {
    compilation.plugin('optimize-assets', function(assets, callback) {
      Object.keys(assets).forEach(function(file) {
        var asset = assets[file];
        var content;

        sprockets[file] = {
          size: asset.size(),
          digest: crypto.createHash('md5').update(content).digest('hex')
        };
      });

      callback();
    });
  });

  compiler.plugin('after-emit', function(compilation, callback) {
    var stats = new CustomStats(compilation);

    stats.addCustomStat(customStatsKey, sprockets);

    callback();
  });
};

module.exports = SprocketsStatsWebpackPlugin;
