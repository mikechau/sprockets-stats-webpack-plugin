'use strict';

var test = require('tape');
var formatter = require('../../../lib/formatters/SprocketsManifestRevisionFormat').formatter;

var parsedAssetsFixture = require('../fixtures/parsedAssets');
var statsFixture = require('../fixtures/stats');
var sprocketsManifestFixuture = require('../fixtures/sprockets.manifest');

test('Sprockets manifest revision formatter', function(assert) {
  var actual = formatter('rails', statsFixture, parsedAssetsFixture);
  var expected = sprocketsManifestFixuture;

  assert.deepEqual(actual, expected, 'should return the expected format');

  assert.end();
});
