# grunt-md-html

> Convert markdown and HTML to each other.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-md-html --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-md-html');
```

## The "md_html" task

### Overview
In your project's Gruntfile, add a section named `md_html` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  md_html: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

Grunt-md-html forked [Grunt-marked](https://github.com/gobwas/grunt-marked) and uses the [default marked parser options](https://github.com/chjj/marked). But, it extended!

#### options.markedOptions
Type: `Object`
Default value: 

```
{
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    highlight: true,
    renderer: null
}
```

Options passed directly to the markdown parser. Most config is the same of [default marked parser options](https://github.com/chjj/marked). But something is different:

- `options.markedOptions.highlight`：You can parse `true` or `false` to use [highlight.js](https://github.com/isagalaev/highlight.js) plugin or not to highlight the syntax. And you can also define `hignlight` yourself acordding to [this api](https://github.com/chjj/marked#user-content-highlight).
- `options.markedOptions.renderer` accept a object which define how to render accordding to [this api](https://github.com/chjj/marked#user-content-renderer). 


#### options.beforeCompile
Type: `Function`
Default value: `null`

Is run before the markdown is compiled.

#### options.afterCompile
Type: `Function`
Default value: `null`

Is run after the markdown has been compiled.

#### options.separator
Type: `String`
Default value: `\n\n`

A string value that is used to concatenate the .md files if used in one-outputfile mode.

#### options.layout
Type: `String`
Default value: `null`

A path to a layout file: A Layout file defines the global surrounding layout, e.g. an HTML header / footer. Within the Layout file you can then include the actual processed .md-file content.

```
<!DOCTYPE html>
<html>
    <head>
        <title></title>
    </head>
    <body>
        <%= DOC %>
    </body>
</html>
```

This layout file adds an HTML skeleton around each processed output file, replacing the following template strings (the processed content):

- `DOC`: the content html contents of which .md converted
- `SRC`: the source file path
- `DEST`: the destination file path

#### options.templateData
Type: `Object`
Default value: `{}`

Additional data which is passed to the template engine before the .md file is processed. The data object's content is directly available as template vars / functions. See Usage Examples for more information.

If you define `options.templateData.FILE_NAME`, then you will get file which will rename it!

#### options.beautify
Type: `Boolean`
Default value: `false`

Beautify the result by [js-beautify](https://www.npmjs.com/package/js-beautify).

### Usage Examples

#### Default Options
In this example, the default options are used to compile markdown files.

```js
grunt.initConfig({
  md_html: {
    options: {},
    files: {
      'dest/my.html': ['src/my.md', 'src/header.md'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to compile markdown files.

```js
grunt.initConfig({
  md_html: {
    options: {
        markedOptions: {
            highlight : false,
            renderer: {
                heading: function (text, level) {

                    var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

                    return '<h' + level + '><a name="' +
                        escapedText +
                        '" class="anchor" href="#' +
                        escapedText +
                        '"><span class="header-link"></span></a>' +
                        text + '</h' + level + '>';
                }
            }
        }
    },
    files: {
        'tmp/custom_renderer/some.html': ['test/fixtures/custom_renderer/some.md']
    }
  },
});
```

#### Use layout
Layout support.

```js
grunt.initConfig({
  md_html: {
    options: {
        layout: 'test/fixtures/layout/layout.html',
        beautify: true,
        templateData: {
            mykey: 'hello world!'
        }
    },
    files: {
        'tmp/layout/some.html': ['test/fixtures/layout/some.md'],
    }
  },
});
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 2015-12-28   v1.1.1   Support `options.templateData.FILE_NAME`.

* 2015-12-27   v1.1.0   Support `options.layout` `options.templateData` and `options.beautify`.

* 2015-12-27   v1.0.0   Change some api.

* 2015-12-26   v0.0.2   Fork [grunt-marked](https://github.com/gobwas/grunt-marked).

* 2015-12-26   v0.0.1   Initial release.
