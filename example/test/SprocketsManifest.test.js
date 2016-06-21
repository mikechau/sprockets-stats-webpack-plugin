var assert = require('assert');
var actualManifest = require('../build/sprockets-manifest');
var expectedManifest = require('./fixtures/sprockets-manifest');

var actualFiles = actualManifest.files;

Object.keys(actualFiles).forEach(function(filename) {
  var file = actualFiles[filename];

  assert.ok(Date.parse(file.mtime), 'not a valid date');

  file.mtime = '2016-06-21T07:42:09.623Z';
});

assert.deepEqual(actualManifest, expectedManifest, 'manifests not equal');

console.log('Test passed!');
