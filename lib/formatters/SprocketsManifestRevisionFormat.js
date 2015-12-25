/**
 * Based on code from @nickjj.
 *
 * https://github.com/nickjj/manifest-revision-webpack-plugin/blob/master/format.js
 */
'use strict';

var DEFAULT_PARAMS = {
  customStatsKey: 'sprockets'
};

/**
* Format raw webpack stats in a way that suites you.
* @param {object} data - The raw stats returned by webpack.
* @param {object} parsedAssets - List of assets that have already been parsed.
* @returns {object}
*/
var SprocketsManifestRevisionFormat = function(key, data, parsedAssets) {
  this.data = data;
  this.assets = parsedAssets;
  this.customStatsKey = key || DEFAULT_PARAMS.customStatsKey;
};

/**
 * CSS assets will get a Javascript chunk output with it, this function removes
 * that and leaves you with just a single chunk.
 *
 * @returns {object}
 */
SprocketsManifestRevisionFormat.prototype.normalizeChunks = function() {
  var output = {};
  var assetsByChunkName = this.data.assetsByChunkName;

  Object.keys(assetsByChunkName).forEach(function(assetByChunkName) {
    var chunkValue = assetsByChunkName[assetByChunkName];

    if (typeof chunkValue === 'string') {
      output[assetByChunkName] = chunkValue;
    } else {
      output[assetByChunkName] = chunkValue.slice(-1)[0];
    }
  });

  return output;
};

/**
 * At the end of the day the chunks are assets so combine them into the assets.
 *
 * @returns {object}
 */
SprocketsManifestRevisionFormat.prototype.mergeChunksIntoAssets = function() {
  var output = {};
  var assetsByChunkName = this.normalizeChunks();

  output.assets = this.assets;

  Object.keys(assetsByChunkName).forEach(function(assetByChunkName) {
    var fileExtension = assetsByChunkName[assetByChunkName].split('.').slice(-1)[0];
    var chunkWithExtension = assetByChunkName + '.' + fileExtension;

    output.assets[chunkWithExtension] = assetsByChunkName[assetByChunkName];
  });

  return output;
};

/**
* Return the data back formatted in a general way.
* @returns {object}
*/
SprocketsManifestRevisionFormat.prototype.general = function() {
  var output = this.mergeChunksIntoAssets();
  output.publicPath = this.data.publicPath;

  return output;
};

/**
* Return the data back formatted to work with Ruby on Rails.
* @returns {object}
*/
SprocketsManifestRevisionFormat.prototype.sprockets = function() {
  var output = this.general();
  var assets = this.assets;
  var customStatsKey = this.customStatsKey;
  var sprocketsData = this.data[customStatsKey];

  output.files = {};

  Object.keys(assets).forEach(function(assetName) {
    var assetHashedName = assets[assetName];
    var assetData = sprocketsData[assetHashedName];

    output.files[assetHashedName] = {
      logical_path: assetName,
      size: assetData.size,
      mtime: assetData.mtime,
      digest: assetData.digest
    };

    if (assetData.integrity) {
      output.files[assetHashedName].integrity = assetData.integrity;
    }
  });

  return output;
};

module.exports = {
  Format: SprocketsManifestRevisionFormat,
  formatter: function(key, data, parsedAssets) {
    var customStatsKey = key || DEFAULT_PARAMS.customStatsKey;
    var format = new SprocketsManifestRevisionFormat(customStatsKey, data, parsedAssets);
    return format.sprockets();
  }
};
