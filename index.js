'use strict';

var walk = require('walk');
var path = require('path');
var crypto = require('crypto');
var CustomStats = require('webpack-custom-stats-patch');

var DEFAULT_PARAMS = {
  customStatsKey: 'sprockets',
  ignore: (/\.(gz|html)$/i),
  assetsPath: path.join(process.cwd(), 'build', 'assets')
};

function SprocketsStatsWebpackPlugin(options) {
  var params = options || {};

  this._customStatsKey = options.customStatsKey || DEFAULT_PARAMS.customStatsKey;
  this._ignore = params.ignore || DEFAULT_PARAMS.ignore;
  this._assetsPath = params.assetsPath || DEFAULT_PARAMS.assetsPath;
}

SprocketsStatsWebpackPlugin.prototype.apply = function(compiler) {
  var assetsPath = this._assetsPath;
  var customStatsKey = this._customStatsKey;
  var blacklistRegex = this._ignore;
  var sprockets = {};

  compiler.plugin('this-compilation', function(compilation) {
    compilation.plugin('optimize-assets', function(assets, callback) {
      Object.keys(assets).forEach(function(file) {
        var asset;
        var content;

        if (!file.match(blacklistRegex)) {
          asset = assets[file];
          content = asset.source();

          sprockets[file] = {
            size: asset.size(),
            digest: crypto.createHash('md5').update(content).digest('hex')
          };
        }
      });

      callback();
    });
  });

  compiler.plugin('after-emit', function(compilation, callback) {
    var stats = new CustomStats(compilation);
    var walker = walk.walk(assetsPath);

    walker.on('file', function(root, fileStat, next) {
      var filename = fileStat.name;

      if (!filename.match(blacklistRegex) && sprockets[filename]) {
        sprockets[filename].mtime = fileStat.mtime;
      }
      next();
    });

    walker.on('end', function() {
      stats.addCustomStat(customStatsKey, sprockets);
      callback();
    });
  });
};

module.exports = SprocketsStatsWebpackPlugin;
