'use strict';

var test = require('ava');
var actualManifest = require('../build/sprockets-manifest');
var expectedManifest = require('./fixtures/sprockets-manifest');

test('generated sprockets manifest matches expected', function(t) {
  var actualFiles = actualManifest.files;

  Object.keys(actualFiles).forEach(function(filename) {
    var file = actualFiles[filename];

    t.truthy(Date.parse(file.mtime), 'not a valid date');

    file.mtime = '2016-06-21T07:42:09.623Z';
  });

  t.deepEqual(actualManifest, expectedManifest, 'manifests not equal');
});
