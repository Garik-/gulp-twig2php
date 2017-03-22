# gulp-tiwg2php

Compiles [Twig Templates](http://twig.sensiolabs.org/) to native PHP using [Twig.js](https://github.com/twigjs/twig.js)

## Install

Download the latest release from github: https://github.com/Garik-/gulp-twig2php/releases or via NPM:

```
npm install gulp-tiwg2php --save
```
## Demo
https://diafan.github.io/gulp-twig2php/
## Usage

```JS
'use strict';

var gulp = require('gulp'),
    rename = require('gulp-rename'),
    compile = require('gulp-twig2php'),
    path = {
        build: {
            php: 'views'
        },
        src: {
            php: 'templates/*.twig'
        }
    };

gulp.task('php:build', function() {
    gulp.src(path.src.php)
        .pipe(compile())
        .pipe(rename({ extname: ".php" }))
        .pipe(gulp.dest(path.build.php));
});

gulp.task('build', ['php:build']);
gulp.task('default', ['build']);
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
