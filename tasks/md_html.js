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

    var _ = require('lodash');

    grunt.registerMultiTask('md_html', 'Convert markdown and HTML to each other.', function () {
        var done = this.async(),
            defaultMarkedOptions = {
                gfm: true,
                tables: true,
                breaks: false,
                pedantic: false,
                sanitize: true,
                smartLists: true,
                smartypants: false,
                highlight: true,
                renderer: null
            },
            options = this.options({
                markedOptions: defaultMarkedOptions,
                beforeCompile: null,
                afterCompile: null,
                separator: '\n\n'
            }),
            files = this.files;

        // 注意 markedOptions 要单独设置一下，否则
        var markedOptions = _.assign({}, defaultMarkedOptions, options.markedOptions);

        // 注意要对options.markedOptions.renderer做一些特殊处理，要将这里的方法首先new之后再挂载
        if (markedOptions.renderer) {
            markedOptions.renderer = _.assign(new marked.Renderer(), markedOptions.renderer);
        } else {
            // 注意这里一定要记得设置，不然的话，后续的renderer可能会被继承下去
            markedOptions.renderer = new marked.Renderer();
        }

        // install highlight.js
        if (markedOptions.highlight) {
            markedOptions.highlight = (function (highlight) {
                return function (code) {
                    return highlight.highlightAuto(code).value;
                };
            })(require('highlight.js'));
        }

        marked.setOptions(markedOptions);

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

                // sources和contents 都为数组！！如果配置了 'some2.html': ['some2.md', 'some3.md'] 这样的参数，则该数组就有两个元素了。

                // before compile
                if (typeof options.beforeCompile === "function") {
                    var cLength = contents.length,
                        combineArr = [],
                        combineContent,
                        newContents;

                    // 依次从数组中获取二进制码，进行转义utf8格式
                    contents.forEach(function (item) {
                        combineArr.push(iconv.decode(item, 'utf8'));
                    });

                    // 然后合并
                    combineContent = combineArr.join(options.separator);

                    // 接着再调用beforeCompile，只有在有结果返回时，才生效
                    newContents = options.beforeCompile(cLength > 1 ? sources : sources[0], combineContent);
                    if (newContents) {
                        combineContent = newContents;
                    }

                    // 最后将修改之后的utf8内容还原为二进制。注意此处不需要再进行拆分了，反正后面也是合并的
                    contents = [new Buffer(combineContent)];
                }

                // compile
                var markedContents = marked(contents.join(os.EOL));

                // after compile
                if (typeof options.afterCompile === "function") {
                    var newMarkedContent = options.afterCompile(destination, markedContents);
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
