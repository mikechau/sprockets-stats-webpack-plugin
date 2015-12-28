/* eslint no-unused-vars: [2, { "args": "none" }] */

'use strict';

var walk = require('walk');
var path = require('path');
var crypto = require('crypto');
var CustomStats = require('webpack-custom-stats-patch');
var fs = require('fs');

var DEFAULT_PARAMS = {
  customStatsKey: 'sprockets',
  ignore: (/\.(gz|html)$/i),
  outputAssetsPath: path.join(process.cwd(), 'build', 'assets'),
  sourceAssetsPath: path.join(process.cwd(), 'src', 'assets'),
  saveAs: path.join(process.cwd(), 'build', 'sprockets-manifest.json'),
  write: true,
  resultsKey: '__RESULTS_SPROCKETS'
};

function SprocketsStatsWebpackPlugin(options) {
  var params = options || {};

  this._customStatsKey = options.customStatsKey || DEFAULT_PARAMS.customStatsKey;
  this._ignore = params.ignore || DEFAULT_PARAMS.ignore;
  this._outputAssetsPath = params.outputAssetsPath || DEFAULT_PARAMS.outputAssetsPath;
  this._sourceAssetsPath = params.sourceAssetsPath || DEFAULT_PARAMS.sourceAssetsPath;
  this._saveAs = params.saveAs || DEFAULT_PARAMS.saveAs;
  this._write = ((params.write === undefined) ? DEFAULT_PARAMS.write : params.write);
  this._resultsKey = params.resultsKey || DEFAULT_PARAMS.resultsKey;
}

SprocketsStatsWebpackPlugin.prototype.apply = function(compiler) {
  var outputAssetsPath = this._outputAssetsPath;
  var sourceAssetsPath = this._sourceAssetsPath;
  var customStatsKey = this._customStatsKey;
  var blacklistRegex = this._ignore;
  var savePath = this._saveAs;
  var writeEnabled = this._write;
  var resultsKey = this._resultsKey;
  var sprockets = {};

  compiler.plugin('this-compilation', function(compilation) {
    compilation.plugin('optimize-assets', function(assets, callback) {
      Object.keys(assets).forEach(function(file) {
        var asset;
        var content;

        if (!file.match(blacklistRegex)) {
          asset = assets[file];
          content = asset.source();

          if (sprockets[file]) {
            sprockets[file].size = asset.size();
            sprockets[file].digest = crypto.createHash('md5').update(content).digest('hex');
          } else {
            sprockets[file] = {
              size: asset.size(),
              digest: crypto.createHash('md5').update(content).digest('hex')
            };
          }
        }
      });

      callback();
    });

    compilation.plugin('module-asset', function(mod, filename) {
      var logicalPath = path.relative(sourceAssetsPath, mod.userRequest);
      var filenameKey = Object.keys(mod.assets).slice(-1)[0];

      sprockets[filenameKey] = {
        logical_path: logicalPath
      };
    });
  });

  compiler.plugin('after-emit', function(compilation, callback) {
    var outputPath = compilation.getPath(compilation.outputOptions.path);
    var stats = new CustomStats(compilation);
    var walker = walk.walk(outputAssetsPath);
    var assets = stats.toJson().assets;

    assets.forEach(function(asset) {
      var hashedAssetName = asset.name;
      var assetName;
      var assetExt;
      var filename;

      if ((asset.chunks && asset.chunks.length > 0) &&
          (asset.chunkNames && asset.chunkNames.length > 0)
      ) {
        assetName = asset.chunkNames.slice(-1)[0];
        assetExt = hashedAssetName.split('.').pop();

        filename = assetName + '.' + assetExt;

        sprockets[hashedAssetName].logical_path = filename;
      }
    });

    walker.on('file', function(rootPath, fileStat, next) {
      var fullPath = path.join(rootPath, fileStat.name);
      var filename = (path.relative(outputPath, fullPath));

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

  compiler.plugin('done', function(stats) {
    var data = stats.toJson();

    var output = {
      assets: {},
      files: data[customStatsKey],
      hash: data.hash,
      publicPath: data.publicPath
    };

    Object.keys(output.files).forEach(function(filename) {
      var asset = output.files[filename];
      output.assets[asset.logical_path] = filename;
    });

    if (writeEnabled) {
      fs.writeFile(savePath, JSON.stringify(output, null, '  '), function(err) {
        if (err) {
          console.error('Failed to write stats.', err);
          throw err;
        }
      });
    }

    stats.addCustomStat(customStatsKey, sprockets);
    stats.addCustomStat(resultsKey, output);
  });
};

module.exports = SprocketsStatsWebpackPlugin;
