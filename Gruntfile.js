/*
 * grunt-md-html
 * https://github.com/helinjiang/grunt-md-html
 *
 * Copyright (c) 2015 helinjiang
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        md_html: {
            default_options: {
                files: {
                    'tmp/default_options/some.html': ['test/fixtures/default_options/some.md']
                }
            },
            files_array_format: {
                files: [{
                    expand: true,
                    cwd: 'test/fixtures/files_array_format/',
                    src: ['**/*.md'],
                    dest: 'tmp/files_array_format/',
                    ext: '.html',
                    extDot:'last'
                }]
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'md_html', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
