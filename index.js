'use strict';

var through = require('through2'),
    gutil = require('gulp-util'),
    parser = require('./parser');

module.exports = function(options) {
    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        // Если файл представлен потоком
        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-twig2php', 'Streaming not supported'));
            return;
        }

        // Код плагина
        file.contents = new Buffer(parser(file.contents.toString(), options));

        // Возвращаем обработанный файл для следующего плагина
        this.push(file);
        cb();
    });
};
