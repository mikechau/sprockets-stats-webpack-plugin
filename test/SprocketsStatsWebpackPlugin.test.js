'use strict';

var test = require('ava');
var SprocketsStatsWebpackPlugin = require('..');

test('custom stats key is sprockets', function(t) {
  var sprocketsStats = new SprocketsStatsWebpackPlugin({});

  t.is(sprocketsStats._customStatsKey, 'sprockets', 'should have default customStatsKey');
});
