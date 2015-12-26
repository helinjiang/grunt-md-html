/*
 * grunt-md-html
 * https://github.com/helinjiang/grunt-md-html
 *
 * Copyright (c) 2015 helinjiang
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    var marked = require('marked'),
        async = require('async'),
        fs = require('fs'),
        os = require('os'),
        util = require('util'),
        iconv = require('iconv-lite');

    grunt.registerMultiTask('md_html', 'Convert markdown and HTML to each other.', function () {
        var done = this.async(),
            options = this.options({
                gfm: true,
                tables: true,
                breaks: false,
                pedantic: false,
                sanitize: true,
                smartLists: true,
                smartypants: false,
                highlight: true,
                beforeCompile: null,
                afterCompile: null
            }),
            files = this.files;

        var renderer;
        if (options.renderer) {
            renderer = new marked.Renderer();
            for (var prop in options.renderer) {
                if (options.renderer.hasOwnProperty(prop)) {
                    renderer[prop] = options.renderer[prop];
                }
            }

            options.renderer = renderer;
        }

        // install highlight.js
        if (options.highlight) {
            options.highlight = (function (highlight) {
                return function (code) {
                    return highlight.highlightAuto(code).value;
                };
            })(require('highlight.js'));
        }

        marked.setOptions(options);

        async.each(files, function (file, next) {
            var sources, destination;

            destination = file.dest;

            sources = file.src.filter(function (path) {
                if (!fs.existsSync(path)) {
                    grunt.log.warn(util.format('Source file "%s" is not found', path));
                    return false;
                }

                return true;
            });

            async.map(sources, fs.readFile, function (err, contents) {
                if (err) {
                    grunt.log.error(util.format('Could not read files "%s"', sources.join(', ')));
                    return next(err);
                }

                // before compile
                if (typeof options.beforeCompile === "function") {
                    // 默认为二进制，但为了对内容进一步操作，这里需要先转义为utf8
                    contents = iconv.decode(contents, 'utf8');
                    var newContents = options.beforeCompile(contents);
                    if (newContents) {
                        contents = newContents;
                    }

                    // 转换完成之后，要再转换回来
                    // TODO 此处可优化
                    contents = [new Buffer(contents)];
                }

                // compile
                var markedContents = marked(contents.join(os.EOL));

                // after compile
                if (typeof options.afterCompile === "function") {
                    var newMarkedContent = options.afterCompile(markedContents);
                    if (newMarkedContent) {
                        markedContents = newMarkedContent;
                    }
                }

                grunt.file.write(destination, markedContents);
                grunt.verbose.writeln(util.format('Successfully rendered markdown to "%s"', destination));
                next();
            });

        }, function () {
            grunt.log.ok(files.length + ' ' + grunt.util.pluralize(files.length, 'file/files') + ' created.');
            done();
        });
    });

};
