'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.md_html = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/default_options/some.html');
    var expected = grunt.file.read('test/expected/default_options/some.html');
    test.equal(grunt.util.normalizelf(actual), grunt.util.normalizelf(expected), 'default_options.');

    test.done();
  },
  files_array_format: function(test) {
    test.expect(2);

    var actual = grunt.file.read('tmp/files_array_format/some.html');
    var expected = grunt.file.read('test/expected/files_array_format/some.html');
    test.equal(grunt.util.normalizelf(actual), grunt.util.normalizelf(expected), 'files_array_format.');

    actual = grunt.file.read('tmp/files_array_format/parent.some.html');
    expected = grunt.file.read('test/expected/files_array_format/parent.some.html');
    test.equal(grunt.util.normalizelf(actual), grunt.util.normalizelf(expected), 'files_array_format.');

    test.done();
  }
};
