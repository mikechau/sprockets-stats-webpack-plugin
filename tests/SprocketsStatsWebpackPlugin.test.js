'use strict';

var test = require('tape');
var SprocketsStatsWebpackPlugin = require('..');

test('SprocketsStatsWebpackPlugin', function(assert) {
  var sprocketsStats = new SprocketsStatsWebpackPlugin({});

  assert.equal(sprocketsStats._customStatsKey, 'sprockets', 'should have default customStatsKey');

  assert.end();
});
