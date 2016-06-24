# sprockets-stats-webpack-plugin

[![npm version](https://badge.fury.io/js/sprockets-stats-webpack-plugin.svg)](https://badge.fury.io/js/sprockets-stats-webpack-plugin) [![Build Status](https://travis-ci.org/mikechau/sprockets-stats-webpack-plugin.svg?branch=master)](https://travis-ci.org/mikechau/sprockets-stats-webpack-plugin) [![Dependency Status](https://david-dm.org/mikechau/sprockets-stats-webpack-plugin.svg)](https://david-dm.org/mikechau/sprockets-stats-webpack-plugin) [![devDependency Status](https://david-dm.org/mikechau/sprockets-stats-webpack-plugin/dev-status.svg)](https://david-dm.org/mikechau/sprockets-stats-webpack-plugin#info=devDependencies)

This is a webpack plugin which creates a mapping for generating a
sprockets/rails compatible asset manifest.

This plugin can:

- Write a compatible sprockets asset manifest.
- Inject sprockets asset data into webpack's `stats.toJson()`, allowing you to
  further consume the data with other stat plugins.
- Inject the results into webpack's `compiliation` and into `stats.toJson()`.

## Install

```
npm install sprockets-stats-webpack-plugin --save-dev
```

## Usage

```js
// Your webpack config
var SriStatsPlugin = require('sri-stats-webpack-plugin');
var SprocketsStatsPlugin = require('sprockets-stats-webpack-plugin');

var config = {
  plugins: [
    new SriStatsPlugin({
      algorithm: 'sha512',
      customStatsKey: 'rails',
      assetKey: 'integrity'
    }),

    new SprocketsStatsPlugin({
      customStatsKey: 'rails',
      ignore: (/\.(gz|html)$/i),
      outputAssetsPath: path.join(__dirname, 'build', 'assets'),
      sourceAssetsPath: path.join(__dirname, 'src', 'assets'),
      mappings: [
        {
          test: 'src\/assets\/images',
          logicalPath: '[path][name].[ext]',
          context: path.join(process.cwd(), 'src', 'assets', 'images')
        },
        {
          test: 'src\/assets\/videos',
          logicalPath: '[path][name].[ext]',
          context: path.join(process.cwd(), 'src', 'assets', 'videos')
        }
      ],
      saveAs: path.join(__dirname, 'build', 'sprockets-manifest.json'),
      write: true,
      resultsKey: '__RESULTS_SPROCKETS'
    })
 ]
};

module.exports = config;
```

If you are using this plugin with **SriStatsWebpackPlugin**, it must go before
this plugin. Order matters.

## Configuration

- `customStatsKey` : This is the parent key the mapping is saved to. If you
  plan to use this with the *SriStatsWebpackPlugin*, you should make sure they use
  the same keys.
  Default: `sprockets`.
- `ignore`: This is a regex to skip adding custom stats data for assets where
  it would not be relevant to generate sprockets manifest data for.
  Default: `(/\.(gz|html)$/i)`.
- `outputAssetsPath`: *Absolute* path to where the assets are built to.
  Default: `path.join(process.cwd(), 'build', 'assets')`.
- `sourceAssetsPath`: *Absolute* path to where the source assets are located.
  Helps the plugin build mappings to files like `images/picture.jpeg`.
  Default: `path.join(process.cwd(), 'src', 'assets')`.
- `mappings`: (Optional) Array of mapping objects for customizing the logical
  path. Note: If you provide mappings, a source file will be included in the
  manifest only if its absolute path matches a regex in one of the mappings. 
  Default: `[]`
  - `test`: Regex for matching source files using their absolute paths. 
  - `logicalPath`: Pattern using Webpack placeholders for renaming the logical
    path.
  - `context`: *Absolute* path to a context directory for the sources matched
    by this mapping. Use in combination with the `[path]` placeholder in
    `logicalPath` to create logical paths relative to an arbitrary directory.
    Default: `sourceAssetsPath`
- `saveAs`: *Absolute* path to where to save the output to.
  Default: `path.join(process.cwd(), 'build', 'sprockets-manifest.json')`
- `write`: Boolean option, of whether to write the stats file or not.
  Default: `true`
- `resultsKey`: Where to save the results to in webpack's `compilation` object.
  Default: `__RESULTS_SPROCKETS`

## License
MIT.
