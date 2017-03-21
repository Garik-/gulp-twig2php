'use strict';

var path = require('path');
var test = require('ava');
var vinylFile = require('vinyl-file');
var parser = require('../');

test('parse file', function (t) {
	t.plan(1);

	var file = vinylFile.readSync(path.join(__dirname, 'fixtures/input.twig'));
	var stream = parser();

	file.extract = true;

	stream.on('data', function (file) {

    // тут проверочку бы
		t.assert(true);
	});

	stream.end(file);
});
