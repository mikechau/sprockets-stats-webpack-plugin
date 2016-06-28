'use strict';

var test = require('ava');
var webpack = require('webpack');
var path = require('path');
var MemoryFS = require('memory-fs');
var fs = require('fs');

var config = require('./scenarios/simple/webpack.config');
var tmpDir = path.resolve(__dirname, '../../tmp/01-test');

function buildCompiler(t, fsys, opts, callback) {
  var compilier = webpack(config(tmpDir, opts));

  if (fsys) {
    compilier.outputFileSystem = fsys;
  }

  compilier.run(function(err, stats) {
    if (err) {
      t.fail(err);
    }

    var jsonStats = stats.toJson(); // eslint-disable-line vars-on-top

    if (jsonStats.errors.length > 0) {
      return t.fail(jsonStats.errors);
    }

    if (jsonStats.warnings.length > 0) {
      return t.fail(jsonStats.warnings);
    }

    callback(jsonStats, stats);
  });
}

test.cb('generates the expected stats', function(t) {
  // eslint-disable-next-line global-require
  var expectedManifest = require('./scenarios/simple/fixtures/01-sprockets-manifest');

  expectedManifest.hash = 'test';

  var counter = 0;

  [true, false].forEach(function(runAfterEmit) {
    var memFs = new MemoryFS();

    buildCompiler(t, memFs, {
      sprockets: {
        write: false
      },
      sri: {
        runAfterEmit: runAfterEmit
      }
    }, function(jsonStats) {
      var sprockets = jsonStats.__RESULTS_SPROCKETS; // eslint-disable-line no-underscore-dangle
      sprockets.hash = 'test';

      t.deepEqual(sprockets, expectedManifest);

      counter++;

      if (counter === 2) {
        t.end();
      }
    });
  });
});

test.cb('writes sprockets-manifest.json', function(t) {
  var memFs = new MemoryFS();

  buildCompiler(t, memFs, {
    sprockets: {
      write: true
    },
    sri: {
      runAfterEmit: false
    }
  }, function() {
    var actualManifestPath = path.join(tmpDir, 'build', 'sprockets-manifest.json');
    fs.stat(actualManifestPath, t.end);
  });
});
