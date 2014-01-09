#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var argv = require('optimist').argv;
var Template = require('../index.js');

// parse arguments
if (argv.h || argv.help || argv._.length === 0) {
    return fs.createReadStream(path.join(__dirname, 'usage.txt'))
        .pipe(process.stdout);
}

var template = argv.t || argv.template || 'uber';
var templates = argv.d || argv.directory ||
    path.join(__dirname, '..', 'templates');
var dest = argv._[0];
var description = argv._[1];

// create template
var tmpl = new Template(template, {
    templates: templates,
    description: description,
    logger: console
});
tmpl.init(dest, function (err) {
    if (err) {
        console.error(err.message);
        return process.exit(1);
    }

    process.stdin.destroy();
});
