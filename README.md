# sprockets-stats-data-webpack-plugin

[![npm version](https://badge.fury.io/js/sprockets-stats-webpack-plugin.svg)](https://badge.fury.io/js/sprockets-stats-webpack-plugin)

This is a webpack plugin which creates a mapping for generating a
sprockets/rails compatible asset manifest. It injects the asset mapping into
your webpack `stats` object. So you can continue choose to do as you like with
it in the stats plugin of your choice.

This plugin does **NOT** generate any sort of `stats.json` file. It only adds a
custom attribute to the `stats` object. In your stats plugin, you can call
something like `stats.toJSON().rails`, to get the relevant rails mapping.

This package includes a custom formatter for [Manifest Revision Webpack Plugin](https://github.com/nickjj/manifest-revision-webpack-plugin).

## Setup

```
npm install sprockets-stats-webpack-plugin --save-dev
```

## Usage

```js
// Your webpack config
var SriStatsPlugin = require('sri-stats-webpack-plugin');
var SprocketsStatsWebpackPlugin = require('sprockets-stats-webpack-plugin');
var sprocketsFormatter = require('sprockets-stats-webpack-plugin/formatters').ManifestRevisionFormat.formatter;
var ManifestRevisionPlugin = require('manifest-revision-webpack-plugin');

var config = {
  plugins: [
    new SriStatsPlugin({
      algorithm: 'sha512',
      customStatsKey: 'rails',
      assetKey: 'integrity'
    }),

    new SprocketsStatsWebpackPlugin({
      customStatsKey: 'rails',
      ignore: (/\.(gz|html)$/i),
      assetsPath: path.join(process.cwd(), 'build', 'assets')
    }),

    new ManifestRevisionPlugin(path.resolve(__dirname, 'build/sprockets-manifest.json'), {
      rootAssetPath: './src/assets',
      ignorePaths: ['/fonts', '/stylesheets'],
      format: sprocketsFormatter.bind(null, 'rails') // required to tell the formatter what key to get data from
    })
 ]
};

module.exports = config;
```

## Configuration

- `customStatsKey` : This is the parent key the mapping is saved to. If you
  plan to use this with the *SriWebpackPlugin* with the
  *SprocketsManifestRevisionFormat*, you should make sure they use the same
  keys. Default: `sprockets`.
- `ignore`: This is a regex to skip adding custom stats data for assets where
  it would not be relevan to generate sprockets manifest data for. Default:
  `(/\.(gz|html)$/i)`.
- `assetsPath`: *Full* path to where the assets are built to. Default:
  `path.join(process.cwd(), 'build', 'assets')`.

## License
MIT.
